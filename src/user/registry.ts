import type { ComponentRegistry } from '../types';
import U01_02 from '../pages/user/OnboardingPermissionsFinal';
import U01_03 from '../pages/user/UnifiedInbox';
import U02_04 from '../pages/user/NewMessagePicker';
import U02_05 from '../pages/user/ConversationWAHeader';
import U02_06 from '../pages/user/ComposerVoice';
import U03_07 from '../pages/user/MediaViewerFS';
import U03_08 from '../pages/user/ConversationGallery';
import U03_09 from '../pages/user/SearchGlobalInThread';
import U04_10 from '../pages/user/OneToOneCall';
import U04_11 from '../pages/user/GroupCallParticipants';
import U04_12 from '../pages/user/HostControlsLobby';
import U05_13 from '../pages/user/ScreenshareWithChatPro';
import U05_14 from '../pages/user/CaptionsRecording';
import U05_15 from '../pages/user/BreakoutRoomsManager';
import U06_16 from '../pages/user/InCallReactions';
import U06_17 from '../pages/user/DeviceNetworkSettings';
import U06_18 from '../pages/user/MeetingInfoEnd';
import U07_19 from '../pages/user/MeetingCreateJoinDetail';
import U07_20 from '../pages/user/MeetingSummary';
import U07_21 from '../pages/user/CallSummary';
import U08_22 from '../pages/user/GroupChannelCreate';
import U08_23 from '../pages/user/GroupChannelDetailsModeration';
import U08_24 from '../pages/user/InviteJoinLinkQR';
import U09_25 from '../pages/user/ProfileSelfPresence';
import U09_26 from '../pages/user/ContactOrgProfiles';
import U09_27 from '../pages/user/NotificationsPrivacy';
import U10_28 from '../pages/user/SecuritySessionsDevices';
import U10_29 from '../pages/user/LTASettings';
import U10_30 from '../pages/user/ThemeExportDeleteTips';
import U11_31 from '../pages/user/DealzPromoStatusFeed';
import U11_32 from '../pages/user/ContextPanelsPack2';
import U11_33 from '../pages/user/ContextPanelsPack3';
import U12_34 from '../pages/user/SafetyCenter';
import U12_35 from '../pages/user/EdgeStatesDemo';
import U12_36 from '../pages/user/PermissionHelpers';
// Meeting components
import U_M1 from '../meetings/MeetingBooking';
import U_M2 from '../meetings/MyMeetingsList';
import U_M3 from '../meetings/MeetingBookingDetails';
import U_M4 from '../meetings/PublicBookingPage';
import U_M5 from '../meetings/MeetingConfirmationJoin';
import U_M6 from '../meetings/MyAvailabilityWorkingHours';
import U_M7 from '../meetings/LiveMeetingShell';

const registry: ComponentRegistry = {
  'U01-02': U01_02,
  'U01-03': U01_03,
  'U02-04': U02_04,
  'U02-05': U02_05,
  'U02-06': U02_06,
  'U03-07': U03_07,
  'U03-08': U03_08,
  'U03-09': U03_09,
  'U04-10': U04_10,
  'U04-11': U04_11,
  'U04-12': U04_12,
  'U05-13': U05_13,
  'U05-14': U05_14,
  'U05-15': U05_15,
  'U06-16': U06_16,
  'U06-17': U06_17,
  'U06-18': U06_18,
  'U07-19': U07_19,
  'U07-20': U07_20,
  'U07-21': U07_21,
  'U08-22': U08_22,
  'U08-23': U08_23,
  'U08-24': U08_24,
  'U09-25': U09_25,
  'U09-26': U09_26,
  'U09-27': U09_27,
  'U10-28': U10_28,
  'U10-29': U10_29,
  'U10-30': U10_30,
  'U11-31': U11_31,
  'U11-32': U11_32,
  'U11-33': U11_33,
  'U12-34': U12_34,
  'U12-35': U12_35,
  'U12-36': U12_36,
  // Meeting components
  'U-M1': U_M1,
  'U-M2': U_M2,
  'U-M3': U_M3,
  'U-M4': U_M4,
  'U-M5': U_M5,
  'U-M6': U_M6,
  'U-M7': U_M7
};

export default registry;

