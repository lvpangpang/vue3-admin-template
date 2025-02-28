import CryptoJS from 'crypto-js'
const SECRET_KEY = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_CRYPTOJS_KEY)
const SECRET_IV = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_CRYPTOJS_IV)
export const REG_ROUTER_CAPTURE_OP_TYPE = /^\/.{0,}\//g

export default function encrypt(data) {
  const dataUtf8 = CryptoJS.enc.Utf8.parse(data) // data
  const encrypted = CryptoJS.AES.encrypt(dataUtf8, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}