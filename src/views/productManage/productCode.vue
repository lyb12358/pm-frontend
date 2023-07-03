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
            :imgList="checkPreviewImg(record)"
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
                onClick: handleUpload.bind(null, record),
              },
              {
                label: '下载原图',
                icon: 'ic:outline-delete-outline',
                onClick: downloadIamge.bind(null, record),
              },
              {
                label: '下载商品说明书',
                icon: 'ic:outline-delete-outline',
                onClick: downloadSpec.bind(null, record),
              },
              {
                label: '更换款式绑定',
                icon: 'ic:outline-delete-outline',
                onClick: switchBind.bind(null, record),
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
            :accept="['image/*']"
        /></div>
        <a-button preIcon="mdi:page-next-outline" type="primary" @click="openSearchStyleModal">
          新建
        </a-button>
      </template>
    </BasicTable>
    <CodeFormModal1 @register="register1" @is-reload="isReload" :styleData="styleData" />
    <CodeFormModal2 @register="register2" @check="addCode" />
    <SwitchBindModal @register="register3" @is-reload="isReload" />
  </PageWrapper>
</template>
<script setup lang="ts">
  import { reactive, onMounted, ref, toRef, toRefs } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicTable, useTable, TableImg, TableAction } from '@/components/Table'
  import { useModal } from '@/components/Modal'
  import { BasicUpload } from '@/components/Upload'
  import { uploadApi } from '@/api/sys/upload'
  import CodeFormModal1 from './component/CodeFormModal1.vue'
  import CodeFormModal2 from './component/CodeFormModal2.vue'
  import SwitchBindModal from './component/SwitchBindModal.vue'
  import { Tag } from 'ant-design-vue'
  import noImage from '@/assets/images/noImage.jpg'
  import { getProdCodeColumns, getProdCodeFormConfig } from './moduleData'
  import { PageWrapper } from '@/components/Page'
  import { getProdCodeList, getProdCodeById } from '@/api/productManage/productCode'
  import { getProdClassTree } from '@/api/productManage/productParam'
  import { uploadCodeImg, specDownload } from '@/api/productManage/productPlus'
  import { useGlobSetting } from '/@/hooks/setting'

  const { apiUrl } = useGlobSetting()
  const baseApi = apiUrl + '/pm'
  const searchInfo = reactive<any>({})
  const styleData = ref({})
  const singleUpload = ref()
  const singleImgParam = ref({ id: null })
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

  function checkPreviewImg({ id, styleId, codeThumbnail, styleThumbnail }: any) {
    if (!(codeThumbnail === null) && !(codeThumbnail === '')) {
      return [baseApi + '/image/code/' + id + '/' + codeThumbnail]
    } else if (!(styleThumbnail === null) && !(styleThumbnail === '')) {
      return [baseApi + '/image/style/' + styleId + '/' + styleThumbnail]
    } else {
      return [noImage]
    }
  }
  function checkImg({ id, styleId, codeImage, styleImage }: any) {
    if (!(codeImage === null) && !(codeImage === '')) {
      return [baseApi + '/image/code/' + id + '/' + codeImage]
    } else if (!(styleImage === null) && !(styleImage === '')) {
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
      if (data.code == 200) {
        styleData.value = data.data
        openCodeModal(true)
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
  //download specification
  function downloadSpec(record) {
    specDownload(record.id).then((response) => {
      fileDownload(response, record.prodName + '商品说明书.pdf')
    })
  }
  // public method to download file
  function fileDownload(data, name) {
    if (!data) {
      return
    }
    let url = window.URL.createObjectURL(new Blob([data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', name)
    document.body.appendChild(link)
    link.click()
    // release url object
    URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
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
  //switch bind
  function switchBind(record: any) {
    openSwitchBindModal(true, record)
  }
  //modal
  const [register1, { openModal: openCodeModal }] = useModal()
  const [register2, { openModal: openSearchStyleModal }] = useModal()
  const [register3, { openModal: openSwitchBindModal }] = useModal()

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
