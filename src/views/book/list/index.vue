<template>
  <PageWrapper :class="prefixCls" title="图书列表">
    <template #headerContent>
      <BasicForm
        :class="`${prefixCls}__header-form`"
        :labelWidth="100"
        :schemas="schemas"
        :showActionButtonGroup="true"
        @submit="handleSearch"
      />
    </template>

    <div :class="`${prefixCls}__container`">
      <a-list>
        <template v-for="item in list" :key="item.id">
          <a-list-item>
            <template #extra>
              <!-- :src="`https://www.youbaobao.xyz/book/res/img/${item.cover}`" -->
              <a :href="wrapperCoverImage(item.cover)" target="_blank">
                <img
                  :class="`${prefixCls}__cover`"
                  width="272"
                  :src="`http://localhost/epub2/${item.fileName}/OEBPS/images/${item.cover}`"
                  alt="logo"
                />

                <!--
               <img
               :src="`https://localhost/book/${item.fileName}${item.cover}`"
                  :class="`${prefixCls}__cover`"
                  width="272"
                  src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                  alt="logo"
                />
              -->
              </a>
            </template>
            <a-list-item-meta>
              <template #description>
                <div :class="`${prefixCls}__action`">
                  <template v-for="action in actions" :key="action.icon">
                    <span :class="`${prefixCls}__time`">{{ item.time }}</span>
                  </template>
                </div>
                <div>
                  <a-button type="primary" @click="editBook(item)" style="margin-right: 20px">
                    编辑
                  </a-button>
                  <a-button type="primary" danger @click="confirmDeleteBook(item)"> 删除 </a-button>
                </div>
              </template>
              <template #title>
                <p :class="`${prefixCls}__title`"> {{ item.title }}({{ item.id }}) </p>
                <div :class="`${prefixCls}__content`">
                  {{ item.content }}
                </div>
                <div>
                  <template v-for="tag in item.description" :key="tag">
                    <Tag class="mb-2">
                      {{ tag }}
                    </Tag>
                  </template>
                </div>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
      <a-pagination
        :total="total"
        :show-total="() => `共${total}条数据`"
        :page-size="pageSize"
        v-model:current="current"
        @change="onPageChange"
      />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  // http://localhost/epub2/2016_Book_PhysiologyPsychoacousticsAndCo/OEBPS/images/978-3-319-25474-6_CoverFigure.jpg
  import { Tag, List, Pagination, Modal, message } from 'ant-design-vue';
  import { defineComponent, ref, unref } from 'vue';
  import { useRouter } from 'vue-router';

  import Icon from '@/components/Icon/Icon.vue';
  import { BasicForm } from '/@/components/Form/index';
  import { PageWrapper } from '/@/components/Page';
  import { actions, searchList, schemas, deleteBookWithId } from './data';
  import { hasAuth } from '/@/utils/auth';
  import { BOOK_DELETE, BOOK_EDIT, BOOK_SEARCH } from '/@/utils/auth/permission-key';

  // 定义查询条件
  const list = ref();
  const title = ref();
  const author = ref();

  // 定义查询页底部数据
  const total = ref(80);
  const current = ref(1);
  const pageSize = ref(20);

  // 搜索数据更新
  const handleSearch = (e) => {
    if(!hasAuth(BOOK_SEARCH, '搜索')) return
    if (e.name) {
      title.value = e.name;
    } else {
      title.value = null;
    }
    if (e.author) {
      author.value = e.author;
    } else {
      author.value = null;
    }
    const params = {
      title: unref(title),
      author: unref(author),
      page: unref(current),
      pageSize: unref(pageSize),
    };
    handleSearchList(params);
  };

  // 搜索事件
  const handleSearchList = (params = {}) => {
    searchList(params).then(({ data, count }) => {
      list.value = data;
      total.value = count;

      // replace(/\/(.*?)\//g
    });
  };

  // 页面切换事件
  const onPageChange = (page, pagesize) => {
    // console.log(page, pageSize)
    current.value = page;
    pageSize.value = pagesize;
    const params = {
      title: unref(title),
      author: unref(author),
      page: unref(current),
      pageSize: unref(pageSize),
    };
    handleSearchList(params);
  };

  // 14-6 封面地址修饰
  const wrapperCoverImage = (cover) => {
    if (cover.startsWith('/')) {
      return `https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png`;
    } else {
      return `http://localhost/cover/${cover}`;
    }
    // http://localhost/epub2/2010_Book_AccountabilityInPublicPolicyPa/OEBPS/xhtml/images//Biomedicine/978-3-319-25474-6_CoverFigure.jpg
    // 9780230238978
  };

  // 确认删除图书
  const confirmDeleteBook = (item) => {
    if (!hasAuth(BOOK_DELETE, '删除')) return
    Modal.confirm({
        title: () => '确认删除图书',
        content: `确认删除id为${item.id}的图书吗？`,
        onOk() {
          // console.log('item', item)
          deleteBookWithId(item.id, item.fileName).then((res) => {
            // console.log('res', res)
            if (res.affectedRows === 1) {
              message.success('删除图书成功');
              // 刷新页面
              onPageChange(current.value, pageSize.value);
            }
          });
        },
        onCancel() {
          // console.log('Cancel');
        },
      });
  };

  export default defineComponent({
    components: {
      Icon,
      Tag,
      BasicForm,
      PageWrapper,
      [List.name]: List,
      [List.Item.name]: List.Item,
      AListItemMeta: List.Item.Meta,
      [Pagination.name]: Pagination,
    },
    mounted() {
      handleSearchList();
    },
    setup() {
      const router = useRouter();

      // 编辑图书
      const editBook = (item) => {
        if (!hasAuth(BOOK_EDIT, '编辑')) return
        const { id } = item;
        router.push('/book/create?id=' + id);
      };

      return {
        prefixCls: 'list-search',
        list,
        actions,
        schemas,
        handleSearch,
        total,
        current,
        pageSize,
        onPageChange,
        wrapperCoverImage,
        confirmDeleteBook,
        editBook,
      };
    },
  });
</script>
<style lang="less" scoped>
  .list-search {
    &__header {
      &-form {
        margin-bottom: -16px;
      }
    }

    &__container {
      padding: 12px;
      background-color: @component-background;
    }

    &__cover {
      width: 120px;
      height: 140px;
    }

    &__title {
      margin-bottom: 0;
      font-size: 18px;
    }

    &__content {
      margin-bottom: 12px;
      color: @text-color-secondary;
    }

    &__action {
      margin-top: 10px;

      &-item {
        display: inline-block;
        padding: 0 16px;
        color: @text-color-secondary;

        &:nth-child(1) {
          padding-left: 0;
        }

        &:nth-child(1),
        &:nth-child(2) {
          border-right: 1px solid @border-color-base;
        }
      }

      &-icon {
        margin-right: 3px;
      }
    }

    &__time {
      color: rgb(0 0 0 / 45%);
    }
  }
</style>
