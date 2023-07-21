<template>
  <PageWrapper contentBackground contentClass="flex" dense contentFullHeight>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'op'">
          <a-button size="small" @click="openAnalysisModal(true, record)" color="warning">
            修改
          </a-button>
          <a-button
            size="small"
            class="ml-1"
            @click="openAnalysisDetailModal(true, record)"
            color="success"
          >
            细节
          </a-button>
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
        <a-button preIcon="mdi:new-box" type="primary" @click="openAnalysisModal"> 新建 </a-button>
      </template>
    </BasicTable>
    <AnalysisFormModal @register="register1" @is-reload="isReload" />
    <AnalysisDetailModal @register="register2" />
  </PageWrapper>
</template>
<script setup lang="ts">
  import { reactive, onMounted, ref, toRef, toRefs } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicTable, useTable, TableImg, TableAction } from '@/components/Table'
  import { useModal } from '@/components/Modal'
  import AnalysisFormModal from './component/AnalysisFormModal.vue'
  import AnalysisDetailModal from './component/AnalysisDetailModal.vue'
  import { BasicUpload } from '@/components/Upload'
  import Icon from '@/components/Icon/Icon.vue'
  import { getAnalysisColumns } from './productAnalysisData'
  import { PageWrapper } from '@/components/Page'
  import { getAnalysisList } from '@/api/productManage/productAnalysis'
  import { uploadMatImg } from '@/api/productManage/productPlus'
  import { usePermission } from './customUtil/usePermission'

  const { hasPermission } = usePermission()
  const searchInfo = reactive<any>({})
  const singleUpload = ref()
  const singleImgParam = ref({ id: null })
  const { createMessage } = useMessage()
  const { info, success, warning, error } = createMessage

  const [registerTable, { reload, getForm }] = useTable({
    title: '分析管理',
    titleHelpMessage: ['可对商品五层级别额外设置对应分析维度'],
    api: getAnalysisList,
    columns: getAnalysisColumns(),
    striped: false,
    showTableSetting: true,
    tableSetting: { fullScreen: false },
    pagination: { pageSize: 10 },
    searchInfo,
    showIndexColumn: false,
  })
  //modal
  const [register1, { openModal: openAnalysisModal }] = useModal()
  const [register2, { openModal: openAnalysisDetailModal }] = useModal()
  function isReload(value) {
    value && reload()
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
  function openAnalysisDialog(record) {
    console.log(record)
  }
  onMounted(async () => {})
</script>
<style lang="less"></style>
