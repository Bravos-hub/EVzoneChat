/**
 * Encryption Context
 * Provides encryption functionality to components
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type React from 'react';
import EncryptionService from '../services/EncryptionService';
import IndexedDBService from '../services/IndexedDBService';
import type { EncryptedMessage } from '../types/encryption';

interface EncryptionContextValue {
  isInitialized: boolean;
  isEncryptionEnabled: boolean;
  initializationError: string | null;
  encryptMessage: (message: string, recipientId: string) => Promise<EncryptedMessage & { text: string }>;
  decryptMessage: (encryptedData: EncryptedMessage | { text: string; encrypted?: boolean }, senderId: string) => Promise<string>;
  rekeySession: (recipientId: string) => Promise<void>;
  clearKeys: () => Promise<void>;
  initializeEncryption: () => Promise<void>;
  setEncryptionEnabled: (enabled: boolean) => void;
  rekeyCount: number;
}

const EncryptionContext = createContext<EncryptionContextValue | undefined>(undefined);

export const useEncryption = (): EncryptionContextValue => {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error('useEncryption must be used within EncryptionProvider');
  }
  return context;
};

interface EncryptionProviderProps {
  children: ReactNode;
  userId?: string;
}

export const EncryptionProvider: React.FC<EncryptionProviderProps> = ({ children, userId = 'me' }) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState<boolean>(true);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [rekeyCount, setRekeyCount] = useState<number>(0);

  /**
   * Initialize encryption for user
   */
  const initializeEncryption = useCallback(async (): Promise<void> => {
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
      setInitializationError((error as Error).message);
      setIsInitialized(false);
    }
  }, [userId]);

  /**
   * Encrypt message
   */
  const encryptMessage = useCallback(async (message: string, recipientId: string): Promise<EncryptedMessage & { text: string }> => {
    if (!isEncryptionEnabled) {
      return { text: message, encrypted: false, ciphertext: '', iv: [] };
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
      return { 
        text: message, 
        encrypted: false, 
        ciphertext: '', 
        iv: []
      };
    }
  }, [userId, isEncryptionEnabled]);

  /**
   * Decrypt message
   */
  const decryptMessage = useCallback(async (
    encryptedData: EncryptedMessage | { text: string; encrypted?: boolean }, 
    senderId: string
  ): Promise<string> => {
    if (!encryptedData.encrypted || 'text' in encryptedData) {
      return (encryptedData as { text: string }).text || (encryptedData as EncryptedMessage).ciphertext;
    }

    try {
      const decrypted = await EncryptionService.decryptMessage(encryptedData as EncryptedMessage, userId, senderId);
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      return '[Encrypted message - decryption failed]';
    }
  }, [userId]);

  /**
   * Rekey session (Double Ratchet)
   */
  const rekeySession = useCallback(async (recipientId: string): Promise<void> => {
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
  const clearKeys = useCallback(async (): Promise<void> => {
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

  const value: EncryptionContextValue = {
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

