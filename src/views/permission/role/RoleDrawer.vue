<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #menu="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :fieldNames="{ title: 'name', key: 'id' }"
          checkable
          toolbar
          title="菜单分配"
        />
      </template>
      <template #auth="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="authData"
          :fieldNames="{ title: 'name', key: 'id' }"
          checkable
          toolbar
          title="权限分配"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './role.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';

  import { getActiveMenu } from '/@/api/sys/menu';
  import {
    addRole,
    addRoleAuth,
    addRoleMenu,
    deleteRoleAuthById,
    deletRoleMenuById,
    getAuthList,
    getRoleMenu,
    getRoleAuth,
    updateRole,
  } from '/@/api/sys/user';
  import { message } from 'ant-design-vue';

  export default defineComponent<any>({
    name: 'RoleDrawer',
    components: { BasicDrawer, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const treeData = ref<TreeItem[]>([]);
      const authData = ref<TreeItem[]>([]);
      const roleIdData = ref();

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        baseColProps: { span: 24 },
        schemas: formSchema(isUpdate),
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });

        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
        if (unref(treeData).length === 0) {
          // treeData.value = (await getMenuList()) as any as TreeItem[];
          const res = await getActiveMenu();
          // 给菜单分配赋值
          treeData.value = res;
        }
        if (unref(authData).length === 0) {
          const res = await getAuthList({});
          // 给菜单分配赋值
          authData.value = res;
        }
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          const roleId = data.record.id;
          roleIdData.value = roleId;

          const roleMenuList = (await getRoleMenu({ roleId })) || [];
          const roleAuthList = (await getRoleAuth({ roleId })) || [];

          data.record.menu = roleMenuList.map((item) => item.menuId);
          data.record.auth = roleAuthList.map((item) => item.authId);

          setFieldsValue({
            ...data.record,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          // TODO custom api

          if (unref(isUpdate)) {
            const roleId = roleIdData.value;
            // 更新角色
            const res = await updateRole(values);

            if (res) {
              message.success('编辑角色成功');

              // 打开窗口时删除所有数据初始化
              await deletRoleMenuById(roleId);
              await deleteRoleAuthById({roleId: roleId});

              const { menu = [], auth = [] } = values;
              for (let menuId of menu) {
                await addRoleMenu({ roleId, menuId });
              }
              for (let authId of auth) {
                await addRoleAuth({ roleId, authId });
              }

              emit('success');
              closeDrawer();
            } else {
              message.error('编辑角色失败');
            }
          } else {
            // 新增角色
            const res = await addRole(values);
            if (res) {
              message.success('新增角色成功');

              // 提交角色和菜单的绑定关系
              const { id: roleId } = res;
              const { menu = [], auth = [] } = values;
              for (let menuId of menu) {
                await addRoleMenu({ roleId, menuId });
              }
              for (let authId of auth) {
                await addRoleAuth({ roleId, authId });
              }

              emit('success');
              closeDrawer();
            } else {
              message.error('新增角色失败');
            }
          }
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
        treeData,
        authData
      };
    },
  });
</script>
