export type CallType = 'voice' | 'video';
export type CallState = 'dialing' | 'ringing' | 'connecting' | 'connected' | 'ended';

export interface ActiveCall {
  id: string;
  type: CallType;
  state: CallState;
  contact: string;
  avatar?: string;
  startTime?: number;
}

export interface CallContextValue {
  activeCall: ActiveCall | null;
  isInCall: boolean;
  startCall: (type: CallType, contact: string) => void;
  endCall: () => void;
  updateCallState: (state: CallState) => void;
}

export interface CallBannerProps {
  call: ActiveCall;
  duration: number;
  onTap: () => void;
  onEnd: () => void;
}

