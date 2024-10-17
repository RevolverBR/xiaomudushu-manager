import { BasicColumn, FormSchema } from '/@/components/Table';
// import { h } from 'vue';
// import { Switch } from 'ant-design-vue';
// import { setRoleStatus } from '/@/api/demo/system';
// import { useMessage } from '/@/hooks/web/useMessage';

export const columns: BasicColumn[] = [
  {
    title: '角色ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '角色',
    dataIndex: 'name',
    width: 100,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 100,
  },
  // {
  //   title: '状态',
  //   dataIndex: 'status',
  //   width: 120,
  //   customRender: ({ record }) => {
  //     if (!Reflect.has(record, 'pendingStatus')) {
  //       record.pendingStatus = false;
  //     }
  //     return h(Switch, {
  //       checked: record.status === '1',
  //       checkedChildren: '已启用',
  //       unCheckedChildren: '已禁用',
  //       loading: record.pendingStatus,
  //       onChange(checked: boolean) {
  //         record.pendingStatus = true;
  //         const newStatus = checked ? '1' : '0';
  //         const { createMessage } = useMessage();
  //         setRoleStatus(record.id, newStatus)
  //           .then(() => {
  //             record.status = newStatus;
  //             createMessage.success(`已成功修改角色状态`);
  //           })
  //           .catch(() => {
  //             createMessage.error('修改角色状态失败');
  //           })
  //           .finally(() => {
  //             record.pendingStatus = false;
  //           });
  //       },
  //     });
  //   },
  // },
  // {
  //   title: '创建时间',
  //   dataIndex: 'createTime',
  //   width: 180,
  // },
  // {
  //   title: '备注',
  //   dataIndex: 'remark',
  // },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '角色',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '停用', value: '1' },
      ],
    },
    colProps: { span: 8 },
  },
];

export const formSchema = (isUpdate): FormSchema[] => {
  return [
    {
      field: 'name',
      label: '角色名称',
      required: true,
      component: 'Input',
      componentProps: {
        disabled: isUpdate
      }
    },
    {
      label: '备注',
      field: 'remark',
      component: 'InputTextArea',
    },
    {
      label: '',
      field: 'menu',
      slot: 'menu',
      component: 'Input',
    },
    {
      label: '',
      field: 'auth',
      slot: 'auth',
      component: 'Input',
    },
  ]
}
