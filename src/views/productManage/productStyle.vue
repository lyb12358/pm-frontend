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
                label: '修改款式信息',
                icon: 'ic:outline-delete-outline',
                onClick: updateStyle.bind(null, record),
              },
              {
                label: '增加同款式商品',
                icon: 'ic:outline-delete-outline',
                onClick: addCode.bind(null, record),
              },
              {
                label: '上传图片',
                icon: 'ic:outline-delete-outline',
                onClick: handleUpload.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <!-- 平时隐藏上传按钮，通过其他按钮来控制显示 -->
        <div v-show="false">
          <BasicUpload
            ref="singleUpload"
            :maxSize="5"
            :maxNumber="1"
            @change="handleChange"
            :api="uploadStyleImg"
            :uploadParams="singleImgParam"
            class="my-5"
            :accept="['image/*']"
        /></div>
        <a-button preIcon="mdi:plus-thick" type="primary" @click="openStyleModal"> 新建 </a-button>
      </template>
    </BasicTable>
    <StyleFormModal1 @register="register1" @is-reload="isReload" />
    <CodeFormModal1 @register="register2" @is-reload="isReload" :styleData="styleData" />
  </PageWrapper>
</template>
<script setup lang="ts">
  import { reactive, onMounted, ref, toRef, toRefs } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicTable, useTable, TableImg, TableAction } from '@/components/Table'
  import { useModal } from '@/components/Modal'
  import { BasicUpload } from '@/components/Upload'
  import StyleFormModal1 from './component/StyleFormModal1.vue'
  import CodeFormModal1 from './component/CodeFormModal1.vue'
  import { Tag } from 'ant-design-vue'
  import noImage from '@/assets/images/noImage.jpg'
  import { baseApi, getProdStyleColumns, getProdStyleFormConfig } from './moduleData'
  import { PageWrapper } from '@/components/Page'
  import {
    getProdStyleList,
    getProdStyleById,
    deleteProdStyle,
  } from '@/api/productManage/productStyle'
  import { getProdClassTreeOnMiddleType } from '@/api/productManage/productParam'
  import { uploadStyleImg } from '@/api/productManage/productPlus'

  const searchInfo = reactive<any>({})
  const styleData = ref({})
  const singleUpload = ref()
  const singleImgParam = ref({ id: null })
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
        openStyleModal(true, data.data)
      } else {
        error(data.msg)
      }
    })
  }
  function addCode(record: any) {
    getProdStyleById(record.id).then((data) => {
      if (data.code == 20000) {
        styleData.value = data.data
        openCodeModal(true)
      } else {
        error(data.msg)
      }
    })
  }
  //upload
  function handleUpload(record: any) {
    singleImgParam.value.id = record.id
    singleUpload.value.fileList = []
    singleUpload.value.openUploadModal()
  }
  function handleChange(list: string[]) {
    reload()
  }
  //modal
  const [register1, { openModal: openStyleModal }] = useModal()
  const [register2, { openModal: openCodeModal }] = useModal()

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
