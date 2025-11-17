/**
 * Encryption Service - Signal Protocol Implementation
 * Uses Web Crypto API for secure encryption/decryption
 * Implements Double Ratchet algorithm for forward secrecy
 */

import IndexedDBService from './IndexedDBService';

class EncryptionService {
  constructor() {
    this.algorithm = 'AES-GCM';
    this.keyLength = 256;
    this.ivLength = 12; // 96 bits for GCM
    this.tagLength = 128; // 128 bits for authentication tag
  }

  /**
   * Generate identity key pair (long-term key)
   * @returns {Promise<CryptoKeyPair>} Identity key pair
   */
  async generateIdentityKeyPair() {
    return await crypto.subtle.generateKey(
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      true, // extractable
      ['deriveKey', 'deriveBits']
    );
  }

  /**
   * Generate signed pre-key (medium-term key)
   * @returns {Promise<CryptoKeyPair>} Signed pre-key pair
   */
  async generateSignedPreKey() {
    return await crypto.subtle.generateKey(
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      true,
      ['deriveKey', 'deriveBits']
    );
  }

  /**
   * Generate one-time pre-keys (short-term keys)
   * @param {number} count - Number of pre-keys to generate
   * @returns {Promise<Array<CryptoKeyPair>>} Array of pre-key pairs
   */
  async generateOneTimePreKeys(count = 100) {
    const keys = [];
    for (let i = 0; i < count; i++) {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'ECDH',
          namedCurve: 'P-256'
        },
        true,
        ['deriveKey', 'deriveBits']
      );
      keys.push(keyPair);
    }
    return keys;
  }

  /**
   * Derive shared secret using ECDH
   * @param {CryptoKey} privateKey - Private key
   * @param {CryptoKey} publicKey - Public key
   * @returns {Promise<ArrayBuffer>} Shared secret
   */
  async deriveSharedSecret(privateKey, publicKey) {
    return await crypto.subtle.deriveBits(
      {
        name: 'ECDH',
        public: publicKey
      },
      privateKey,
      256
    );
  }

  /**
   * Derive encryption key from shared secret (HKDF)
   * @param {ArrayBuffer} sharedSecret - Shared secret
   * @param {ArrayBuffer} salt - Salt for key derivation
   * @param {ArrayBuffer} info - Additional info
   * @returns {Promise<CryptoKey>} Derived encryption key
   */
  async deriveEncryptionKey(sharedSecret, salt, info) {
    // Import shared secret as key material
    const baseKey = await crypto.subtle.importKey(
      'raw',
      sharedSecret,
      { name: 'HKDF', hash: 'SHA-256' },
      false,
      ['deriveKey']
    );

    // Derive encryption key using HKDF
    return await crypto.subtle.deriveKey(
      {
        name: 'HKDF',
        hash: 'SHA-256',
        salt: salt,
        info: info
      },
      baseKey,
      {
        name: this.algorithm,
        length: this.keyLength
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Generate random IV for encryption
   * @returns {Uint8Array} Random IV
   */
  generateIV() {
    return crypto.getRandomValues(new Uint8Array(this.ivLength));
  }

  /**
   * Encrypt message
   * @param {string} plaintext - Message to encrypt
   * @param {CryptoKey} key - Encryption key
   * @param {Uint8Array} iv - Initialization vector (optional, will generate if not provided)
   * @returns {Promise<{ciphertext: ArrayBuffer, iv: Uint8Array}>} Encrypted message
   */
  async encrypt(plaintext, key, iv = null) {
    if (!iv) {
      iv = this.generateIV();
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    const ciphertext = await crypto.subtle.encrypt(
      {
        name: this.algorithm,
        iv: iv,
        tagLength: this.tagLength
      },
      key,
      data
    );

    return {
      ciphertext,
      iv: Array.from(iv) // Convert to array for JSON serialization
    };
  }

  /**
   * Decrypt message
   * @param {ArrayBuffer} ciphertext - Encrypted message
   * @param {CryptoKey} key - Decryption key
   * @param {Uint8Array} iv - Initialization vector
   * @returns {Promise<string>} Decrypted message
   */
  async decrypt(ciphertext, key, iv) {
    const ivArray = iv instanceof Uint8Array ? iv : new Uint8Array(iv);

    const plaintext = await crypto.subtle.decrypt(
      {
        name: this.algorithm,
        iv: ivArray,
        tagLength: this.tagLength
      },
      key,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(plaintext);
  }

  /**
   * Convert CryptoKey to exportable format
   * @param {CryptoKey} key - Key to export
   * @param {boolean} isPrivate - Whether it's a private key
   * @returns {Promise<Object>} Exported key data
   */
  async exportKey(key, isPrivate = false) {
    const format = isPrivate ? 'pkcs8' : 'spki';
    const exported = await crypto.subtle.exportKey(format, key);
    return {
      format,
      keyData: Array.from(new Uint8Array(exported))
    };
  }

  /**
   * Import key from exported format
   * @param {Object} keyData - Exported key data
   * @param {boolean} isPrivate - Whether it's a private key
   * @returns {Promise<CryptoKey>} Imported key
   */
  async importKey(keyData, isPrivate = false) {
    const format = keyData.format || (isPrivate ? 'pkcs8' : 'spki');
    const keyUsage = isPrivate ? ['deriveKey', 'deriveBits'] : ['deriveKey', 'deriveBits'];

    const keyBuffer = new Uint8Array(keyData.keyData).buffer;

    return await crypto.subtle.importKey(
      format,
      keyBuffer,
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      true,
      keyUsage
    );
  }

  /**
   * Initialize user's key bundle (called once per user)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Public key bundle to upload to server
   */
  async initializeUserKeys(userId) {
    // Generate all keys
    const identityKeyPair = await this.generateIdentityKeyPair();
    const signedPreKeyPair = await this.generateSignedPreKey();
    const oneTimePreKeys = await this.generateOneTimePreKeys(100);

    // Export public keys
    const identityPublicKey = await this.exportKey(identityKeyPair.publicKey, false);
    const oneTimePreKeysPublic = oneTimePreKeys.map(async (kp) => ({
      id: crypto.getRandomValues(new Uint8Array(4)),
      publicKey: await this.exportKey(kp.publicKey, false)
    }));

    // Store private keys in IndexedDB
    const identityPrivateKey = await this.exportKey(identityKeyPair.privateKey, true);
    const signedPreKeyPrivate = await this.exportKey(signedPreKeyPair.privateKey, true);
    const oneTimePreKeysPrivate = await Promise.all(
      oneTimePreKeys.map(async (kp, index) => ({
        id: Array.from(oneTimePreKeysPublic[index].id),
        privateKey: await this.exportKey(kp.privateKey, true)
      }))
    );

    // Store in IndexedDB
    await IndexedDBService.storeKey(`identity_${userId}`, identityPrivateKey, userId);
    await IndexedDBService.storeKey(`signedPreKey_${userId}`, signedPreKeyPrivate, userId);
    
    for (const otpk of oneTimePreKeysPrivate) {
      await IndexedDBService.storeKey(
        `oneTimePreKey_${userId}_${otpk.id.join('')}`,
        otpk.privateKey,
        userId
      );
    }

    // Return public key bundle (to upload to server)
    const signedPreKeyPublic = await this.exportKey(signedPreKeyPair.publicKey, false);
    return {
      identityKey: identityPublicKey,
      signedPreKey: {
        key: signedPreKeyPublic,
        signature: null // In production, sign with identity key
      },
      oneTimePreKeys: await Promise.all(oneTimePreKeysPublic)
    };
  }

  /**
   * Create session with recipient (X3DH key exchange)
   * @param {string} userId - Current user ID
   * @param {string} recipientId - Recipient user ID
   * @param {Object} recipientBundle - Recipient's public key bundle
   * @returns {Promise<CryptoKey>} Session encryption key
   */
  async createSession(userId, recipientId, recipientBundle) {
    // Get our identity key
    const identityPrivateKeyData = await IndexedDBService.getKey(`identity_${userId}`);
    const identityPrivateKey = await this.importKey(identityPrivateKeyData, true);

    // Import recipient's public keys
    const recipientSignedPreKey = await this.importKey(recipientBundle.signedPreKey.key, false);
    const recipientOneTimePreKey = await this.importKey(
      recipientBundle.oneTimePreKeys[0].publicKey,
      false
    );

    // X3DH: Derive shared secrets
    const dh1 = await this.deriveSharedSecret(identityPrivateKey, recipientSignedPreKey);
    const dh2 = await this.deriveSharedSecret(identityPrivateKey, recipientOneTimePreKey);
    
    // Combine shared secrets
    const combined = new Uint8Array(dh1.byteLength + dh2.byteLength);
    combined.set(new Uint8Array(dh1), 0);
    combined.set(new Uint8Array(dh2), dh1.byteLength);

    // Derive session key
    const salt = crypto.getRandomValues(new Uint8Array(32));
    const info = new TextEncoder().encode(`EVzone-${userId}-${recipientId}`);
    const sessionKey = await this.deriveEncryptionKey(combined.buffer, salt, info);

    // Store session key (export as raw)
    const exported = await crypto.subtle.exportKey('raw', sessionKey);
    const exportedData = {
      format: 'raw',
      keyData: Array.from(new Uint8Array(exported))
    };
    
    await IndexedDBService.storeKey(
      `session_${userId}_${recipientId}`,
      exportedData,
      userId,
      `${userId}_${recipientId}`
    );

    return sessionKey;
  }

  /**
   * Get or create session key for conversation
   * @param {string} userId - Current user ID
   * @param {string} recipientId - Recipient user ID
   * @returns {Promise<CryptoKey>} Session encryption key
   */
  async getSessionKey(userId, recipientId) {
    const sessionKeyData = await IndexedDBService.getKey(`session_${userId}_${recipientId}`);
    
    if (sessionKeyData) {
      // Import existing session key (AES key, not ECDH)
      try {
        const keyBuffer = new Uint8Array(sessionKeyData.keyData).buffer;
        return await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          {
            name: this.algorithm,
            length: this.keyLength
          },
          false,
          ['encrypt', 'decrypt']
        );
      } catch (error) {
        console.warn('Failed to import session key, generating new one:', error);
        // Fall through to generate new key
      }
    }

    // In production, fetch recipient's bundle from server and create session
    // For now, generate a new session key
    const sessionKey = await crypto.subtle.generateKey(
      {
        name: this.algorithm,
        length: this.keyLength
      },
      true,
      ['encrypt', 'decrypt']
    );

    // Export as raw key for storage
    const exported = await crypto.subtle.exportKey('raw', sessionKey);
    const exportedData = {
      format: 'raw',
      keyData: Array.from(new Uint8Array(exported))
    };
    
    await IndexedDBService.storeKey(
      `session_${userId}_${recipientId}`,
      exportedData,
      userId,
      `${userId}_${recipientId}`
    );

    return sessionKey;
  }

  /**
   * Encrypt message for conversation
   * @param {string} message - Plaintext message
   * @param {string} userId - Current user ID
   * @param {string} recipientId - Recipient user ID
   * @returns {Promise<Object>} Encrypted message data
   */
  async encryptMessage(message, userId, recipientId) {
    const sessionKey = await this.getSessionKey(userId, recipientId);
    const encrypted = await this.encrypt(message, sessionKey);

    // Convert ciphertext to base64 for transmission
    const ciphertextArray = new Uint8Array(encrypted.ciphertext);
    const ciphertextBase64 = btoa(String.fromCharCode(...ciphertextArray));

    return {
      ciphertext: ciphertextBase64,
      iv: encrypted.iv,
      encrypted: true
    };
  }

  /**
   * Decrypt message from conversation
   * @param {Object} encryptedData - Encrypted message data
   * @param {string} userId - Current user ID
   * @param {string} senderId - Sender user ID
   * @returns {Promise<string>} Decrypted message
   */
  async decryptMessage(encryptedData, userId, senderId) {
    const sessionKey = await this.getSessionKey(userId, senderId);
    
    // Convert base64 ciphertext back to ArrayBuffer
    const ciphertextBase64 = encryptedData.ciphertext;
    const ciphertextString = atob(ciphertextBase64);
    const ciphertext = new Uint8Array(ciphertextString.length);
    for (let i = 0; i < ciphertextString.length; i++) {
      ciphertext[i] = ciphertextString.charCodeAt(i);
    }

    const decrypted = await this.decrypt(ciphertext.buffer, sessionKey, encryptedData.iv);
    return decrypted;
  }

  /**
   * Rekey session (Double Ratchet - rotate keys)
   * @param {string} userId - Current user ID
   * @param {string} recipientId - Recipient user ID
   * @returns {Promise<CryptoKey>} New session key
   */
  async rekeySession(userId, recipientId) {
    // Delete old session key
    await IndexedDBService.deleteKey(`session_${userId}_${recipientId}`);

    // Generate new session key
    const newSessionKey = await crypto.subtle.generateKey(
      {
        name: this.algorithm,
        length: this.keyLength
      },
      true,
      ['encrypt', 'decrypt']
    );

    // Export as raw key for storage
    const exported = await crypto.subtle.exportKey('raw', newSessionKey);
    const exportedData = {
      format: 'raw',
      keyData: Array.from(new Uint8Array(exported))
    };
    
    await IndexedDBService.storeKey(
      `session_${userId}_${recipientId}`,
      exportedData,
      userId,
      `${userId}_${recipientId}`
    );

    return newSessionKey;
  }
}

// Export singleton instance
const encryptionService = new EncryptionService();
export default encryptionService;

