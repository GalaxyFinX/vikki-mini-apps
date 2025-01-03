import Keychain, {Options} from 'react-native-keychain';
//
import {AESDecrypt, AESEncrypt} from '../utils';
import {IS_IOS, KEYCHAIN_RESULT_STATE} from '../constants';

type RetrieveKeychainDataResult = {
  secret: string;
  username: string;
  state: KEYCHAIN_RESULT_STATE;
};

class GenericKeychain {
  serviceName = '';
  initiated = false;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  clearKeychain = () => {
    return Keychain.resetGenericPassword({service: this.serviceName});
  };

  clear = () => {
    this.clearKeychain().catch();
  };

  // Only use with passcode keychain
  // Using with biometric keychain will automatically trigger biometric prompt
  hasUsernameInKeychain = async (username: string) => {
    try {
      const result = await Keychain.getGenericPassword({
        service: this.serviceName,
      });

      return !!result && result.username === username;
    } catch (e) {
      return false;
    }
  };

  saveWithPasscode = async (
    secret: string,
    passcode: string,
    username: string,
  ) => {
    try {
      const storage = Keychain.STORAGE_TYPE.AES;
      let securityLevel = Keychain.SECURITY_LEVEL.ANY;
      const encrypted = AESEncrypt(secret, passcode).toString();

      if (!IS_IOS) {
        securityLevel =
          (await Keychain.getSecurityLevel()) || Keychain.SECURITY_LEVEL.ANY;
      }

      const options: Options = {
        storage,
        securityLevel,
        service: this.serviceName,
      };

      const result = await Keychain.setGenericPassword(
        username,
        encrypted,
        options,
      );

      return !!result && !!result.storage;
    } catch (e) {
      return false;
    }
  };

  saveWithBiometric = async (username: string, password: string) => {
    try {
      const storage = Keychain.STORAGE_TYPE.RSA;
      let securityLevel = Keychain.SECURITY_LEVEL.ANY;

      if (!IS_IOS) {
        securityLevel =
          (await Keychain.getSecurityLevel()) || Keychain.SECURITY_LEVEL.ANY;
      }

      const options: Options = {
        storage,
        securityLevel,
        service: this.serviceName,
        authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
      };

      const result = await Keychain.setGenericPassword(
        username,
        password,
        options,
      );

      return !!result && !!result.storage;
    } catch (e) {
      return false;
    }
  };

  retrieveWithPasscode = async (passcode: string, username: string) => {
    const result: RetrieveKeychainDataResult = {
      secret: '',
      username: '',
      state: KEYCHAIN_RESULT_STATE.INVALID_KEYCHAIN,
    };

    const hasInKeychain = await this.hasUsernameInKeychain(username);
    if (!hasInKeychain) {
      return result;
    }

    try {
      const data = await Keychain.getGenericPassword({
        service: this.serviceName,
      });

      if (data) {
        result.username = data.username;
        result.secret = AESDecrypt(data.password, passcode);
      }

      if (!result.secret) {
        result.username = '';
        result.state = KEYCHAIN_RESULT_STATE.INVALID_DATA;
      } else {
        result.state = KEYCHAIN_RESULT_STATE.SUCCESS;
      }

      return result;
    } catch (e) {
      return result;
    }
  };

  isTooManyAttemptsError = async (e: any) => {
    if (!IS_IOS) {
      const stringifiedError = JSON.stringify(e.message);
      return stringifiedError.includes('code: 7'); // Too many attempts error code
    }
  };

  isUserCanceledError = (e: any) => {
    // TODO: https://github.com/oblador/react-native-keychain/issues/609
    const stringifiedError = JSON.stringify(e);
    return (
      (e && String(e?.code) === '-128') || // iOS cancel
      stringifiedError.includes('code: 13') || // android "log out" pressed
      stringifiedError.includes('code: 10') // android cancel via back button
    );
  };

  retrieveWithBiometric = async (
    username: string,
    promptText?: {
      title: string;
      cancel: string;
    },
  ) => {
    const result: RetrieveKeychainDataResult = {
      secret: '',
      username: '',
      state: KEYCHAIN_RESULT_STATE.INVALID_DATA,
    };

    try {
      const data = await Keychain.getGenericPassword({
        service: this.serviceName,
        authenticationPrompt: {
          title: 'Login With Finger',
          cancel: 'Cancel',
        },
      });

      if (data) {
        result.secret = data.password;
        result.username = data.username;
      }

      if (result.username !== username) {
        result.secret = '';
        result.username = '';
        result.state = KEYCHAIN_RESULT_STATE.INVALID_KEYCHAIN;
      } else if (!result.secret) {
        result.secret = '';
        result.username = '';
        result.state = KEYCHAIN_RESULT_STATE.INVALID_DATA;
      } else {
        result.state = KEYCHAIN_RESULT_STATE.SUCCESS;
      }

      return result;
    } catch (e) {
      if (await this.isTooManyAttemptsError(e)) {
        result.state = KEYCHAIN_RESULT_STATE.TOO_MANY_ATTEMPTS;
      }

      if (this.isUserCanceledError(e)) {
        result.state = KEYCHAIN_RESULT_STATE.USER_CANCELED;
      }

      return result;
    }
  };
}

export {GenericKeychain};
export type {RetrieveKeychainDataResult};
