<template>
  <PageWrapper contentBackground contentClass="flex" dense contentFullHeight>
    <BasicTable @register="registerTable">
      <template #form-custom> </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'prodCode'">
          <Tag color="green">
            {{ record.prodCode }}
          </Tag>
        </template>
        <template v-else-if="column.key === 'codeThumbnail'">
          <TableImg
            stopButtonPropagation
            :size="60"
            :simpleShow="true"
            :imgList="checkImg(record)"
          />
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :dropDownActions="[
              {
                label: '修改',
                icon: 'ic:outline-delete-outline',
                onClick: updateCode.bind(null, record),
              },
              {
                label: '新增同款商品',
                icon: 'ic:outline-delete-outline',
                onClick: addBrotherCode.bind(null, record),
              },
              {
                label: '上传图片',
                icon: 'ic:outline-delete-outline',
                onClick: handleOpen.bind(null, record),
              },
              {
                label: '下载图片',
                icon: 'ic:outline-delete-outline',
                onClick: handleOpen.bind(null, record),
              },
              {
                label: '下载商品说明书',
                icon: 'ic:outline-delete-outline',
                onClick: handleOpen.bind(null, record),
              },
              {
                label: '查看日志',
                icon: 'ic:outline-delete-outline',
                onClick: handleOpen.bind(null, record),
              },
              {
                label: '更换绑定',
                icon: 'ic:outline-delete-outline',
                onClick: handleOpen.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button preIcon="mdi:page-next-outline" type="primary" @click="openSearchStyleModal">
          新建
        </a-button>
      </template>
    </BasicTable>
    <CodeFormModal1 @register="register1" @is-reload="isReload" :styleData="styleData" />
    <CodeFormModal2 @register="register2" @check="addCode" />
  </PageWrapper>
</template>
<script setup lang="ts">
  import { reactive, onMounted, ref, toRef, toRefs } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicTable, useTable, TableImg, TableAction } from '@/components/Table'
  import { useModal } from '@/components/Modal'
  import CodeFormModal1 from './component/CodeFormModal1.vue'
  import CodeFormModal2 from './component/CodeFormModal2.vue'
  import { Tag } from 'ant-design-vue'
  import noImage from '@/assets/images/noImage.jpg'
  import { getProdCodeColumns, getProdCodeFormConfig } from './moduleData'
  import { PageWrapper } from '@/components/Page'
  import { getProdCodeList, getProdCodeById } from '@/api/productManage/productCode'
  import { getProdClassTree } from '@/api/productManage/productParam'

  const baseApi = 'https://ims-backend.beyond-itservice.com'
  const searchInfo = reactive<any>({})
  const styleData = ref({})
  const { createMessage } = useMessage()
  const { info, success, warning, error } = createMessage

  const [registerTable, { reload, getForm }] = useTable({
    title: '商品编号管理',
    titleHelpMessage: ['可对商品进行增改查等操作'],
    api: getProdCodeList,
    columns: getProdCodeColumns(),
    formConfig: getProdCodeFormConfig(),
    striped: false,
    useSearchForm: true,
    showTableSetting: true,
    tableSetting: { fullScreen: false },
    pagination: { pageSize: 10 },
    searchInfo,
    showIndexColumn: false,
    actionColumn: {
      width: 60,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
    },
  })

  function checkImg({ id, styleId, codeThumbnail, styleThumbnail }: any) {
    if (!(codeThumbnail === null) && !(codeThumbnail === '')) {
      return [baseApi + '/image/code/' + id + '/' + codeThumbnail]
    } else if (!(styleThumbnail === null) && !(styleThumbnail === '')) {
      return [baseApi + '/image/style/' + styleId + '/' + styleThumbnail]
    } else {
      return [noImage]
    }
  }
  function isReload(value) {
    value && reload()
  }
  function updateCode(record: any) {
    getProdCodeById(record.id).then((data) => {
      if (data.code == 20000) {
        styleData.value = data.data
        openCodeModal(true, data.data)
      } else {
        error(data.msg)
      }
    })
  }
  function addCode(record: any) {
    styleData.value = record
    openCodeModal(true)
  }
  function addBrotherCode(record: any) {
    getProdCodeById(record.id).then((data) => {
      if (data.code == 20000) {
        styleData.value = data.data
        openCodeModal(true)
      } else {
        error(data.msg)
      }
    })
  }
  //modal
  const [register1, { openModal: openCodeModal }] = useModal()
  const [register2, { openModal: openSearchStyleModal }] = useModal()
  function handleOpen(record: any) {
    console.log('点击了启用', record)
  }
  onMounted(async () => {
    getForm().updateSchema({
      field: `prodClass`,
      componentProps: {
        options: await getProdClassTree(),
      },
    })
  })
</script>
<style lang="less">
  .vben-basic-table-form-container .ant-form {
    margin-bottom: 5px;
  }
</style>
