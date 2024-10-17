import { FormSchema } from '/@/components/Form/index';
// 11-10
import { getBookList, deleteBook, deleteContents } from '/@/api/book/book';

// 获取图书列表数据的方法
export const searchList = async(params = {}) => {
  const result: any[] = [];

  // 12-2
  const { title, author, page = 1, pageSize = 20 }: any = params
  const p: any = { page, pageSize }

  if (title) {
    p.title = title
  }
  if (author) {
    p.author = author
  }

  // 11-10
  const {data, count} = await getBookList(p)
  // console.log(data)

  // 图书数据
  // console.log('data', data)
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    result.push({
      fileName: item.fileName,
      id: item.id,
      title: item.title,
      description: [item.categoryText, item.language],
      content: item.author,
      time: item.publisher,
      cover: item.cover.replace(/\/(.*?)\//g, '')
    });
  }
  return {data: result, count};
};

// 删除图书的方法
export const deleteBookWithId = async(id, fileName) => {
  await deleteContents(fileName)
  return deleteBook(id)
}

export const actions: any[] = [
  { icon: 'clarity:star-line', text: '156', color: '#018ffb' },
  { icon: 'bx:bxs-like', text: '156', color: '#459ae8' },
  { icon: 'bx:bxs-message-dots', text: '2', color: '#42d27d' },
];

export const schemas: FormSchema[] = [
  {
    field: 'name',
    component: 'Input',
    label: '书名',
    colProps: {
      span: 8,
    },
    componentProps: {
      onChange: (e: any) => {
        // console.log(e);
      },
    },
  },
  {
    field: 'author',
    component: 'Input',
    label: '作者',
    colProps: {
      span: 8,
    },
    componentProps: {
      onChange: (e: any) => {
        // console.log(e);
      },
    },
  },
];
