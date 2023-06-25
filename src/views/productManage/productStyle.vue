<template>
  <PageWrapper contentBackground contentClass="flex" dense contentFullHeight>
    <BasicTable @register="registerTable">
      <template #form-custom> </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'prodStyle'">
          <Tag color="green">
            {{ record.prodStyle }}
          </Tag>
        </template>
        <template v-else-if="column.key === 'thumbnail'">
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
                onClick: updateStyle.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button preIcon="mdi:plus-thick" type="primary" @click="openModal1"> 新建 </a-button>
      </template>
    </BasicTable>
    <StyleFormModal1 @register="register1" @is-reload="isReload" />
  </PageWrapper>
</template>
<script setup lang="ts">
  import { reactive, onMounted, ref, toRef, toRefs } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicTable, useTable, TableImg, TableAction } from '@/components/Table'
  import { useModal } from '@/components/Modal'
  import StyleFormModal1 from './component/StyleFormModal1.vue'
  import { Tag } from 'ant-design-vue'
  import noImage from '@/assets/images/noImage.jpg'
  import { getProdStyleColumns, getProdStyleFormConfig } from './moduleData'
  import { PageWrapper } from '@/components/Page'
  import {
    getProdStyleList,
    getProdStyleById,
    deleteProdStyle,
  } from '@/api/productManage/productStyle'
  import { getProdClassTreeOnMiddleType } from '@/api/productManage/productParam'

  const baseApi = 'https://ims-backend.beyond-itservice.com'
  const searchInfo = reactive<any>({})
  const { createMessage } = useMessage()
  const { info, success, warning, error } = createMessage

  const [registerTable, { reload, getForm }] = useTable({
    title: '商品款式管理',
    titleHelpMessage: ['可对款式进行增删改查等操作'],
    api: getProdStyleList,
    columns: getProdStyleColumns(),
    formConfig: getProdStyleFormConfig(),
    striped: false,
    useSearchForm: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
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

  function checkImg({ id, thumbnail }: any) {
    if (!(thumbnail === null) && !(thumbnail === '')) {
      return [baseApi + '/image/style/' + id + '/' + thumbnail]
    } else {
      return [noImage]
    }
  }
  function isReload(value) {
    value && reload()
  }
  function updateStyle(record: any) {
    getProdStyleById(record.id).then((data) => {
      if (data.code == 20000) {
        success(data.msg)
        openModal1(true, data.data)
      } else {
        error(data.msg)
      }
    })
  }
  //modal
  const [register1, { openModal: openModal1 }] = useModal()

  onMounted(async () => {
    getForm().updateSchema({
      field: `prodClass`,
      componentProps: {
        options: await getProdClassTreeOnMiddleType(),
      },
    })
  })
</script>
<style lang="less"></style>
