import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag, Tooltip } from 'ant-design-vue';
// import Icon from '@/components/Icon/Icon.vue';

export const columns: BasicColumn[] = [
  // 9-5修改菜单数据结构
  {
    title: '菜单id',
    dataIndex: 'id',
    width: 80,
    align: 'center',
  },
  {
    title: '菜单名称',
    // dataIndex: 'menuName',
    dataIndex: 'name',
    width: 160,
    align: 'center',
  },
  {
    title: '菜单路径',
    dataIndex: 'path',
    width: 160,
  },
  // {
  //   title: '图标',
  //   dataIndex: 'icon',
  //   width: 50,
  //   customRender: ({ record }) => {
  //     return h(Icon, { icon: record.icon });
  //   },
  // },
  {
    title: '重定向',
    dataIndex: 'redirect',
  },
  {
    title: '元数据',
    dataIndex: 'meta',
    customRender: ({ text }) => {
      // antDesign里面tooltip的应用
      return h(Tooltip, { title: text, placemnet: 'top' }, () => text.slice(0, 10) + '...')
    }
  },
  {
    title: '父菜单id',
    dataIndex: 'pid',
    width: 80,
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'active',
    width: 80,
    customRender: ({ record }) => {
      // const status = record.status;
      // const enable = ~~status === 0;
      // active为1显示启用
      const status = record.active === 1;
      const enable = ~~status === 1;
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '停用';
      return h(Tag, { color: color }, () => text);
    },
  }
];

const isDir = (type: string) => type === '0';
const isMenu = (type: string) => type === '1';
const isButton = (type: string) => type === '2';

export const searchFormSchema: FormSchema[] = [
  {
    field: 'menuName',
    label: '菜单名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: 0 },
        { label: '停用', value: 1 },
      ],
    },
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  // 10-1
  // {
  //   field: 'type',
  //   label: '菜单类型',
  //   component: 'RadioButtonGroup',
  //   defaultValue: '0',
  //   componentProps: {
  //     options: [
  //       { label: '目录', value: '0' },
  //       { label: '菜单', value: '1' },
  //       { label: '按钮', value: '2' },
  //     ],
  //   },
  //   colProps: { lg: 24, md: 24 },
  // },
  {
    field: 'path',
    label: '菜单路径',
    component: 'Input',
    required: true,
  },
  {
    field: 'name',
    label: '菜单名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'redirect',
    label: '重定向地址',
    component: 'Input',
    required: false,
  },
  {
    field: 'meta',
    label: '元数据',
    component: 'Input',
    required: false,
  },
  {
    field: 'parentMenu',
    label: '上级菜单',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
      // 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位
      getPopupContainer: () => document.body,
      // 下拉菜单的样式
      dropdownStyle: {}
    },
  },

  // {
  //   field: 'orderNo',
  //   label: '排序',
  //   component: 'InputNumber',
  //   required: true,
  // },
  // {
  //   field: 'icon',
  //   label: '图标',
  //   component: 'IconPicker',
  //   required: true,
  //   ifShow: ({ values }) => !isButton(values.type),
  // },

  // {
  //   field: 'routePath',
  //   label: '路由地址',
  //   component: 'Input',
  //   required: true,
  //   ifShow: ({ values }) => !isButton(values.type),
  // },
  // {
  //   field: 'component',
  //   label: '组件路径',
  //   component: 'Input',
  //   ifShow: ({ values }) => isMenu(values.type),
  // },
  // {
  //   field: 'permission',
  //   label: '权限标识',
  //   component: 'Input',
  //   ifShow: ({ values }) => !isDir(values.type),
  // },
  {
    field: 'active',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: '启用', value: '1' },
        { label: '禁用', value: '0' },
      ],
    },
  },
  // {
  //   field: 'isExt',
  //   label: '是否外链',
  //   component: 'RadioButtonGroup',
  //   defaultValue: '0',
  //   componentProps: {
  //     options: [
  //       { label: '否', value: '0' },
  //       { label: '是', value: '1' },
  //     ],
  //   },
  //   ifShow: ({ values }) => !isButton(values.type),
  // },

  // {
  //   field: 'keepalive',
  //   label: '是否缓存',
  //   component: 'RadioButtonGroup',
  //   defaultValue: '0',
  //   componentProps: {
  //     options: [
  //       { label: '否', value: '0' },
  //       { label: '是', value: '1' },
  //     ],
  //   },
  //   ifShow: ({ values }) => isMenu(values.type),
  // },

  // {
  //   field: 'show',
  //   label: '是否显示',
  //   component: 'RadioButtonGroup',
  //   defaultValue: '0',
  //   componentProps: {
  //     options: [
  //       { label: '是', value: '0' },
  //       { label: '否', value: '1' },
  //     ],
  //   },
  //   ifShow: ({ values }) => !isButton(values.type),
  // },
];
