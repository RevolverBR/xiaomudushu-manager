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
          title="角色列表"
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

  import { getRoleList } from '/@/api/demo/system';
  import { addUser, editUser } from '/@/api/sys/user';
  import { message } from 'ant-design-vue';

  export default defineComponent<any>({
    name: 'RoleDrawer',
    components: { BasicDrawer, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const treeData = ref<TreeItem[]>([]);

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
          const res = await getRoleList();
          if (res) {
            treeData.value = res as any as TreeItem[];
          }
        }
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          // 将角色列表里role与编辑里映射
          let { role } = data.record
          role = JSON.parse(role)
          const role2 = role.map((item) => {
            return (treeData.value.find(tree => tree.name === item))?.id
          })
          data.record.role2 = role2.filter(_ => _)

          setFieldsValue({
            ...data.record,
          });
        }
      });

      // 判断是新增还是编辑
      const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

      // 提交新增用户
      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          // TODO custom api

          // 新增用户信息
          const params: any = {};
          params.username = values.username;
          params.password = values.password;
          params.nickname = values.nickname;
          params.avatar =
            values.avatar ||
            'http://localhost/avatar/u%3D1415362252%2C942643793%26fm%3D253%26fmt%3Dauto%26app%3D120%26f%3DJPEG.webp';
          params.role = values.role2 || [];
          params.role = JSON.stringify(
            params.role.map((id) => treeData.value.find((tree) => tree.id === id)?.name),
          );
          params.active = values.active || 1;

          const update = unref(isUpdate);
          if (update) {
            // 提交编辑用户
            const res = await editUser(params);
            if (res.affectedRows === 1) {
              message.success('编辑用户信息成功');
            }
          } else {
            // 提交新增用户
            const res = await addUser(params);
            if (res.affectedRows === 1) {
              message.success('新增用户成功');
            }
          }

          // 关闭新增窗口
          closeDrawer();
          emit('success');
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
      };
    },
  });
</script>
