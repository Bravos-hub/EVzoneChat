/**
 * Encryption Context
 * Provides encryption functionality to components
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import EncryptionService from '../services/EncryptionService';
import IndexedDBService from '../services/IndexedDBService';

const EncryptionContext = createContext();

export const useEncryption = () => {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error('useEncryption must be used within EncryptionProvider');
  }
  return context;
};

export const EncryptionProvider = ({ children, userId = 'me' }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(true);
  const [initializationError, setInitializationError] = useState(null);
  const [rekeyCount, setRekeyCount] = useState(0);

  /**
   * Initialize encryption for user
   */
  const initializeEncryption = useCallback(async () => {
    try {
      // Check if keys already exist
      const existingIdentity = await IndexedDBService.getKey(`identity_${userId}`);
      
      if (!existingIdentity) {
        // Initialize new keys
        const publicBundle = await EncryptionService.initializeUserKeys(userId);
        console.log('Encryption initialized for user:', userId);
        console.log('Public key bundle (upload to server):', publicBundle);
      } else {
        console.log('Encryption keys already exist for user:', userId);
      }

      setIsInitialized(true);
      setInitializationError(null);
    } catch (error) {
      console.error('Failed to initialize encryption:', error);
      setInitializationError(error.message);
      setIsInitialized(false);
    }
  }, [userId]);

  /**
   * Encrypt message
   */
  const encryptMessage = useCallback(async (message, recipientId) => {
    if (!isEncryptionEnabled) {
      return { text: message, encrypted: false };
    }

    try {
      const encrypted = await EncryptionService.encryptMessage(message, userId, recipientId);
      return {
        ...encrypted,
        text: message // Keep original for display before sending
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      // Fallback to unencrypted
      return { text: message, encrypted: false, error: error.message };
    }
  }, [userId, isEncryptionEnabled]);

  /**
   * Decrypt message
   */
  const decryptMessage = useCallback(async (encryptedData, senderId) => {
    if (!encryptedData.encrypted) {
      return encryptedData.text || encryptedData.ciphertext;
    }

    try {
      const decrypted = await EncryptionService.decryptMessage(encryptedData, userId, senderId);
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      return '[Encrypted message - decryption failed]';
    }
  }, [userId]);

  /**
   * Rekey session (Double Ratchet)
   */
  const rekeySession = useCallback(async (recipientId) => {
    try {
      await EncryptionService.rekeySession(userId, recipientId);
      setRekeyCount(prev => prev + 1);
      console.log('Session rekeyed with:', recipientId);
    } catch (error) {
      console.error('Rekeying failed:', error);
      throw error;
    }
  }, [userId]);

  /**
   * Clear all encryption keys (logout)
   */
  const clearKeys = useCallback(async () => {
    try {
      await IndexedDBService.deleteUserKeys(userId);
      setIsInitialized(false);
      console.log('Encryption keys cleared for user:', userId);
    } catch (error) {
      console.error('Failed to clear keys:', error);
    }
  }, [userId]);

  // Initialize on mount
  useEffect(() => {
    if (userId && !isInitialized) {
      initializeEncryption();
    }
  }, [userId, isInitialized, initializeEncryption]);

  const value = {
    isInitialized,
    isEncryptionEnabled,
    initializationError,
    encryptMessage,
    decryptMessage,
    rekeySession,
    clearKeys,
    initializeEncryption,
    setEncryptionEnabled: setIsEncryptionEnabled,
    rekeyCount
  };

  return (
    <EncryptionContext.Provider value={value}>
      {children}
    </EncryptionContext.Provider>
  );
};

