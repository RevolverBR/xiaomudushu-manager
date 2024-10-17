<template>
  <PageWrapper class="high-form" title="添加图书" content=" 请添加图书信息，并提交订单。">
    <a-card title="基本信息" :bordered="false">
      <BasicForm @register="register" />
    </a-card>
    <a-card title="上传电子书" :bordered="false" class="!mt-5">
      <BasicForm @register="registerTask" />
    </a-card>
    <a-card title="电子书目录" :bordered="false" class="!mt-5">
      <PersonTable ref="tableRef" :data="contentData" />
    </a-card>

    <template #rightFooter>
      <a-button type="primary" @click="submitAll"> 提交 </a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts">
  import { BasicForm, useForm } from '/@/components/Form';
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import PersonTable from './PersonTable.vue';
  import { PageWrapper } from '/@/components/Page';
  import { schemas, taskSchemas, categoryTextOptions } from './data';
  import { Card, message } from 'ant-design-vue';
  import { addBook, addContents, getBook, updateBook } from '/@/api/book/book';
import { hasAuth } from '/@/utils/auth';
import { BOOK_SUBMIT } from '/@/utils/auth/permission-key';

  export default defineComponent({
    name: 'FormHightPage',
    components: { BasicForm, PersonTable, PageWrapper, [Card.name]: Card },
    setup() {
      const router = useRouter();
      onMounted(() => {
        const { id } = router.currentRoute.value.query;
        if (id) {
          getBook(id).then((res) => {
            const [book] = res;
            // console.log(book);
            setFieldsValue({
              title: book.title,
              author: book.author,
              publisher: book.publisher,
              categoryText: book.categoryText,
              language: book.language,
              fileName: book.fileName,
              cover: book.cover,
              rootFile: book.rootFile,
            });
          });
        }
      });

      const tableRef = ref<{ getDataSource: () => any } | null>(null);
      // 14-7
      const contentData = ref([]);

      // 基本展示信息
      const [register, { validate, setFieldsValue, getFieldsValue, resetFields }] = useForm({
        layout: 'vertical',
        baseColProps: {
          span: 6,
        },
        schemas: schemas,
        showActionButtonGroup: false,
      });

      // 编辑信息
      const [
        registerTask,
        {
          validate: validateTaskForm,
          resetFields: resetFields2,
          setFieldsValue: setFieldsValue2,
          getFieldsValue: getFieldsValue2,
        },
      ] = useForm({
        layout: 'vertical',
        baseColProps: {
          span: 6,
        },
        schemas: taskSchemas({ setFieldsValue, getFieldsValue, contentData }),
        showActionButtonGroup: false,
      });

      // 点击提交
      async function submitAll() {
        if (!hasAuth(BOOK_SUBMIT, '提交')) return
        try {
          if (tableRef.value) {
            // console.log('table data:', tableRef.value.getDataSource());
          }

          const [values, taskValues] = await Promise.all([validate(), validateTaskForm()]);
          // console.log('form data:', values, taskValues);

          const { title, author, cover, fileName, language, publisher, rootFile, categoryText } =
            values;
          const category =
            categoryTextOptions.find((item) => item.value === categoryText)?.label || 'unknown';
          // console.log('form data', values, taskValues, getFieldsValue2());

          // 带id时更新图书
          const { id } = router.currentRoute.value.query;
          if (id) {
            const res = await updateBook({
              id,
              title,
              author,
              publisher,
              categoryText,
              language
            })
            // console.log(res)
            if (res.affectedRows === 1) {
              message.success('修改图书信息成功')
            }
          } else {
            const res = await addBook({
              title,
              author,
              cover,
              fileName,
              language,
              publisher,
              rootFile,
              category: categoryText,
              categoryText: category,
              updateType: 0,
            });
            // console.log(contentData.value)
            for (const content of contentData.value) {
              const { id, playOrder, text, href } = content;
              const url = `http://localhost/book/2010_Book_AccountabilityInPublicPolicyPa/${href}`;
              // console.log(url)

              // 点击提交同时提交图书目录
              await addContents({
                fileName,
                id,
                href,
                order: playOrder,
                level: 0,
                text: url,
                label: text,
                pid: '',
                navId: id,
              });
            }

            // 电子书新增成功后清空表单数据
            if (res.affectedRows === 1) {
              message.success('电子书新增成功');
              await resetFields();
              await resetFields2();
              contentData.value = [];
            }
          }
        } catch (error) {
          // 打印错误信息
          // console.log('submitAll', error);
          if (error.message.startsWith('Duplicate entry')) {
            message.error('电子书重复添加');
          } else {
            console.log(error);
          }
        }
      }

      return { register, registerTask, submitAll, tableRef, contentData };
    },
  });
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }
</style>
