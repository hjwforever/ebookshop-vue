import request from '@/utils/request'
import axios from 'axios'

export function login(data) {
  return myPromise({
    url: '/auth/login',
    method: 'post',
    data,
    mockMsg: '登录成功'
  })
}

export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}

// get Userinfo
export function getInfo(token) {
  return myPromise({
    url: `/user/info?token=${token}`,
    mockMsg: '获取用户信息成功'
  })
}

export function logout() {
  // return request({
  //   url: "/user/logout",
  //   method: "post"
  // });
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          name: 'test',
          nickname: '张三',
          introduction: 'I am a super administrator',
          avatar:
            'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
          email: 'test@ebookshop.com',
          roles: ['admin']
        },
        msg: '登出成功'
      })
    }, 1500)
  })
}

export const myPromise = ({
  url,
  method = 'get',
  data,
  mockData = {
    name: 'test',
    nickname: '张三',
    introduction: 'I am a super administrator',
    avatar:
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    email: 'test@ebookshop.com',
    roles: ['admin']
  },
  mockMsg = 'success'
}) => {
  return new Promise((resolve, reject) => {
    axios(process.env.VUE_APP_TEST_URL)
      .then(() => {
        request({
          url,
          method,
          data
        })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
      .catch(() => {
        setTimeout(() => {
          resolve({
            code: 200,
            data: mockData,
            msg: mockMsg
          })
        }, 1500)
      })
  })
}
