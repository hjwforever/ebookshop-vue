import request from '@/utils/request'

export const getBookList = (params) => {
  return request({
    url: `/books`,
    method: 'get',
    params
  })
}

export const uploadBook = ({
  url, data, params
}) => {
  return request({
    url: url || `/books/upload`,
    method: 'post',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    timeout: 15000,
    data,
    params
  })
}

export const getBookById = (id) => {
  return request(`/books/${id}`)
}

export const downloadBookById = (bookId) => {
  return request(`/books/download?bookId=${parseInt(bookId)}`)
}

export const getBookDownloadURLById = (bookId) => {
  return request(`/books/downloadUrl?bookId=${parseInt(bookId)}`)
}
