export interface EncryptedMessage {
  ciphertext: string;
  iv: number[];
  encrypted: boolean;
}

export interface ExportedKey {
  format: string;
  keyData: number[];
}

export interface KeyBundle {
  identityKey: ExportedKey;
  signedPreKey: {
    key: ExportedKey;
    signature: string | null;
  };
  oneTimePreKeys: Array<{
    id: number[];
    publicKey: ExportedKey;
  }>;
}

