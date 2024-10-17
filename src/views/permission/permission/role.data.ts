import { BasicColumn, FormSchema } from '/@/components/Table';
// import { h } from 'vue';
// import { Switch } from 'ant-design-vue';
// import { setRoleStatus } from '/@/api/demo/system';
// import { useMessage } from '/@/hooks/web/useMessage';

export const columns: BasicColumn[] = [
  {
    title: '权限ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '权限key',
    dataIndex: 'key',
    width: 100,
  },
  {
    title: '权限名称',
    dataIndex: 'name',
    width: 100,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 100,
  },
];

// 筛选条件
export const searchFormSchema: FormSchema[] = [
  {
    label: '权限key',
    field: 'key',
    component: 'Input',
    colProps: { span: 8 },
  },
];

// 创建表单
export const formSchema = (isUpdate): FormSchema[] => {
  return [
    {
      label: '权限key',
      field: 'key',
      required: true,
      component: 'Input',
      // ifShow: () => !unref(isUpdate)
      componentProps: {
        disabled: isUpdate
      }
    },
    {
      label: '权限名称',
      field: 'name',
      component: 'InputTextArea',
    },
    {
      label: '备注',
      field: 'remark',
      component: 'InputTextArea',
    },
  ];
};
