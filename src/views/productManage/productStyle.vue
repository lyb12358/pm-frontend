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
                icon: 'icon-park-outline:modify',
                onClick: updateStyle.bind(null, record),
                auth: 'productStyle:update',
              },
              {
                label: '增加同款式商品',
                icon: 'mdi:new-box',
                onClick: addCode.bind(null, record),
                auth: 'productStyle:addChild',
              },
              {
                label: '上传图片',
                icon: 'fluent:image-add-24-regular',
                onClick: handleUpload.bind(null, record),
                auth: 'productStyle:uploadImage',
              },
              {
                label: '下载原图',
                icon: 'uil:image-download',
                onClick: downloadIamge.bind(null, checkImg(record)[0], record.prodName),
                auth: 'productStyle:downloadImage',
              },
              {
                label: '查看日志',
                icon: 'mdi:pencil-box',
                onClick: openLogModal.bind(null, true, { type: 1, id: record.id }),
                auth: 'productStyle:log',
              },
              {
                label: '换绑所属编号',
                icon: 'mdi:format-section',
                onClick: switchBind.bind(null, record),
                auth: 'productStyle:switchBind',
              },
              {
                label: '删除',
                icon: 'mdi:delete',
                onClick: deleteStyle.bind(null, record.id),
                auth: 'productStyle:delete',
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
            :accept="['image/*']" /><BasicUpload
            ref="multiUpload"
            :maxSize="5"
            :maxNumber="100"
            @change="handleChange"
            :api="uploadBatchStyleImg"
            :uploadParams="multiImgParam"
            class="my-5"
            :accept="['image/*']"
        /></div>
        <a-button
          preIcon="ep:upload-filled"
          type="primary"
          @click="handleMultiUpload"
          :loading="excelLoading"
          v-show="hasPermission('productCode:batchImageUpload')"
        >
          批量上传图片
        </a-button>
        <a-button
          preIcon="mdi:new-box"
          type="primary"
          @click="openStyleModal"
          v-show="hasPermission('productStyle:add')"
        >
          新建
        </a-button>
      </template>
    </BasicTable>
    <StyleFormModal1 @register="register1" @is-reload="isReload" />
    <CodeFormModal1 @register="register2" @is-reload="isReload" :styleData="styleData" />
    <SwitchBindModal @register="register3" @is-reload="isReload" />
    <LogModal @register="register4" />
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
  import SwitchBindModal from './component/SwitchBindModal.vue'
  import LogModal from './component/LogModal.vue'
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
  import { uploadStyleImg, uploadBatchStyleImg } from '@/api/productManage/productPlus'
  import { usePermission } from './customUtil/usePermission'
  import { useUtil } from './customUtil/useUtil'
  import { useGlobSetting } from '/@/hooks/setting'

  const { apiUrl } = useGlobSetting()
  const { hasPermission, checkMaintainPermission } = usePermission()
  const { downloadIamge } = useUtil()
  const baseApi = apiUrl + '/pm'
  const searchInfo = reactive<any>({})
  const excelLoading = ref(false)
  const styleData = ref({})
  const singleUpload = ref()
  const singleImgParam = ref({ id: null })
  const multiImgParam = ref({})
  const multiUpload = ref()
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

  function checkPreviewImg({ id, thumbnail }: any) {
    if (!(thumbnail === null) && !(thumbnail === '') && !(thumbnail === undefined)) {
      return [baseApi + '/image/style/' + id + '/' + thumbnail]
    } else {
      return [noImage]
    }
  }
  function checkImg({ id, image }: any) {
    if (!(image === null) && !(image === '') && !(image === undefined)) {
      return [baseApi + '/image/style/' + id + '/' + image]
    } else {
      return [noImage]
    }
  }
  function isReload(value) {
    value && reload()
  }
  function updateStyle(record: any) {
    getProdStyleById(record.id).then((data) => {
      if (data.code == 200) {
        checkMaintainPermission(data.data.prodType)
          ? openStyleModal(true, data.data)
          : error('没有权限维护该类别商品')
      } else {
        error(data.msg)
      }
    })
  }
  function addCode(record: any) {
    getProdStyleById(record.id).then((data) => {
      if (data.code == 200) {
        if (checkMaintainPermission(data.data.prodType)) {
          styleData.value = data.data
          openCodeModal(true)
        } else {
          error('没有权限维护该类别商品')
        }
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
  function handleMultiUpload(record: any) {
    multiUpload.value.fileList = []
    multiUpload.value.openUploadModal()
  }
  //switch bind
  function switchBind(record: any) {
    openSwitchBindModal(true, record)
  }
  //delete
  function deleteStyle(id) {
    deleteProdStyle(id).then((data) => {
      if (data.code == 200) {
        reload()
      } else {
        error(data.msg)
      }
    })
  }
  //modal
  const [register1, { openModal: openStyleModal }] = useModal()
  const [register2, { openModal: openCodeModal }] = useModal()
  const [register3, { openModal: openSwitchBindModal }] = useModal()
  const [register4, { openModal: openLogModal }] = useModal()
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
