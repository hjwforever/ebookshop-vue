import request from '@/utils/request'

export const getBookList = (params) => {
  // console.log('params', params)
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
  // return reques({
  //   url: `/books/download?bookId=${parseInt(bookId)}`,

  // })
  return new Promise(resolve => {
    window.location.href = `${process.env.VUE_APP_BASE_API}/books/download?bookId=${parseInt(bookId)}`
    resolve()
  })
}

export const getBookDownloadURLById = (bookId) => {
  return request(`/books/downloadUrl?bookId=${parseInt(bookId)}`)
}

export const getBookContent = ({
  bookId,
  page = -1,
  pageStart = -1,
  pageEnd = -1
}) => {
  if (page > 0) {
    return request(`/books/${bookId}/pages/${page}`)
  } else if (pageStart > 0 && pageStart < pageEnd) {
    return request(`/books/${bookId}/pages/${pageStart}-${pageEnd}`)
  } else {
    console.log('请输入有效值')
  }
}
