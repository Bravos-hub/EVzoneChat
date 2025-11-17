/**
 * IndexedDB Service for Secure Key Storage
 * Stores encryption keys securely in browser IndexedDB
 */

const DB_NAME = 'EVzoneSecureKeys';
const DB_VERSION = 1;
const STORE_NAME = 'keys';

class IndexedDBService {
  constructor() {
    this.db = null;
    this.initPromise = null;
  }

  /**
   * Initialize IndexedDB database
   */
  async init() {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('IndexedDB is not supported in this browser'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          objectStore.createIndex('userId', 'userId', { unique: false });
          objectStore.createIndex('conversationId', 'conversationId', { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  /**
   * Store a key securely
   * @param {string} id - Unique identifier for the key
   * @param {Object} keyData - Key data to store
   * @param {string} userId - User ID (optional)
   * @param {string} conversationId - Conversation ID (optional)
   */
  async storeKey(id, keyData, userId = null, conversationId = null) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const data = {
        id,
        keyData,
        userId,
        conversationId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to store key'));
    });
  }

  /**
   * Retrieve a key by ID
   * @param {string} id - Key identifier
   * @returns {Promise<Object|null>} Key data or null if not found
   */
  async getKey(id) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result ? request.result.keyData : null);
      };
      request.onerror = () => reject(new Error('Failed to retrieve key'));
    });
  }

  /**
   * Get all keys for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of keys
   */
  async getUserKeys(userId) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        resolve(request.result.map(r => r.keyData));
      };
      request.onerror = () => reject(new Error('Failed to retrieve user keys'));
    });
  }

  /**
   * Get all keys for a conversation
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Array>} Array of keys
   */
  async getConversationKeys(conversationId) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('conversationId');
      const request = index.getAll(conversationId);

      request.onsuccess = () => {
        resolve(request.result.map(r => r.keyData));
      };
      request.onerror = () => reject(new Error('Failed to retrieve conversation keys'));
    });
  }

  /**
   * Delete a key
   * @param {string} id - Key identifier
   */
  async deleteKey(id) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete key'));
    });
  }

  /**
   * Delete all keys for a user (logout)
   * @param {string} userId - User ID
   */
  async deleteUserKeys(userId) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('userId');
      const request = index.openCursor(IDBKeyRange.only(userId));

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(new Error('Failed to delete user keys'));
    });
  }

  /**
   * Clear all keys (use with caution)
   */
  async clearAll() {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to clear keys'));
    });
  }
}

// Export singleton instance
const indexedDBService = new IndexedDBService();
export default indexedDBService;

