<template>
  <PageWrapper contentBackground contentClass="flex" dense contentFullHeight>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'isSync'">
          <Icon
            :icon="record.isSync ? 'icon-park-solid:check-one' : 'fluent-mdl2:status-error-full'"
            :color="record.isSync ? '#22c55e' : 'red'"
            size="20"
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
        <a-button preIcon="mdi:page-next-outline" type="primary"> 导入 </a-button>
        <a-button preIcon="mdi:page-next-outline" type="primary"> 下载模板</a-button>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script setup lang="ts">
  import { reactive, onMounted, ref, toRef, toRefs } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicTable, useTable, TableImg, TableAction } from '@/components/Table'
  import { useModal } from '@/components/Modal'
  import { BasicUpload } from '@/components/Upload'
  import Icon from '@/components/Icon/Icon.vue'
  import { getBatchColumns } from './batchData'
  import { PageWrapper } from '@/components/Page'
  import { getBatchLogList } from '@/api/productManage/batch'
  import { uploadMatImg } from '@/api/productManage/productPlus'
  import { usePermission } from './customUtil/usePermission'

  const { hasPermission } = usePermission()
  const searchInfo = reactive<any>({})
  const singleUpload = ref()
  const singleImgParam = ref({ id: null })
  const { createMessage } = useMessage()
  const { info, success, warning, error } = createMessage

  const [registerTable, { reload, getForm }] = useTable({
    title: '批量操作',
    titleHelpMessage: ['可对商品/物料进行批量导入'],
    api: getBatchLogList,
    columns: getBatchColumns(),
    striped: false,
    showTableSetting: true,
    tableSetting: { fullScreen: false },
    pagination: { pageSize: 10 },
    searchInfo,
    showIndexColumn: false,
  })

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
  onMounted(async () => {})
</script>
<style lang="less"></style>
