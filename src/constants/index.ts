export const USER_ROLES = {
  SUPER_ADMIN: 0,
  PARENT: 1,
  TEACHER: 2,
  STAFF: 3,
  SUPERVISOR: 4,
};

export const STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
};

export const SORT_ORDER = ['desc', 'asc', 'DESC', 'ASC'];

export const IS_USER_VERIFIED = {
  FALSE: 0,
  TRUE: 1,
};

export const IS_MFA = {
  FALSE: 0,
  TRUE: 1,
};

export const IS_RETURNED_OR_EXCHANGED = {
  FALSE: 0,
  TRUE: 1,
};

export const IS_READ = {
  FALSE: 0,
  TRUE: 1,
};

export const IS_SENT = {
  FALSE: 0,
  TRUE: 1,
};

export const YES_NO_OR_CURRENTLY = {
  NO: 0,
  YES: 1,
  CURRENTLY: 2,
};

export const CHAT_FEATURE = {
  DISABLE: 0,
  ENABLE: 1,
};

export const REQUEST_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
  0: 'pending',
  1: 'approved',
  2: 'rejected',
};

export const CART_ITEM_STATUS = {
  PENDING: 0,
  ORDERED: 1,
  PROCESSING: 2,
};

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  MEETING = 'meeting',
}

export const CHAT_TYPE = {
  ONETOONE: 'one_to_one',
  GROUP_CHAT: 'group_chat',
};

export const NOTIFICATION_TYPE = {
  CHAT: 'chat',
  ANNOUNCEMENT: 'announcement',
  ZOOM_MEETINGS: 'zoom_meetings',
  ZOOM_ADMIN_MEETINGS: 'zoom_admin_meetings',
};

export enum SubscriptionPlanInterval {
  MONTHLY = 30,
  YEARLY = 365,
  HALF_YEALY = 180,
}

export const SUBSCRIPTION_CRON_CHECK = {
  CANCELLED: 0,
  ACTIVE: 1,
  COMPLETED: 2,
};

export const IS_AUTO_RENEW = {
  FALSE: 0,
  TRUE: 1,
};

export const REQUEST_TYPE = {
  time_off: 'Time off',
  sick: 'Sick',
};

export enum SUBSCRIPTION_DEVICE_TYPE {
  ANDROID = 'android',
  IOS = 'ios',
}

export const IS_ACCESSED = {
  FALSE: 0,
  TRUE: 1,
};

export enum RequestType {
  TIME_OFF = 'time_off',
  SICK = 'sick',
}

export enum UserType {
  TEACHER = 'teacher',
  PARENT = 'parent',
  ALL = 'all',
  SPECIFIC = 'specific',
}

export enum ExchangeOrReturnRequestType {
  EXCHANGE = 'exchange',
  RETURN = 'return',
}

export const IS_EVENT_ATTENDING = {
  YES: 1,
  NO: 0,
};

export enum PaymentStatus {
  PROCESSING = 'processing',
  CANCELED = 'canceled',
  SUCCEEDED = 'succeeded',
}

export enum LOG_EVENTS_TYPE {
  ABSENCES = 'absences',
  OBSERVATIONS = 'observations',
  CHECK_INS_OUTS = 'check ins outs',
  PHOTOS = 'photos',
  VIDEOS = 'videos',
  MISCELLANEOUS = 'miscellaneous',
  NOTES = 'notes',
  FOOD = 'foods',
  NAPS = 'naps',
  POTTY = 'potty',
  CONGRATULATIONS = 'congratulations',
  INCIDENTS = 'incidents',
  HEALTH_CHECKS = 'health checks',
  MEDICATIONS = 'medications',
}

export const AVAILIBILITY = {
  YES: 1,
  NO: 0,
};

export const CHUNK_SIZE = 1 * 1024 * 1024; // 5 mb

export const IMAGE_TYPES = [
  'jpg',
  'jpeg',
  'jfif',
  'pjpeg',
  'pjp',
  'png',
  'webp',
];

export const MEETING_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
  EXPIRED: 3,
};

export const IS_PUBLISHED = {
  FALSE: 0,
  TRUE: 1,
};

export enum EventType {
  MEETING = 'meeting',
  EVENT = 'event',
}
