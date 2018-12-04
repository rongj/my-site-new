import { JSEncrypt } from 'jsencrypt';

export const encrypt = (publicKey, str) => {
	let encryptor = new JSEncrypt()
	encryptor.setPublicKey(publicKey)
	return encryptor.encrypt(str)
}

export const decrypt = (privateKey, str) => {
	let decryptor = new JSEncrypt()
	decryptor.setPrivateKey(privateKey)
	return decryptor.decrypt(str)
}