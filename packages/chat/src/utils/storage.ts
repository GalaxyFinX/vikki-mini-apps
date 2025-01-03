import uuid from 'react-native-uuid';
import {MMKV} from 'react-native-mmkv';
//
import {GenericKeychain} from '../services/keychain';
import {
  KEYCHAIN_RESULT_STATE,
  MEMORY_KEY,
  STORAGE_KEY,
  WHITE_LIST_STORAGE_KEY,
} from '../constants';

const STORAGE_NAME = 'VIKKI_STORAGE';

const KEYCHAIN_SERVICE = 'VIKKI_BASE_SERVICE';

const KEYCHAIN_CREDENTIAL = 'VIKKI_BASE_CREDENTIAL';

export type StorageKeyType = (typeof STORAGE_KEY)[keyof typeof STORAGE_KEY];

export type MemoryKeyType = (typeof MEMORY_KEY)[keyof typeof MEMORY_KEY];

class Storage {
  encryptionKey: string = '';
  localInstance: MMKV = new MMKV({id: STORAGE_NAME});
  keychainInstance: GenericKeychain = new GenericKeychain(KEYCHAIN_SERVICE);
  //
  memory: Record<string, any> = {};

  init = async () => {
    const hasEncryptionKey = await this.keychainInstance.hasUsernameInKeychain(
      KEYCHAIN_CREDENTIAL,
    );

    if (hasEncryptionKey) {
      const keychainResult = await this.keychainInstance.retrieveWithPasscode(
        KEYCHAIN_CREDENTIAL,
        KEYCHAIN_CREDENTIAL,
      );

      if (keychainResult.state === KEYCHAIN_RESULT_STATE.SUCCESS) {
        this.encryptionKey = keychainResult.secret;
      }
    }

    if (!this.encryptionKey) {
      this.encryptionKey = uuid.v4().toString();

      await this.keychainInstance.saveWithPasscode(
        this.encryptionKey,
        KEYCHAIN_CREDENTIAL,
        KEYCHAIN_CREDENTIAL,
      );
    }

    this.localInstance = new MMKV({
      id: STORAGE_NAME,
      encryptionKey: this.encryptionKey,
    });

    this.memory[MEMORY_KEY.SESSION_ID] = uuid.v4().toString();
  };

  save = (key: StorageKeyType, value: any) => {
    const jsonString = JSON.stringify(value);
    this.localInstance.set(key, jsonString);
  };

  saveToMemory = (key: MemoryKeyType, value: any) => {
    this.memory[key] = value;
  };

  retrieve = (key: StorageKeyType | MemoryKeyType) => {
    if (this.memory.hasOwnProperty(key)) {
      return this.memory[key];
    }

    const localData = this.localInstance.getString(key);

    if (localData) {
      return JSON.parse(localData);
    }

    return undefined;
  };

  clear = (key: StorageKeyType | MemoryKeyType) => {
    this.localInstance.delete(key);
    //
    if (this.memory.hasOwnProperty(key)) {
      delete this.memory[key];
    }
  };

  clearMemory = () => {
    this.memory = {};
  };

  clearLocal = () => {
    this.localInstance.clearAll();
  };

  clearAll = () => {
    const whiteList = WHITE_LIST_STORAGE_KEY.map(key => {
      return {
        key,
        value: this.retrieve(key),
      };
    });
    this.clearMemory();
    this.clearLocal();
    if (whiteList?.length) {
      whiteList?.forEach(data => {
        if (data.value) {
          this.save(data.key, data.value);
        }
      });
    }
  };

  reset = async () => {
    this.clearAll();
    // Erase encryptionKey and init again
    this.keychainInstance.clear();
    await this.init();
  };
}

const instance = new Storage();
export {instance as Storage};
