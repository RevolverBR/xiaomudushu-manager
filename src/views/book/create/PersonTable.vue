<template>
  <div>
    <BasicTable @register="registerTable"> </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent, toRefs, h, unref } from 'vue';
  import { useRoute } from 'vue-router';
  import {
    BasicTable,
    useTable,
    BasicColumn,
    ActionItem,
    EditRecordRow,
  } from '/@/components/Table';

  const columns: BasicColumn[] = [
    {
      title: '序号',
      dataIndex: 'playOrder',
    },
    {
      title: '目录ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'text',
    },
    {
      title: '链接',
      dataIndex: 'href',
      customCell: (record) => {
        return {
          // onClick: () => {
          //   const data = unref(record.href)
          //   console.log('data', data)
          //   const url = `http://localhost/book/2010_Book_AccountabilityInPublicPolicyPa/${data}`
          //   console.log(url)
          // }
          onClick: () => {
            const data = unref(record.href);
            const url = `http://localhost/book/2010_Book_AccountabilityInPublicPolicyPa/${data}`;

            // window.open(url,'_blank','location=no')
            window.open(url,'_blank');
          },
        };
      },

      // title: '链接',
      // dataIndex: 'href',
      // customRender: (data) => {
      //   const text = data.text;
      //   return {
      //     children: h(
      //       'a',
      //       {
      //         href: `http://localhost/epub2/2010_Book_AccountabilityInPublicPolicyPa/OEBPS/xhtml/${text}`,
      //         target: '_blank',
      //       },
      //       'Read',
      //     ),
      //   };
      // },
    },
  ];

  export default defineComponent({
    components: { BasicTable },
    props: {
      data: Array,
    },
    setup(props) {
      const { data } = toRefs(props);
      const [registerTable, { getDataSource }] = useTable({
        columns: columns,
        showIndexColumn: false,
        dataSource: data,
        scroll: { y: '100%' },
        pagination: false,
      });

      function handleEdit(record: EditRecordRow) {
        record.onEdit?.(true);
      }

      function handleCancel(record: EditRecordRow) {
        record.onEdit?.(false);
        if (record.isNew) {
          const data = getDataSource();
          const index = data.findIndex((item) => item.key === record.key);
          data.splice(index, 1);
        }
      }

      function handleSave(record: EditRecordRow) {
        record.onEdit?.(false, true);
      }

      // function handleAdd() {
      //   const data = getDataSource();
      //   const addRow: EditRecordRow = {
      //     name: '',
      //     no: '',
      //     dept: '',
      //     editable: true,
      //     isNew: true,
      //     key: `${Date.now()}`,
      //   };
      //   data.push(addRow);
      // }

      function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
        if (!record.editable) {
          return [
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              label: '删除',
            },
          ];
        }
        return [
          {
            label: '保存',
            onClick: handleSave.bind(null, record, column),
          },
          {
            label: '取消',
            popConfirm: {
              title: '是否取消编辑',
              confirm: handleCancel.bind(null, record, column),
            },
          },
        ];
      }

      return {
        registerTable,
        handleEdit,
        createActions,
        getDataSource,
      };
    },
  });
</script>
