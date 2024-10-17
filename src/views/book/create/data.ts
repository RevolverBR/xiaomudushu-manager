import axios from 'axios';
import { FormSchema } from '/@/components/Form';
import { useGlobSetting } from '/@/hooks/setting';
import { getToken } from '/@/utils/auth';

const basicOptions: LabelValueOptions = [
  {
    label: 'CN',
    value: 'cn',
  },
  {
    label: 'EN',
    value: 'en',
  },
];

export const categoryTextOptions: LabelValueOptions = [
  {
    label: 'Biomedicine',
    value: '12',
  },
  {
    label: 'BusinessandManagement',
    value: '13',
  },
  {
    label: 'EarthSciences',
    value: '14',
  },
  {
    label: 'Engineering',
    value: '5',
  }
];

export const schemas: FormSchema[] = [
  {
    field: 'title',
    component: 'Input',
    label: '书名',
    required: true,
  },
  {
    field: 'author',
    component: 'Input',
    label: '作者',
    required: true,
    colProps: {
      offset: 2,
    },
  },
  {
    field: 'publisher',
    component: 'Input',
    label: '出版社',
    required: true,
    colProps: {
      offset: 2,
    },
  },
  {
    field: 'categoryText',
    component: 'Select',
    label: '类别',
    componentProps: {
      options: categoryTextOptions
    },
    required: true,
  },
  {
    field: 'language',
    component: 'Select',
    label: '语言',
    componentProps: {
      options: basicOptions,
    },
    colProps: {
      offset: 2,
    },
    required: true,
  },
  {
    field: 'fileName',
    component: 'Input',
    label: '文件路径',
    required: true,
    colProps: {
      offset: 2,
    },
    componentProps: {
      disabled: true,
    }
  },
  {
    field: 'cover',
    component: 'Input',
    label: '封面',
    componentProps: {
      disabled: true,
    },
    required: true,
  },
  {
    field: 'rootFile',
    component: 'Input',
    label: '根文件',
    required: true,
    colProps: {
      offset: 2,
    },
  },
];

// 电子书上传信息配置
export const taskSchemas = ({ setFieldsValue, getFieldsValue, contentData }): FormSchema[] => {
  return [
    {
      field: 'book',
      component: 'Upload',
      label: '电子书',
      required: true,
      componentProps: {
        maxSize: 5,
        maxNumber: 1,
        accept: ['epub'],
        api: (data) => {
          const formData = new FormData()
          formData.append('file', data.file)
          const globSetting = useGlobSetting()
          const {apiUrl} = globSetting
          const requestUrl = `${apiUrl}/book/upload`

          // console.log(data, apiUrl, requestUrl)
          return axios.post(requestUrl, formData, {
            headers: {
              'Content-Type': data.file.type,
              Authorization: `Bearer ${getToken()}`
            }
          })
        },
        onChange(files) {
          // console.log('111', files)
          // 14-2获取解析后的电子书数据
          // 没拿到直接返回
          if (!files || files.length < 1) {
            return
          }

          const [file] = files
          const { filedName } = file
          const fileData = file.data
          if (!fileData) {
            return
          }

          // 拿到开始回填图书数据
          const {
            title,
            creator,
            publisher,
            language,
            rootFile,
            cover,
            content
          } = fileData
          setFieldsValue({
            title,
            author: creator,
            publisher,
            language,
            cover,
            rootFile,
            fileName: filedName
          })
          contentData.value = content
          // console.log(contentData.value)
        }
      },
    }
  ]
}
