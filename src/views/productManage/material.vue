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
            :imgList="checkPreviewImg(record)"
          />
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :dropDownActions="[
              {
                label: '修改',
                icon: 'icon-park-outline:modify',
                onClick: updateMat.bind(null, record),
                auth: 'material:update',
              },
              {
                label: '上传图片',
                icon: 'fluent:image-add-24-regular',
                onClick: handleUpload.bind(null, record),
                auth: 'material:uploadImage',
              },
              {
                label: '下载原图',
                icon: 'uil:image-download',
                onClick: downloadIamge.bind(null, checkImg(record)[0], record.matName),
                auth: 'material:downloadImage',
              },
              {
                label: '查看日志',
                icon: 'mdi:pencil-box',
                onClick: openLogModal.bind(null, true, { type: 3, id: record.id }),
                auth: 'material:log',
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
            :api="uploadMatImg"
            :uploadParams="singleImgParam"
            class="my-5"
            :accept="['image/*']"
        /></div>
        <a-button
          preIcon="mdi:new-box"
          type="primary"
          @click="openNewModal"
          v-show="hasPermission('material:add')"
        >
          新建
        </a-button>
      </template>
    </BasicTable>
    <MatFormModal1 @register="register1" @is-reload="isReload" />
    <LogModal @register="register2" />
  </PageWrapper>
</template>
<script setup lang="ts">
  import { reactive, onMounted, ref, toRef, toRefs } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicTable, useTable, TableImg, TableAction } from '@/components/Table'
  import { useModal } from '@/components/Modal'
  import { BasicUpload } from '@/components/Upload'
  import MatFormModal1 from './component/MatFormModal1.vue'
  import LogModal from './component/LogModal.vue'
  import { Tag } from 'ant-design-vue'
  import noImage from '@/assets/images/noImage.jpg'
  import { getMaterialColumns, getMaterialFormConfig } from './moduleData'
  import { PageWrapper } from '@/components/Page'
  import { getMaterialList, getMatById } from '@/api/productManage/material'
  import { getMatClassTree } from '@/api/productManage/productParam'
  import { uploadMatImg } from '@/api/productManage/productPlus'
  import { usePermission } from './customUtil/usePermission'
  import { useUtil } from './customUtil/useUtil'
  import { useGlobSetting } from '/@/hooks/setting'

  const { apiUrl } = useGlobSetting()
  const { hasPermission, checkMaintainPermission } = usePermission()
  const { downloadIamge } = useUtil()
  const baseApi = apiUrl + '/pm'
  const searchInfo = reactive<any>({})
  const singleUpload = ref()
  const singleImgParam = ref({ id: null })
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
  //modal
  const [register1, { openModal: openModal1 }] = useModal()
  const [register2, { openModal: openLogModal }] = useModal()
  onMounted(async () => {
    getForm().updateSchema({
      field: `prodClass`,
      componentProps: {
        options: await getMatClassTree(),
      },
    })
  })

  function checkPreviewImg({ id, thumbnail }: any) {
    if (!(thumbnail === null) && !(thumbnail === '') && !(thumbnail === undefined)) {
      return [baseApi + '/image/mat/' + id + '/' + thumbnail]
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
  function openNewModal() {
    openModal1()
  }
  function updateMat(record: any) {
    getMatById(record.id).then((data) => {
      if (data.code == 200) {
        checkMaintainPermission(data.data.matType)
          ? openModal1(true, data.data)
          : error('没有权限维护该类别物料/辅料')
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
</script>
<style lang="less"></style>
