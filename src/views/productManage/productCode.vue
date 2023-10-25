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
                icon: 'icon-park-outline:modify',
                onClick: updateCode.bind(null, record),
                auth: 'productCode:update',
              },
              {
                label: '新增同款商品',
                icon: 'mdi:new-box',
                onClick: addBrotherCode.bind(null, record),
                auth: 'productCode:addBro',
              },
              {
                label: '上传图片',
                icon: 'fluent:image-add-24-regular',
                onClick: handleUpload.bind(null, record),
                auth: 'productCode:uploadImage',
              },
              {
                label: '下载原图',
                icon: 'uil:image-download',
                onClick: downloadIamge.bind(null, checkImg(record)[0], record.prodName),
                auth: 'productCode:downloadImage',
              },
              {
                label: '下载商品说明书',
                icon: 'mdi:file-export-outline',
                onClick: downloadSpec.bind(null, record),
                auth: 'productCode:downloadDesc',
              },
              {
                label: '查看日志',
                icon: 'mdi:pencil-box',
                onClick: openLogModal.bind(null, true, { type: 2, id: record.id }),
                auth: 'productCode:log',
              },
              {
                label: '更换款式绑定',
                icon: 'mdi:format-section',
                onClick: switchBind.bind(null, record),
                auth: 'productCode:switchBind',
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
            :api="uploadCodeImg"
            :uploadParams="singleImgParam"
            class="my-5"
            :accept="['image/*']" /><BasicUpload
            ref="multiUpload"
            :maxSize="5"
            :maxNumber="100"
            @change="handleChange"
            :api="uploadBatchCodeImg"
            :uploadParams="multiImgParam"
            class="my-5"
            :accept="['image/*']"
        /></div>
        <a-button
          preIcon="fa6-solid:file-excel"
          type="primary"
          @click="handleExport"
          :loading="excelLoading"
          v-show="hasPermission('productCode:export')"
        >
          导出
        </a-button>
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
          @click="openSearchStyleModal"
          v-show="hasPermission('productCode:add')"
        >
          新建(通过款号)
        </a-button>
        <a-button
          preIcon="mdi:new-box"
          type="primary"
          @click="openSearchStyleNameModal"
          v-show="hasPermission('productCode:add')"
        >
          新建(通过款名)
        </a-button>
      </template>
    </BasicTable>
    <CodeFormModal1 @register="register1" @is-reload="isReload" :styleData="styleData" />
    <CodeFormModal2 @register="register2" @check="addCode" />
    <SwitchBindModal @register="register3" @is-reload="isReload" />
    <CodeFormModal3 @register="register5" @check="addCode" />
    <LogModal @register="register4" />
  </PageWrapper>
</template>
<script setup lang="ts">
  import { reactive, onMounted, ref, toRef, toRefs } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicTable, useTable, TableImg, TableAction } from '@/components/Table'
  import { useModal } from '@/components/Modal'
  import { BasicUpload } from '@/components/Upload'
  import CodeFormModal1 from './component/CodeFormModal1.vue'
  import CodeFormModal2 from './component/CodeFormModal2.vue'
  import CodeFormModal3 from './component/CodeFormModal3.vue'
  import SwitchBindModal from './component/SwitchBindModal.vue'
  import LogModal from './component/LogModal.vue'
  import { Tag } from 'ant-design-vue'
  import noImage from '@/assets/images/noImage.jpg'
  import { getProdCodeColumns, getProdCodeFormConfig } from './moduleData'
  import { PageWrapper } from '@/components/Page'
  import { getProdCodeList, getProdCodeById } from '@/api/productManage/productCode'
  import { getProdClassTree } from '@/api/productManage/productParam'
  import {
    uploadCodeImg,
    uploadBatchCodeImg,
    specDownload,
    codeExport,
  } from '@/api/productManage/productPlus'
  import { usePermission } from './customUtil/usePermission'
  import { useUtil } from './customUtil/useUtil'
  import { dateUtil } from '@/utils/dateUtil'
  import { useUserStore } from '@/store/modules/user'
  import { useGlobSetting } from '/@/hooks/setting'

  const { apiUrl } = useGlobSetting()
  const { hasPermission, checkMaintainPermission, viewPermissions, maintainPermission } =
    usePermission()
  const { downloadIamge, fileDownload } = useUtil()
  const baseApi = apiUrl + '/pm'
  const searchInfo = { classPermission: maintainPermission }
  const excelLoading = ref(false)
  const styleData = ref({})
  const singleUpload = ref()
  const singleImgParam = ref({ id: null })
  const multiImgParam = ref({})
  const multiUpload = ref()
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
  //modal
  const [register1, { openModal: openCodeModal }] = useModal()
  const [register2, { openModal: openSearchStyleModal }] = useModal()
  const [register5, { openModal: openSearchStyleNameModal }] = useModal()
  const [register3, { openModal: openSwitchBindModal }] = useModal()
  const [register4, { openModal: openLogModal }] = useModal()
  function checkPreviewImg({ id, styleId, codeThumbnail, styleThumbnail }: any) {
    if (!(codeThumbnail === null) && !(codeThumbnail === '') && !(codeThumbnail === undefined)) {
      return [baseApi + '/image/code/' + id + '/' + codeThumbnail]
    } else if (
      !(styleThumbnail === null) &&
      !(styleThumbnail === '') &&
      !(styleThumbnail === undefined)
    ) {
      return [baseApi + '/image/style/' + styleId + '/' + styleThumbnail]
    } else {
      return [noImage]
    }
  }
  function checkImg({ id, styleId, codeImage, styleImage }: any) {
    if (!(codeImage === null) && !(codeImage === '') && !(codeImage === undefined)) {
      return [baseApi + '/image/code/' + id + '/' + codeImage]
    } else if (!(styleImage === null) && !(styleImage === '') && !(styleImage === undefined)) {
      return [baseApi + '/image/style/' + styleId + '/' + styleImage]
    } else {
      return [noImage]
    }
  }
  function isReload(value) {
    value && reload()
  }
  function updateCode(record: any) {
    getProdCodeById(record.id).then((data) => {
      if (data.code == 200) {
        if (checkMaintainPermission(data.data.prodType)) {
          styleData.value = data.data
          openCodeModal(true, data.data)
        } else {
          error('没有权限维护该类别商品')
        }
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
  //download specification
  function downloadSpec(record) {
    specDownload(record.id).then((response) => {
      fileDownload(response, record.prodName + '商品说明书.pdf')
    })
  }
  //upload
  function handleUpload(record: any) {
    singleImgParam.value.id = record.id
    singleUpload.value.fileList = []
    singleUpload.value.openUploadModal()
  }
  function handleMultiUpload(record: any) {
    multiUpload.value.fileList = []
    multiUpload.value.openUploadModal()
  }
  function handleChange(list: string[]) {
    reload()
  }
  //switch bind
  function switchBind(record: any) {
    openSwitchBindModal(true, record)
  }
  //export
  function handleExport() {
    const formData = getForm().getFieldsValue()
    if (JSON.stringify(formData) == '{}') {
      warning('搜索项没有值，不允许导出操作!')
    } else {
      formData.permissions = viewPermissions ? viewPermissions : []
      formData.classPermission = maintainPermission
      excelLoading.value = true
      codeExport(formData)
        .then((data) => {
          fileDownload(
            data,
            '商品编号导出' + dateUtil(Date.now()).format('YYYY-MM-DD HH:mm:ss') + '.xlsx',
          )
        })
        .finally(() => {
          excelLoading.value = false
        })
    }
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
