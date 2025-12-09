/**
 * IndexedDB Service for Secure Key Storage
 * Stores encryption keys securely in browser IndexedDB
 */

import type { ExportedKey } from '../types/encryption';

const DB_NAME = 'EVzoneSecureKeys';
const DB_VERSION = 1;
const STORE_NAME = 'keys';

interface KeyRecord {
  id: string;
  keyData: ExportedKey;
  userId: string | null;
  conversationId: string | null;
  createdAt: string;
  updatedAt: string;
}

class IndexedDBService {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase> | null = null;

  /**
   * Initialize IndexedDB database
   */
  async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise<IDBDatabase>((resolve, reject) => {
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
        const db = (event.target as IDBOpenDBRequest).result;
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
   */
  async storeKey(
    id: string,
    keyData: ExportedKey,
    userId: string | null = null,
    conversationId: string | null = null
  ): Promise<void> {
    await this.init();
    
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const data: KeyRecord = {
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
   */
  async getKey(id: string): Promise<ExportedKey | null> {
    await this.init();
    
    return new Promise<ExportedKey | null>((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

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
   */
  async getUserKeys(userId: string): Promise<ExportedKey[]> {
    await this.init();
    
    return new Promise<ExportedKey[]>((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        resolve(request.result.map((r: KeyRecord) => r.keyData));
      };
      request.onerror = () => reject(new Error('Failed to retrieve user keys'));
    });
  }

  /**
   * Get all keys for a conversation
   */
  async getConversationKeys(conversationId: string): Promise<ExportedKey[]> {
    await this.init();
    
    return new Promise<ExportedKey[]>((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('conversationId');
      const request = index.getAll(conversationId);

      request.onsuccess = () => {
        resolve(request.result.map((r: KeyRecord) => r.keyData));
      };
      request.onerror = () => reject(new Error('Failed to retrieve conversation keys'));
    });
  }

  /**
   * Delete a key
   */
  async deleteKey(id: string): Promise<void> {
    await this.init();
    
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete key'));
    });
  }

  /**
   * Delete all keys for a user (logout)
   */
  async deleteUserKeys(userId: string): Promise<void> {
    await this.init();
    
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('userId');
      const request = index.openCursor(IDBKeyRange.only(userId));

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
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
  async clearAll(): Promise<void> {
    await this.init();
    
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

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

