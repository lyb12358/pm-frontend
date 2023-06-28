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
                icon: 'ic:outline-delete-outline',
                color: 'error',
                onClick: updateMat.bind(null, record),
              },
              {
                label: '上传图片',
                icon: 'ic:outline-delete-outline',
                onClick: handleUpload.bind(null, record),
              },
              {
                label: '下载原图',
                icon: 'ic:outline-delete-outline',
                onClick: downloadIamge.bind(null, record),
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
  import { BasicUpload } from '@/components/Upload'
  import MatFormModal1 from './component/MatFormModal1.vue'
  import { Tag } from 'ant-design-vue'
  import noImage from '@/assets/images/noImage.jpg'
  import { baseApi, getMaterialColumns, getMaterialFormConfig } from './moduleData'
  import { PageWrapper } from '@/components/Page'
  import { getMaterialList, getMatById } from '@/api/productManage/material'
  import { getMatClassTree } from '@/api/productManage/productParam'
  import { uploadMatImg } from '@/api/productManage/productPlus'

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

  function checkPreviewImg({ id, thumbnail }: any) {
    if (!(thumbnail === null) && !(thumbnail === '')) {
      return [baseApi + '/image/mat/' + id + '/' + thumbnail]
    } else {
      return [noImage]
    }
  }
  function checkImg({ id, image }: any) {
    if (!(image === null) && !(image === '')) {
      return [baseApi + '/image/style/' + id + '/' + image]
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
  //下载图片
  function downloadIamge(record: any) {
    let imgsrc = checkImg(record)[0]
    let name = record.prodName
    //下载图片地址和图片名
    let image = new Image()
    // 解决跨域 Canvas 污染问题
    image.setAttribute('crossOrigin', 'anonymous')
    image.onload = function () {
      let canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      let context = canvas.getContext('2d')
      context?.drawImage(image, 0, 0, image.width, image.height)
      let url = canvas.toDataURL('image/jpeg') //得到图片的base64编码数据'
      let a = document.createElement('a') // 生成一个a元素
      let event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      }) // 创建一个单击事件
      a.download = name || 'photo' // 设置图片名称
      a.href = url // 将生成的URL设置为a.href属性
      a.dispatchEvent(event) // 触发a的单击事件
    }
    image.src = imgsrc
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
