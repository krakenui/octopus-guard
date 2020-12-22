export * from './config';
export * from './helper';

function generateRandomData(len: number) {
  let array = null;
  const crypto = window.crypto || window['msCrypto'];
  if (crypto && crypto.getRandomValues && window.Uint8Array) {
    array = new Uint8Array(len);
    crypto.getRandomValues(array);
    return array;
  }

  array = new Array(len);
  for (var j = 0; j < array.length; j++) {
    array[j] = Math.floor(256 * Math.random());
  }

  return array;
}

function generateRandomString(len: number, alphabet: string) {
  var randomData = generateRandomData(len);
  var chars = new Array(len);
  for (var i = 0; i < len; i++) {
    chars[i] = alphabet.charCodeAt(randomData[i] % alphabet.length);
  }

  return String.fromCharCode.apply(null, chars);
}

export function createUUID() {
  var hexDigits = '0123456789abcdef';
  var s = generateRandomString(36, hexDigits).split('');
  s[14] = '4';
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = '-';
  var uuid = s.join('');

  return uuid;
}
