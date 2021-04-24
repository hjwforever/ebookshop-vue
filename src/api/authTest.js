import request from '@/utils/request'

export const publicTest = () => {
  return request('/test/all')
}

export const adminTest = () => {
  return request('/test/admin')
}

export const userTest = () => {
  return request('/test/user')
}

export const sellerTest = () => {
  return request('/test/seller')
}
