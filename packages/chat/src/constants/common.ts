import {Platform} from 'react-native';
import Keychain from 'react-native-keychain';
// import Keys from 'react-native-keys';
import DeviceInfo from 'react-native-device-info';

export const RECAPTCHA_TIMEOUT: number = 10000;
export const ENABLE_RECAPTCHA = false;

export enum LANGUAGE {
  EN = 'en',
  VI = 'vi',
  ALL = 'ALL',
}

export const PIN_DIGIT = 6;

export const SMS_OTP_DIGIT = 6;

export const VN_PHONE_MAX_DIGIT = 10;
export const FORMAT_VN_PHONE_MAX_DIGIT = 12;

export const VN_PHONE_COUNTRY_CODE = '+84';

export const SMS_OTP_TIMEOUT = 90;

export const WITHDRAWAL_TIMEOUT = 600;
export const WITHDRAWAL_BACK_TIMEOUT = 30000;

export const HEADER_MAX_OFF_SET = 300;

export const TOP_OFF_SET = 44;

export const TODO_API_TIMEOUT = 4000;

export const MAX_ADDRESS_LENGTH = 100;

export const PHONE_PLACEHOLDER = '000 000 000';

export const MIN_DATE = '1900-01-01';

export const PASSWORD_RULES = {
  char: /^([a-zA-Z!@#$%^&*_=+\-/\d]+)$/,
  simple: /^(?!pass)/i,
  length: /^.{8,20}$/,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /\d/,
};

export const VN_ID_REGEX = /^(\d{12})$/;

export const PIN_VALIDATE_REGEX = /^(?!.*\b(\d)\1+\b)\d+$/;

export const PHONE_VALID_REGEX = /^[0][1-9]\d{8}$/;
export const PHONE_WITHOUT_PREFIX_ZERO_VALID_REGEX = /^[1-9]\d{8}$/;

const VIETNAMESE_REGEX =
  'ĐđAÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĀEÉÈẺẼẸÊẾỀỂỄỆĒIÍÌỈĨỊĪOÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢŌUÚÙỦŨỤƯỨỪỬỮỰŪYÝỲỶỸỴaáàảãạăắằẳẵặâấầẩẫậāeéèẻẽẹêếềểễệēiíìỉĩịīoóòỏõọôốồổỗộơớờởỡợōuúùủũụưứừửừựữūyýỳỷỹỵ';

export const VIETNAMESE_NAME_REGEX = new RegExp(
  `^[a-zA-Z${VIETNAMESE_REGEX}]{1}[a-zA-Z${VIETNAMESE_REGEX} ’']{0,199}$`,
  'i',
);

export const VIETNAMESE_REGEX_FAVORITE_NAME = new RegExp(
  `^([a-zA-Z${VIETNAMESE_REGEX}0-9 _.\-]+)*$`,
  'i',
);

export const ADDRESS_REGEX = new RegExp(
  `^[a-z0-9A-Z${VIETNAMESE_REGEX}]{1}[a-z0-9A-Z${VIETNAMESE_REGEX} .,’'/-]{0,199}$`,
  'i',
);

export const VISA_REGEX = /^[a-z0-9A-Z]+$/g;

export const BANK_BEN_ID_REGEX = /^9704\d{2}$/;
export const FINANCIAL_INSTITUTION_ID_REGEX = /^0084\d{2}$/;

export enum CARD_TYPE {
  MASTERCARD = 'MASTERCARD',
  VISA = 'VISA',
  AMEX = 'AMEX',
  JCB = 'JCB',
  UNION = 'UNION',
}

export const EMAIL_VALIDATE_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

// export const CARD_OPTION = {
//   [CARD_TYPE.MASTERCARD]: {
//     regex:
//       /^(5[1-5][0-9]+|2(22[1-9][0-9]+|2[3-9][0-9]+|[3-6][0-9]+|7[0-1][0-9]+|720[0-9]+))$/,
//     icon: IMasterCard,
//   },
//   [CARD_TYPE.VISA]: {
//     regex: /^(4[0-9]+(?:[0-9]+)?)$/,
//     icon: IVisa,
//   },
//   [CARD_TYPE.AMEX]: {
//     regex: /^3[47][0-9]+$/,
//     icon: IAmex,
//   },
//   [CARD_TYPE.JCB]: {
//     regex: /^(?:2131|1800|35\d{3})\d+$/,
//     icon: IJcb,
//   },
//   [CARD_TYPE.UNION]: {
//     regex: /^(62[0-9]+)$/,
//     icon: IUnionPay,
//   },
// } as const;

export const MEMORY_KEY = {
  CLIENT_AUTH: 'CLIENT_AUTH',
  USER_AUTH: 'USER_AUTH',
  SESSION_ID: 'SESSION_ID',
  HV_ACCESS_TOKEN: 'HV_ACCESS_TOKEN',
  ONBOARDING_TOKEN: 'ONBOARDING_TOKEN',
} as const;

export const STORAGE_KEY = {
  LANGUAGE: 'LANGUAGE',
  CUSTOMER_ID: 'CIF_ID',
  CUSTOMER_DETAIL: 'CIF_DETAIL',
  GUEST_INFORMATION: 'GUEST_INFORMATION',
  BIOMETRIC_SUPPORTED_TYPE: 'BIOMETRIC_SUPPORTED_TYPE',
  PIN_ENTRY_LIMIT: 'PIN_ENTRY_LIMIT',
  BIOMETRIC_ENTRY_LIMIT: 'BIOMETRIC_ENTRY_LIMIT',
  INTRO_VIRTUAL_CARD_DISABLE: 'INTRO_VIRTUAL_CARD_DISABLE',
  INIT_ROUTE: 'INIT_ROUTE',
  INIT_ROUTE_PROPS: 'INIT_ROUTE_PROPS',
  RESTART_REASON: 'RESTART_REASON',
  // For mock only
  MOCK_DEVICE_ID: 'MOCK_DEVICE_ID',
  CITY_LIST: 'CITY_LIST',
  DISTRICT_LIST: 'DISTRICT_LIST',
  WARD_LIST: 'WARD_LIST',

  HD_REQUEST_UID: 'HD_REQUEST_UID',
  //TODO Thuc phan remove
  HD_CITY_LIST: 'HD_CITY_LIST',
  HD_DISTRICT_LIST: 'HD_DISTRICT_LIST',
  HD_WARD_LIST: 'HD_WARD_LIST',
  APP_ROUTE_CONFIG: 'APP_ROUTE_CONFIG',

  INSTALL_ATTRIBUTION: 'INSTALL_ATTRIBUTION',
  LUCKY_SPIN_LAUNCHED_RULES: 'LUCKY_SPIN_LAUNCHED_RULES',
  FX_SALES: 'FX_SALES',
  VNEID_CONSENT_ID: 'VNEID_CONSENT_ID',
} as const;

export const WHITE_LIST_STORAGE_KEY = [STORAGE_KEY.BIOMETRIC_SUPPORTED_TYPE];

export enum HV_WORKFLOW {
  DOCUMENT = 'document_verification',
  FACE_REGISTRATION = 'selfie_verification',
  FACE_AUTHENTICATION = 'selfie_faceAuth',
  NFC_FACE_REGISTRATION = 'selfie_nfc_id_verification',
  QR_SCAN = 'qr_scan',
  CREDIT_CARD = 'credit_card_flow',
  CREDIT_CARD_SCAN_ID = 'credit_card_flow_vikki',
  CREDIT_CARD_SCAN_FACE = 'selfie_faceAuth_creditcard',
  PASSPORT_VERIFICATION = 'passport_verification',
  NFC = 'workflow_nfc',
}

export enum FACE_STATUS {
  PASS = 'pass',
  MANUAL_REVIEW = 'manualReview',
  AUTO_APPROVED = 'auto_approved',
  NEEDS_REVIEW = 'needs_review',
  AUTO_DECLINED = 'auto_declined',
  USER_CANCELLED = 'user_cancelled',
  ERROR = 'error',
}

export enum PDF_SCREEN_BACK_EVENT_TYPE {
  DISPLAY_SMART_OTP_TERM = 'DISPLAY_SMART_OTP_TERM',
  DISPLAY_PAYROLL_TERM = 'DISPLAY_PAYROLL_TERM',
  DISPLAY_LOYALTY_TERM = 'DISPLAY_LOYALTY_TERM',
}

export enum DOCUMENT_TYPE {
  cmnd_old_front = 'OLD_NATIONAL_ID_CARD_FRONT',
  cmnd_old_back = 'OLD_NATIONAL_ID_CARD_BACK',
  cmnd_new_front = 'NEW_NATIONAL_ID_CARD_FRONT',
  cmnd_new_back = 'NEW_NATIONAL_ID_CARD_BACK',
  cccd_front = 'CITIZEN_ID_WITHOUT_CHIP_FRONT',
  cccd_back = 'CITIZEN_ID_WITHOUT_CHIP_BACK',
  cccd_chip_front = 'CITIZEN_ID_WITH_CHIP_FRONT',
  cccd_chip_back = 'CITIZEN_ID_WITH_CHIP_BACK',
  cc24_front = 'cc24_front',
}

export enum DOCUMENT_STATUS {
  AUTO_APPROVED = 'auto_approved',
  AUTO_DECLINED = 'auto_declined',
  NEEDS_REVIEW = 'needs_review',
  USER_CANCELLED = 'user_cancelled',
  ERROR = 'error',
}

export enum ONBOARD_NFC_STATUS {
  USER_CANCELLED = 'user_cancelled',
  AUTO_APPROVED = 'auto_approved',
  NEEDS_REVIEW = 'needs_review',
  AUTO_DECLINED = 'auto_declined',
  ERROR = 'error',
}

export enum ONBOARD_HV_STATUS {
  USER_CANCELLED = 'user_cancelled',
  AUTO_APPROVED = 'auto_approved',
  NEEDS_REVIEW = 'needs_review',
  AUTO_DECLINED = 'auto_declined',
  ERROR = 'error',
}

export const AMOUNT_MASKING = '******';

export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';
export const IS_NONE_NFC_IOS =
  Platform.OS === 'ios' &&
  ['iPhone 3', 'iPhone 4', 'iPhone 5', 'iPhone 6', 'iPhone SE (1st gen)'].some(
    model => DeviceInfo.getModel().includes(model),
  );
// export const SITE_KEY_RECAPTCHA = IS_IOS
//   ? Keys.secureFor('RECAPTCHA_SITE_KEY_IOS')
//   : Keys.secureFor('RECAPTCHA_SITE_KEY_ANDROID');

export const IS_DEBUG_MODE = process.env.NODE_ENV === 'development';

// export const IS_SIT = Keys.ENV_NAME === 'sit';

// export const IS_UAT = Keys.ENV_NAME === 'staging' || Keys.ENV_NAME === 'uat';

// export const IS_PROD = Keys.ENV_NAME === 'prod';

export const BASIC_DATE_FORMAT = 'DDMMYYYY';

export const DATE_FORMAT_DASH = 'DD-MM-YYYY';
export const DATE_FORMAT_DASH_REVERT = 'YYYY-DD-MM';

export const DATE_FORMAT_SLASH = 'DD/MM/YYYY';

export const REVERSE_DATE_FORMAT_DASH = 'YYYY-MM-DD';

export const ANDROID_ACCESSIBILITY_WHITELIST =
  'ANDROID_ACCESSIBILITY_WHITELIST';
export const FORCE_UPDATE_AND_MAINTENANCE =
  'MOBILE_CONFIG_FORCE_UPDATE_AND_MAINTENANCE';

export const CONFIG_TYPE = {
  TNC: 'TNC_CONFIG',
  DISPUTE_TRANSACTION_REASON: 'DISPUTE_TRANSACTION_REASON',
  TRANSACTION_DISPUTE_TIMEOUT: 'TRANSACTION_DISPUTE_TIMEOUT',
  TIME_DEPOSIT_CATEGORY: 'TIME_DEPOSIT_CATEGORY',
  ONBOARDING_FOREIGNER: 'ONBOARDING_FOREIGNER',
  LUCKY_SPIN_CONFIG: 'LUCKY_SPIN_CONFIG',
};

export const ONBOARDING_FOREIGNER_KEY = {
  ALLOWED_FOREIGNER_REGION: 'ALLOWED_FOREIGNER_REGION',
  NATIONALITY: 'NATIONALITY',
  AML_PEP: 'AML_PEP',
};

export const NONE_CACHE_CONFIG_TYPE = {
  CARD_TEMPLATE: 'CARD_TEMPLATE',
  PRODUCT_PROMOTION: 'PRODUCT_PROMOTION',
  MOBILE_FEATURE_FLAG: 'MOBILE_FEATURE_FLAG',
  BIOMETRIC_NFC_BASE_URL: 'BIOMETRIC_NFC_BASE_URL',
  NFC_GUIDELINE_IMAGE_BASE_URL: 'NFC_GUIDELINE_IMAGE',
  FIN_FEATURE_FLAG: 'FIN_FEATURE_FLAG',
};

export const CONFIG_TYPE_KEY = {
  LUCKY_SPIN_QUEST: 'LUCKY_SPIN_QUEST',
  LUCKY_SPIN_CAMPAIGN: 'LUCKY_SPIN_CAMPAIGN',
};

export enum PRODUCT_PROMOTION_TYPE {
  BILL_PAYMENT = 'BILL_PAYMENT',
  TERM_DEPOSIT = 'TERM_DEPOSIT',
  LOYALTY = 'LOYALTY',
  LOAN = 'LOAN',
  TOP_UP = 'TOP_UP',
}

export enum TNC_TYPE {
  DATA = 'DATA',
  APP = 'APP',
  CASA = 'CASA',
  CARD = 'CARD',
  SMART_OTP = 'SMART_OTP',
  TIME_DEPOSIT = 'TIME_DEPOSIT',
  PAYROLL = 'PAYROLL',
  LOYALTY = 'LOYALTY',
  AUTO_BILL = 'AUTO_BILL',
  HDB_VKYC = 'HDB_VKYC',
  FX_EXCHANGE = 'FX_EXCHANGE',
  WARNING = 'WARNING',
  ASEAN_QR = 'ASEAN_QR',
}

export const TNC_DEFAULT_LINK = {
  [TNC_TYPE.DATA]:
    'https://vikki-cdn.sit.galaxyfinx.cloud/term_and_condition/v0.0.1/TnC_Data.pdf',
  [TNC_TYPE.APP]:
    'https://vikki-cdn.sit.galaxyfinx.cloud/term_and_condition/v0.0.1/TnC_App.pdf',
  [TNC_TYPE.CASA]:
    'https://vikki-cdn.sit.galaxyfinx.cloud/term_and_condition/v0.0.1/TnC_Casa.pdf',
  [TNC_TYPE.CARD]:
    'https://vikki-cdn.sit.galaxyfinx.cloud/term_and_condition/v0.0.1/TnC-Card.pdf',
  [TNC_TYPE.SMART_OTP]:
    'https://vikki-cdn.sit.galaxyfinx.cloud/term_and_condition/v0.0.1/TnC_SmartOTP.pdf',
  [TNC_TYPE.TIME_DEPOSIT]:
    'https://vikki-cdn.sit.galaxyfinx.cloud/term_and_condition/v0.0.3/Tnc_time_deposit.pdf',
  [TNC_TYPE.LOYALTY]:
    'https://vikki-cdn.sit.galaxyfinx.cloud/term_and_condition/v0.0.3/TnC_Loyalty.pdf',
  [TNC_TYPE.PAYROLL]:
    'https://vikki-cdn.sit.galaxyfinx.cloud/term_and_condition/payroll/v1.0.0/TnC_Payroll.pdf',
  [TNC_TYPE.AUTO_BILL]:
    'https://vikki-cdn.sit.galaxyfinx.cloud/bill-payment/term-and-condition/auto-bill/v0.0.1/TnC_AutoBill.pdf',
  [TNC_TYPE.FX_EXCHANGE]:
    'https://vikki-cdn.sit.galaxyfinx.cloud/term_and_condition/v0.0.1/TnC_Fx.pdf',
  [TNC_TYPE.WARNING]:
    'https://vikki-cdn.sit.galaxyfinx.cloud/term_and_condition/v1.0.0/TnC_Warning.pdf',
};

export enum KEYCHAIN_RESULT_STATE {
  SUCCESS = 'SUCCESS',
  INVALID_DATA = 'INVALID_DATA',
  INVALID_KEYCHAIN = 'INVALID_KEYCHAIN',
  USER_CANCELED = 'USER_CANCELED',
  TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS',
}

export const KEYCHAIN_BIOMETRIC_TYPE = {
  FaceID: Keychain.BIOMETRY_TYPE.FACE_ID,
  TouchID: Keychain.BIOMETRY_TYPE.TOUCH_ID,
  Fingerprint: Keychain.BIOMETRY_TYPE.FINGERPRINT,
} as const;

export const GESTURE_TAP_THROTTLE = 1000;

export const KEYBOARD_TYPE_LABEL = {
  DEFAULT: 'ABC',
  NUMERIC: '123',
};

export const OCCUPATION_LIST_VI = [
  {
    occupationId: 'OC001',
    occupationName: 'DV hộ gia đình',
    jobPositions: [
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
    ],
  },
  {
    occupationId: 'OC002',
    occupationName: 'Thông tin và truyền thông',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC003',
    occupationName: 'Sản xuất - Chế biến chế tạo',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC004',
    occupationName: 'Văn hóa - Xã hội - Thể dục thể thao',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC005',
    occupationName: 'Cung cấp nước, xử lý nước thải',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC006',
    occupationName: 'Kiến trúc - Xây dựng',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC007',
    occupationName: 'DV lưu trú, ăn uống, du lịch',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC008',
    occupationName: 'Khai khoáng',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC009',
    occupationName: 'Giáo dục - Đào tạo',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P007',
        positionName: 'Hiệu trưởng, hiệu phó',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC010',
    occupationName: 'Tài chính - Ngân hàng - Bảo hiểm',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC011',
    occupationName: 'Lâm nghiệp',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC012',
    occupationName: 'Kinh doanh (bán buôn - bán lẻ)',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC013',
    occupationName: 'Nông nghiệp',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC014',
    occupationName: 'Nội trợ - Công việc gia đình',
    jobPositions: [
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
    ],
  },
  {
    occupationId: 'OC015',
    occupationName: 'Hoạt động của tổ chức/cơ quan quốc tế',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC016',
    occupationName: 'Khoa học - Công nghệ',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC017',
    occupationName: 'Thủy sản',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC018',
    occupationName: 'Y tế - trợ giúp xã hội',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC019',
    occupationName: 'Sản xuất và phân phối điện, khí đốt, hơi nước',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC021',
    occupationName: 'Hành chính và DV hỗ trợ',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC022',
    occupationName: 'Nghề nghiệp khác',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC023',
    occupationName: 'Chính trị - Xã hội - Quản lý Nhà nước',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P002',
        positionName: 'Cấp tá, cấp tướng',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P009',
        positionName: 'Cấp sỹ, cấp uý',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC025',
    occupationName: 'Kinh doanh Bất động sản',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
  {
    occupationId: 'OC033',
    occupationName: 'Vận tải kho bãi',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Nhân viên, chuyên viên, cán bộ',
      },
      {
        positionId: 'P003',
        positionName: 'Giám đốc, phó giám đốc',
      },
      {
        positionId: 'P004',
        positionName: 'Trưởng phòng, phó phòng',
      },
      {
        positionId: 'P005',
        positionName: 'Chức vụ khác',
      },
      {
        positionId: 'P006',
        positionName: 'Chủ tịch, phó chủ tịch',
      },
      {
        positionId: 'P012',
        positionName: 'Trưởng bộ phận, phó bộ phận',
      },
    ],
  },
];

export const OCCUPATION_LIST_EN = [
  {
    occupationId: 'OC001',
    occupationName: 'Household services',
    jobPositions: [
      {
        positionId: 'P005',
        positionName: 'Others',
      },
    ],
  },
  {
    occupationId: 'OC002',
    occupationName: 'Information and communication',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC003',
    occupationName: 'Production - Manufacture',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC004',
    occupationName: 'Culture - Society - Sport',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC005',
    occupationName: 'Water supply, wastewater treatment',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC006',
    occupationName: 'Architecture - Construction',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC007',
    occupationName: 'Accommodation, dining, travel services',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC008',
    occupationName: 'Extractive',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC009',
    occupationName: 'Educations',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P007',
        positionName: 'Principle, Deputy Principle',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC010',
    occupationName: 'Finance - Banking - Insurance',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC011',
    occupationName: 'Forestry',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC012',
    occupationName: 'Business (wholesale - retail)',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC013',
    occupationName: 'Agriculture',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC014',
    occupationName: 'Housework',
    jobPositions: [
      {
        positionId: 'P005',
        positionName: 'Others',
      },
    ],
  },
  {
    occupationId: 'OC015',
    occupationName: 'International operating organizations/agencies',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC016',
    occupationName: 'Science and technology',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC017',
    occupationName: 'Seafood',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC018',
    occupationName: 'Health - social assistance sector',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC019',
    occupationName: 'Production and distribution of electricity, gas, steam',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC021',
    occupationName: 'Administrative and support services',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC022',
    occupationName: 'Others',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC023',
    occupationName: 'Politics - Society - Government Authority',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P002',
        positionName: 'Colonel, General',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P009',
        positionName: 'Sergeant, Corporal, Captain',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC025',
    occupationName: 'Real Estate Business',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
  {
    occupationId: 'OC033',
    occupationName: 'Transportation and warehousing',
    jobPositions: [
      {
        positionId: 'P001',
        positionName: 'Staff, Specialist, Officer',
      },
      {
        positionId: 'P003',
        positionName: 'Director, Deputy Director',
      },
      {
        positionId: 'P004',
        positionName: 'Manager, Deputy Manager',
      },
      {
        positionId: 'P005',
        positionName: 'Others',
      },
      {
        positionId: 'P006',
        positionName: 'President, Vice President',
      },
      {
        positionId: 'P012',
        positionName: 'Unit Head, Deputy Unit Head',
      },
    ],
  },
];

export const DEVICE_THREAT_MSG = 'DEVICE_THREAT_FOUND';
export const VIKKI_ACCOUNT_LENGTH = 9;
export const VIKKI_ACCOUNT_TWO_FIRSTNUMBERS = '88';
export const HPV_QR_SCAN = 'qrCodeScan';
export const CHROME_ANDROID_PACKAGE = 'com.android.chrome';
export const HD_BANK_CUSTOMER_SERVICE_PHONE = '19006060';
export const CHROME_IOS_PACKAGE = 'com.google.chrome.ios';

// Feature flag

export const VIKKI_BRAND_NAME = 'VIKKI';

export const VIKKI_CONTACT_PAGE = 'https://vikki.vn/contact/';

// export const LOYALTY_WEBVIEW_LINK = Keys.secureFor('LOYALTY_WEBVIEW_LINK');

export enum FIN_FEATURE_FLAG {
  TERM_DEPOSIT = 'TERM_DEPOSIT',
  HV_VKYC = 'HV_VKYC',
  OVERDRAFT = 'OVERDRAFT',
  CARD = 'CARD',
  FX_EXCHANGE = 'FX_EXCHANGE',
  HDI = 'HDI',
  QR_WITHDRAWAL = 'QR_WITHDRAWAL',
}

export enum MOBILE_FEATURE_FLAG {
  HV_TOKEN = 'HV_TOKEN',
  HV_VKYC = 'HV_VKYC',
  DISPUTE = 'DISPUTE ',
  BILL_PAYMENT = 'BILL_PAYMENT',
  PHONE_TOP_UP = 'PHONE_TOP_UP',
  LOYALTY = 'LOYALTY',
  ESTATEMENTS = 'ESTATEMENTS',
  PAYROLL = 'PAYROLL',
  PAYROLL_HDB_VKYC = 'PAYROLL_HDB_VKYC',
  BANNER_PAYROLL_VIDEO_CALL = 'BANNER_PAYROLL_VIDEO_CALL',
  TERM_DEPOSIT = 'TERM_DEPOSIT',
  TD_PAYROLL = 'TD_PAYROLL',
  TD_PARTIAL = 'TD_PARTIAL',
  OVERDRAFT = 'OVERDRAFT',
  CREDIT_CARD = 'CREDIT_CARD',
  HD_CREDIT_CARD = 'HD_CREDIT_CARD',
  NEW_BANNER = 'NEW_BANNER',
  AUTO_BILL = 'AUTO_BILL',
  HDSAISON = 'HDSAISON',
  APP_ROUTE_CONFIG = 'APP_ROUTE_CONFIG',
  OVERDRAFT_ESTATEMENTS = 'OVERDRAFT_ESTATEMENTS',
  OVERDRAFT_PHASE_2 = 'OVERDRAFT_PHASE_2',
  PHYSICAL_CARD = 'PHYSICAL_CARD',
  NFC = 'NFC',
  DISPUTE_VNPAY = 'DISPUTE_VNPAY',
  VJ_VIKKI_GJ = 'VJ_VIKKI_GJ',
  CASA_TO_PAYROLL = 'CASA_TO_PAYROLL',
  CREDIT_CARD_IPP = 'CREDIT_CARD_IPP',
  LENDING_LIMIT = 'LENDING_LIMIT',
  CARD_MANAGEMENT_V2 = 'CARD_MANAGEMENT_V2',
  OVERDRAFT_CLOSE_ACCOUNT = 'OVERDRAFT_CLOSE_ACCOUNT',
  BALANCES_CONFIRMATION = 'BALANCES_CONFIRMATION',
  HDI_DSXM = 'HDI_DSXM',
  CASA_ESTATEMENT = 'CASA_ESTATEMENT',
  ONBOARDING_PASSPORT = 'ONBOARDING_PASSPORT',
  HDI_FREE_OFFER = 'HDI_FREE_OFFER',
  LUCKY_SPIN = 'LUCKY_SPIN',
  VICTORIA_STUDENT_PREPAID_CARD = 'VICTORIA_STUDENT_PREPAID_CARD',
  BLOCK_AMOUNT_CASA = 'BLOCK_AMOUNT_CASA',
  FX_EXCHANGE = 'FX_EXCHANGE_ENABLED',
  CARD_MANAGEMENT_SETTING = 'CARD_MANAGEMENT_SETTING',
  QR_CASH_WITHDRAWAL = 'QR_CASH_WITHDRAWAL',
  FLIGHT_BOOKING = 'FLIGHT_BOOKING',
  FAST_LOAN = 'FAST_LOAN',
  HOME_TOP_NAV = 'HOME_TOP_NAV',
  SKY_JOY_CARD = 'SKY_JOY_CARD',
  BEAUTY_NUMBER = 'BEAUTY_NUMBER',
  BEAUTY_NUMBER_FOREIGNER = 'BEAUTY_NUMBER_FOREIGNER',
  QR_ASEAN = 'QR_ASEAN',
}

export enum PAYROLL_COMPANY_CODE {
  HD_BANK = 'hdbank',
  FINX = 'finx',
}

// export const SECRET_KEY_BLOCK_INFORMATION = Keys.secureFor(
//   // this key will be added in github of runner
//   // @ts-ignore
//   'SECRET_KEY_BLOCK_INFORMATION',
// );

export const NUMBER_TIMES_RETRY_SCAN_NFC = 9;
export const BEARER = 'bearer ';
export const SDK_NFC_DATE_FORMAT = 'YYMMDD';

export const ANDROID_FILE_PATH = 'file://';
export const HV_ONBOARDING_NFC_PREFIX = 'NFC:';
// export const HD_SAISON_APPLY_URL = Keys.secureFor('HD_SAISON_APPLY_URL');

export const KEYBOARD_CLOSED_DELAY = 200;
