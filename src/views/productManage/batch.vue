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
            title="批量款式修改(款号必填)"
            ref="singleUpload4"
            :maxSize="5"
            :maxNumber="1"
            @change="handleChange"
            :api="modifyBatchProdStyle"
            :uploadParams="batchModifyParam"
            class="my-5"
            :accept="['.xls', '.xlsx']" /><BasicUpload
            title="批量编号修改(编号必填)"
            ref="singleUpload5"
            :maxSize="5"
            :maxNumber="1"
            @change="handleChange"
            :api="modifyBatchProdCode"
            :uploadParams="batchModifyParam"
            class="my-5"
            :accept="['.xls', '.xlsx']" /><BasicUpload
            title="批量物料修改(编号及模板编号必填)"
            ref="singleUpload6"
            :maxSize="5"
            :maxNumber="1"
            @change="handleChange"
            :api="modifyBatchMat"
            :uploadParams="batchModifyParam"
            class="my-5"
            :accept="['.xls', '.xlsx']"
        /></div>
        <div v-show="false">
          <BasicUpload
            title="批量添加"
            ref="singleUpload1"
            :maxSize="5"
            :maxNumber="1"
            @change="handleChange"
            :api="addBatchProdStyle"
            :uploadParams="batchParam"
            class="my-5"
            :accept="['.xls', '.xlsx']" /><BasicUpload
            title="批量添加"
            ref="singleUpload2"
            :maxSize="5"
            :maxNumber="1"
            @change="handleChange"
            :api="addBatchProdCode"
            :uploadParams="batchParam"
            class="my-5"
            :accept="['.xls', '.xlsx']" /><BasicUpload
            title="批量添加"
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
              event: '4',
              text: '修改款式',
              onClick: openUploadModal.bind(null, 4),
            },
            {
              event: '5',
              text: '修改编号',
              onClick: openUploadModal.bind(null, 5),
            },
            {
              event: '6',
              text: '修改物料',
              onClick: openUploadModal.bind(null, 6),
            },
          ]"
          ><a-button
            preIcon="mdi:page-next-outline"
            type="primary"
            v-show="hasPermission('batch:import')"
          >
            批量修改</a-button
          >
        </Dropdown>
        <Dropdown
          :trigger="['click']"
          :dropMenuList="[
            {
              event: '1',
              text: '添加款式',
              onClick: openUploadModal.bind(null, 1),
            },
            {
              event: '2',
              text: '添加编号',
              onClick: openUploadModal.bind(null, 2),
            },
            {
              event: '3',
              text: '添加物料',
              onClick: openUploadModal.bind(null, 3),
            },
          ]"
          ><a-button
            preIcon="mdi:page-next-outline"
            type="primary"
            v-show="hasPermission('batch:import')"
          >
            批量添加</a-button
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
            // {
            //   event: '4',
            //   text: '款式修改模板',
            //   onClick: downloadExcelModel.bind(null, 'styleImportModel'),
            // },
            // {
            //   event: '5',
            //   text: '编号修改模板',
            //   onClick: downloadExcelModel.bind(null, 'codeImportModel'),
            // },
            // {
            //   event: '6',
            //   text: '物料修改模板',
            //   onClick: downloadExcelModel.bind(null, 'matIModifyModel'),
            // },
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
    matBatchDataSync,
    prodBatchDataSync,
    modifyBatchProdCode,
    modifyBatchProdStyle,
    modifyBatchMat,
  } from '@/api/productManage/batch'
  import { importModelDownload } from '@/api/productManage/productPlus'
  import { usePermission } from './customUtil/usePermission'
  import { useUtil } from './customUtil/useUtil'
  import { useUserStore } from '@/store/modules/user'

  const permissionList: any = useUserStore().getPermissions

  const styleColumnPermissions = permissionList.operations.filter(
    (item: any) => item.operationType == 'productStyle:update',
  )[0]?.columnPermissions

  const codeColumnPermissions = permissionList.operations.filter(
    (item: any) => item.operationType == 'productCode:update',
  )[0]?.columnPermissions

  const matColumnPermissions = permissionList.operations.filter(
    (item: any) => item.operationType == 'material:update',
  )[0]?.columnPermissions

  const { hasPermission } = usePermission()
  const { fileDownload } = useUtil()
  const searchInfo = reactive<any>({})
  const syncLoading = ref(false)
  const singleUpload1 = ref()
  const singleUpload2 = ref()
  const singleUpload3 = ref()
  const singleUpload4 = ref()
  const singleUpload5 = ref()
  const singleUpload6 = ref()
  const batchParam = ref({ id: null })
  const batchModifyParam = ref({})
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
      case 4:
        batchModifyParam.value = {
          columnPermissions: styleColumnPermissions ? tranToString(styleColumnPermissions) : null,
        }
        singleUpload4.value.fileList = []
        singleUpload4.value.openUploadModal()
        break
      case 5:
        batchModifyParam.value = {
          columnPermissions: codeColumnPermissions ? tranToString(codeColumnPermissions) : null,
        }
        singleUpload5.value.fileList = []
        singleUpload5.value.openUploadModal()
        break
      case 6:
        batchModifyParam.value = {
          columnPermissions: matColumnPermissions ? tranToString(matColumnPermissions) : null,
        }
        singleUpload6.value.fileList = []
        singleUpload6.value.openUploadModal()
        break
      default:
        break
    }
  }
  function syncBatch(id, type) {
    syncLoading.value = true
    if (type == 3 || type == 6) {
      matBatchDataSync(id)
        .then((data) => {
          if (data.code == 200) {
            success(data.msg)
            reload()
          } else {
            error(data.msg)
          }
        })
        .finally(() => {
          syncLoading.value = false
        })
    } else if (type == 2 || type == 4 || type == 5) {
      prodBatchDataSync(id)
        .then((data) => {
          if (data.code == 200) {
            success(data.msg)
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
  function tranToString(x) {
    let e: any = []
    x.forEach((element) => e.push(element.columnName))
    return e.join()
  }
  onMounted(async () => {})
</script>
<style lang="less"></style>
