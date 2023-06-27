<template>
  <PageWrapper contentBackground contentClass="flex" dense contentFullHeight>
    <BasicTable @register="registerTable">
      <template #form-custom> </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'matCode'">
          <Tag color="green">
            {{ record.matCode }}
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
                color: 'error',
                onClick: updateMat.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button preIcon="mdi:page-next-outline" type="primary" @click="openModal1">
          新建
        </a-button>
      </template>
    </BasicTable>
    <MatFormModal1 @register="register1" @is-reload="isReload" />
  </PageWrapper>
</template>
<script setup lang="ts">
  import { reactive, onMounted, ref, toRef, toRefs } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicTable, useTable, TableImg, TableAction } from '@/components/Table'
  import { useModal } from '@/components/Modal'
  import MatFormModal1 from './component/MatFormModal1.vue'
  import { Tag } from 'ant-design-vue'
  import noImage from '@/assets/images/noImage.jpg'
  import { getMaterialColumns, getMaterialFormConfig } from './moduleData'
  import { PageWrapper } from '@/components/Page'
  import { getMaterialList, getMatById } from '@/api/productManage/material'
  import { getMatClassTree } from '@/api/productManage/productParam'

  const baseApi = 'https://ims-backend.beyond-itservice.com'
  const searchInfo = reactive<any>({})
  const { createMessage } = useMessage()
  const { info, success, warning, error } = createMessage

  const [registerTable, { reload, getForm }] = useTable({
    title: '物料管理',
    titleHelpMessage: ['可对物料进行增改查等操作'],
    api: getMaterialList,
    columns: getMaterialColumns(),
    formConfig: getMaterialFormConfig(),
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

  function checkImg({ id, thumbnail }: any) {
    if (!(thumbnail === null) && !(thumbnail === '')) {
      return [baseApi + '/image/mat/' + id + '/' + thumbnail]
    } else {
      return [noImage]
    }
  }
  function isReload(value) {
    value && reload()
  }
  function updateMat(record: any) {
    getMatById(record.id).then((data) => {
      if (data.code == 20000) {
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
        options: await getMatClassTree(),
      },
    })
  })
</script>
<style lang="less"></style>
