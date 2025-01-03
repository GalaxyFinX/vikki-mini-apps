import CryptoJS from 'react-native-crypto-js';
import {KJUR} from 'jsrsasign';

export const AESEncrypt = (data: any, secretKey: string) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  } catch (e) {
    return '';
  }
};

export const AESDecrypt = (cipher_text: string, secretKey: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher_text, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    return '';
  }
};

export const verifySignature = (
  data: string,
  signature: string,
  publicKey: string,
) => {
  try {
    const signer = new KJUR.crypto.Signature({alg: 'SHA256withRSA'});
    signer.init(publicKey);
    signer.updateString(data);
    return signer.verify(signature);
  } catch (err) {
    return false;
  }
};
