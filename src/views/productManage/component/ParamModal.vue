<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="参数管理"
    :maskClosable="false"
    :confirmLoading="loading"
    @cancel="onModalClose"
  >
    <BasicTable
      @register="registerTable"
      :canResize="false"
      :immediate="false"
      :dataSource="tableData"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'op'">
          <a-button
            preIcon="icon-park-outline:modify"
            @click="openParamDialog(false, record)"
            color="warning"
          >
            修改
          </a-button>
        </template>
      </template>
      <template #toolbar>
        <a-button
          preIcon="mdi:new-box"
          @click="openParamDialog(true, { parentId: paramBase })"
          type="primary"
        >
          新建
        </a-button>
      </template>
    </BasicTable>
    <template #footer>
      <a-button @click="onModalClose"> 取消</a-button>
    </template>
  </BasicModal>
  <ParamFormModal @register="register1" @check="tableReload" />
</template>
<script setup lang="ts">
  import { ref, toRef, reactive, onMounted, nextTick } from 'vue'
  import { BasicTable, useTable, TableImg, TableAction } from '@/components/Table'
  import { useMessage } from '@/hooks/web/useMessage'
  import { useModal, BasicModal, useModalInner } from '@/components/Modal'
  import ParamFormModal from './ParamFormModal.vue'
  import { BasicColumn } from '@/components/Table/src/types/table'
  import { getProdParamListByParent } from '@/api/productManage/productParam'

  const { createMessage } = useMessage()
  const { info, success, warning, error } = createMessage

  const tableTitle = ref()
  const tableData = ref()
  const paramBase = ref()
  const loading = ref(false)

  const [register1, { openModal: openParamFormModal }] = useModal()
  const [register, { closeModal }] = useModalInner((data) => {
    data && onTypeReceive(data)
    genTitle()
  })
  const [registerTable, { reload, getForm }] = useTable({
    title: tableTitle,
    columns: getCatSpeColumns(),
    striped: false,
    pagination: { pageSize: 5 },
    showIndexColumn: false,
  })
  function getCatSpeColumns(): BasicColumn[] {
    return [
      { dataIndex: 'id', title: 'id', key: 'id', defaultHidden: true },
      { dataIndex: 'parentId', title: 'parentId', key: 'parentId', defaultHidden: true },
      { dataIndex: 'name', title: '名称', key: 'name' },
      { dataIndex: 'op', title: '操作', key: 'op' },
    ]
  }
  function genTitle() {
    if (paramBase.value == 606) {
      tableTitle.value = '商品属性'
    } else if (paramBase.value == 464) {
      tableTitle.value = '商品年份'
    } else if (paramBase.value == 465) {
      tableTitle.value = '商品季节'
    } else if (paramBase.value == 466) {
      tableTitle.value = '商品花色'
    } else if (paramBase.value == 486) {
      tableTitle.value = '商品档次'
    } else if (paramBase.value == 567) {
      tableTitle.value = '商品设计师'
    } else {
      tableTitle.value = '未知'
    }
  }
  function onModalClose() {
    closeModal()
    tableData.value = []
  }
  function tableReload() {
    getProdParamListByParent(paramBase.value).then((data) => {
      if (data.code == 200) {
        tableData.value = data.data
      } else {
        error(data.msg)
      }
    })
  }

  function openParamDialog(v, record) {
    if (v) {
      record.isAdd = true
    } else {
      record.isAdd = false
    }

    openParamFormModal(true, record)
  }
  function onTypeReceive(data) {
    paramBase.value = data
    tableReload()
  }
</script>
