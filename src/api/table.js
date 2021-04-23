import request from '@/utils/request'
import axios from 'axios'

const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    title: '@ctitle(5, 10)',
    'status|1': ['published', 'draft', 'deleted'],
    author: 'name',
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
})

export function getList(params) {
  const items = data.items
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          total: items.length,
          items: items
        },
        msg: '获取表格成功'
      })
    }, 500)
  })
}

export const myPromise = ({
  url,
  method = 'get',
  data,
  params,
  mockData,
  mockMsg = 'success'
}) => {
  return new Promise((resolve, reject) => {
    axios(process.env.VUE_APP_TEST_URL)
      .then(() => {
        request({
          url,
          method,
          params,
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
