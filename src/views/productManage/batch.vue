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
          <a-button
            v-if="!record.isSync"
            :loading="syncLoading"
            @click="syncBatch(record.id, record.batchType)"
          >
            同步</a-button
          >
        </template>
      </template>
      <template #toolbar>
        <!-- 平时隐藏上传按钮，通过其他按钮来控制显示 -->
        <div v-show="false">
          <BasicUpload
            ref="singleUpload1"
            :maxSize="5"
            :maxNumber="1"
            @change="handleChange"
            :api="addBatchProdStyle"
            :uploadParams="batchParam"
            class="my-5"
            :accept="['.xls', '.xlsx']" /><BasicUpload
            ref="singleUpload2"
            :maxSize="5"
            :maxNumber="1"
            @change="handleChange"
            :api="addBatchProdCode"
            :uploadParams="batchParam"
            class="my-5"
            :accept="['.xls', '.xlsx']" /><BasicUpload
            ref="singleUpload3"
            :maxSize="5"
            :maxNumber="1"
            @change="handleChange"
            :api="addBatchMat"
            :uploadParams="batchParam"
            class="my-5"
            :accept="['.xls', '.xlsx']"
        /></div>
        <Dropdown
          :trigger="['click']"
          :dropMenuList="[
            {
              event: '1',
              text: '导入款式',
              onClick: openUploadModal.bind(null, 1),
            },
            {
              event: '2',
              text: '导入编号',
              onClick: openUploadModal.bind(null, 2),
            },
            {
              event: '3',
              text: '导入物料',
              onClick: openUploadModal.bind(null, 3),
            },
          ]"
          ><a-button
            preIcon="mdi:page-next-outline"
            type="primary"
            v-show="hasPermission('batch:import')"
          >
            导入</a-button
          >
        </Dropdown>
        <Dropdown
          :trigger="['click']"
          :dropMenuList="[
            {
              event: '1',
              text: '款式模板',
              onClick: downloadExcelModel.bind(null, 'styleImportModel'),
            },
            {
              event: '2',
              text: '编号模板',
              onClick: downloadExcelModel.bind(null, 'codeImportModel'),
            },
            {
              event: '3',
              text: '物料模板',
              onClick: downloadExcelModel.bind(null, 'matImportModel'),
            },
          ]"
        >
          <a-button preIcon="mdi:page-next-outline" type="primary"> 下载模板</a-button></Dropdown
        >
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script setup lang="ts">
  import { reactive, onMounted, ref, toRef, toRefs } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicTable, useTable, TableImg, TableAction } from '@/components/Table'
  import { Dropdown } from '@/components/Dropdown'
  import { useModal } from '@/components/Modal'
  import { BasicUpload } from '@/components/Upload'
  import Icon from '@/components/Icon/Icon.vue'
  import { getBatchColumns } from './batchData'
  import { PageWrapper } from '@/components/Page'
  import {
    getBatchLogList,
    addBatchProdCode,
    addBatchProdStyle,
    addBatchMat,
    addMatBatchDataSync,
    addProdBatchDataSync,
  } from '@/api/productManage/batch'
  import { importModelDownload } from '@/api/productManage/productPlus'
  import { usePermission } from './customUtil/usePermission'
  import { useUtil } from './customUtil/useUtil'

  const { hasPermission } = usePermission()
  const { fileDownload } = useUtil()
  const searchInfo = reactive<any>({})
  const syncLoading = ref(false)
  const singleUpload1 = ref()
  const singleUpload2 = ref()
  const singleUpload3 = ref()
  const batchParam = ref({ id: null })
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
  function handleChange(list: string[]) {
    reload()
  }
  function openUploadModal(value) {
    switch (value) {
      case 1:
        singleUpload1.value.fileList = []
        singleUpload1.value.openUploadModal()
        break
      case 2:
        singleUpload2.value.fileList = []
        singleUpload2.value.openUploadModal()
        break
      case 3:
        singleUpload3.value.fileList = []
        singleUpload3.value.openUploadModal()
        break
      default:
        break
    }
  }
  function syncBatch(id, type) {
    syncLoading.value = true
    if (type == 3) {
      addMatBatchDataSync(id)
        .then((data) => {
          if (data.code == 200) {
            success(data.message)
            syncLoading.value = false
            reload()
          } else {
            error(data.msg)
          }
        })
        .finally(() => {
          syncLoading.value = false
        })
    } else if (type == 2) {
      addProdBatchDataSync(id)
        .then((data) => {
          if (data.code == 200) {
            success(data.message)
            syncLoading.value = false
            reload()
          } else {
            error(data.msg)
          }
        })
        .finally(() => {
          syncLoading.value = false
        })
    }
  }
  function downloadExcelModel(name) {
    importModelDownload(name).then((response) => {
      if (name == 'styleImportModel') {
        fileDownload(response, '商品款式导入模板.xls')
      }
      if (name == 'codeImportModel') {
        fileDownload(response, '商品编号导入模板.xls')
      }
      if (name == 'matImportModel') {
        fileDownload(response, '物料辅料导入模板.xls')
      }
    })
  }
  onMounted(async () => {})
</script>
<style lang="less"></style>
