import { AES, HmacSHA256, SHA256, enc } from 'crypto-js';

export function decrypt(encrypted: string, passphrase: string) {
  let encryptedHMAC = encrypted.substring(0, 64);
  let encryptedHTML = encrypted.substring(64);
  let decryptedHMAC = HmacSHA256(encryptedHTML, SHA256(passphrase).toString()).toString();
  if (decryptedHMAC !== encryptedHMAC) {
    return false;
  }
  return AES.decrypt(encryptedHTML, passphrase).toString(enc.Utf8);
}
