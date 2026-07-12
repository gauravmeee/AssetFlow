import { axiosInstance } from './instance/axios-instance'

const baseAPIURL = `${import.meta.env.VITE_ACCOUNTS_API_URL}/auth`

/** Checks the availability of an email. */
const isEmailAvailable = (postobj) => {
  return axiosInstance.post(`${baseAPIURL}/is-email-available`, postobj).then((res) => res.data)
}

/** Creates a verification code for the provided username and request type. */
const createVerificationCode = (postobj) => {
  return axiosInstance.post(`${baseAPIURL}/create-code`, postobj).then((res) => res.data)
}

/** Validates username and gets tenant and its SSO config if SSO is enabled. */
const getTenantInfo = (postobj) => {
  return axiosInstance.post(`${baseAPIURL}/tenant-info`, postobj).then((res) => res.data)
}

/** Checks if the verification code matches for "ResetPwd" and other request types. */
const checkVerificationCode = (postobj) => {
  return axiosInstance.post(`${baseAPIURL}/verify-code`, postobj).then((res) => res.data)
}

export { checkVerificationCode, createVerificationCode, getTenantInfo, isEmailAvailable }
