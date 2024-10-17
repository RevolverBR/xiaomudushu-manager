import { defHttp } from '/@/utils/http/axios';

// 电子书交互api
enum Api {
  Book = '/book',
  Contents = '/contents'
}

/**
 * @description: Get user menu based on id
 */

export const getBookList = (params) => {
  return defHttp.get({url: Api.Book, params})
}

export const getBook = (id) => {
  return defHttp.get({url: Api.Book + '/' + id})
}

export const updateBook = (params) => {
  return defHttp.put({url: Api.Book, params})
}

export const addBook = (data) => {
  return defHttp.post({url: Api.Book, data}, { errorMessageMode: 'none' })
}

export const deleteBook = (id) => {
  return defHttp.delete({url: Api.Book, params: {id}})
}

export const addContents = (params) => {
  return defHttp.post({url: Api.Contents, params})
}

export const getContents = (params) => {
  return defHttp.get({url: Api.Contents, params})
}

export const deleteContents = (fileName) => {
  return defHttp.delete({url: Api.Contents, params: { fileName }})
}
