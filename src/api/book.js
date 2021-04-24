import request from '@/utils/request'

export const getBookList = () => {
  return request('/books')
}

export const getBookById = (id) => {
  return request(`/books/${id}`)
}
