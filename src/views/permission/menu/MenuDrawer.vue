<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './menu.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { getMenuList } from '/@/api/demo/system';
import { createMenu, updateMenu } from '/@/api/sys/menu';
import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'MenuDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);

      // 10-3 获取menuID
      let menuList

      const { createMessage } = useMessage()

      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          });
        }
        const treeData = await getMenuList();

        // 10-3
        menuList = treeData

        updateSchema({
          field: 'parentMenu',
          componentProps: { treeData },
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

      // 10-4判断子菜单是否全部关闭的方法
      function checkAllChildrenMenuDisabled(updateMenu) {
        const id = updateMenu.id
        let isAllClosed = true

        // 查询二级菜单
        const subMenu = menuList.filter((item) => item.pid === id)

        subMenu.forEach((menu) => {
          if (+menu.active === 1) {
            isAllClosed = false
            return
          }
        })

        if (!isAllClosed) {
          return false
        }

        // 查询三级菜单
        subMenu.forEach((menu) => {
          isAllClosed = checkAllChildrenMenuDisabled(menu)
          if (!isAllClosed) return
        })

        return isAllClosed
      }

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          // TODO custom api

          // 10-2 pid不存在赋为0
          if (values.parentMenu) {
            values.pid = values.parentMenu
          } else {
            values.pid = 0
          }

          // 将字符串类型转为数值类型
          values.active = +values.active
          delete values.parentMenu

          // 10-3
          const isUpdateForm = unref(isUpdate)
          // 判断是更新还是新增
          if (isUpdateForm) {
            // 10-3 获取匹配id
            const menu = menuList.find((item) => values.name === item.name)
            values.id = menu.id

            // 10-4 判断子菜单是否全部关闭
            const ret = checkAllChildrenMenuDisabled(values)
            if (ret) {
              try {
                await updateMenu({ data: values })
                createMessage.success('更新菜单成功')
              } catch (e) {
                console.error(e)
              }
            } else {
              createMessage.error('请先禁用相关子菜单')
            }
            // 10-2 提交新增数据
          } else {
            try {
              await createMenu({ data: values })
              createMessage.success('新建菜单成功')
            } catch (e){
              console.error(e)
            }
          }


          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { registerDrawer, registerForm, getTitle, handleSubmit };
    },
  });
</script>
