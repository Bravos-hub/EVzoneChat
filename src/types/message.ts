export interface MessageAuthor {
  id: string;
  name: string;
  avatar: string;
}

export interface BaseMessage {
  id: string;
  author: MessageAuthor;
  text: string;
  time: string;
  mine: boolean;
  read: boolean;
  encryptedData?: any;
}

export interface TextMessage extends BaseMessage {
  type?: 'text';
}

export interface ForwardedMessage extends BaseMessage {
  forwarded: boolean;
  originalAuthor: string;
  encryptedData?: any;
}

export interface ContactMessage extends BaseMessage {
  contact: any;
  encryptedData?: any;
}

export interface LocationMessage extends BaseMessage {
  location: { latitude: number; longitude: number };
  locationUrl: string;
  encryptedData?: any;
}

export interface AudioMessage extends BaseMessage {
  audioUrl: string;
  audioBlob: Blob;
  encryptedData?: any;
}

export interface VideoMessage extends BaseMessage {
  videoUrl: string;
  videoBlob: Blob;
  fileName: string;
  encryptedData?: any;
}

export interface ImageMessage extends BaseMessage {
  imageUrl: string;
  imageFile: File | Blob;
  fileName: string;
  encryptedData?: any;
}

export type Message = TextMessage | ForwardedMessage | ContactMessage | LocationMessage | AudioMessage | VideoMessage | ImageMessage;

