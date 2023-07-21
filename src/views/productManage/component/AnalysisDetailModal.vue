<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="'点击左侧分类后，维护对应分析细节（只能维护' + genClassLevel(depth) + '级别的分类）'"
    :maskClosable="false"
    :width="1000"
    :confirmLoading="loading"
    @cancel="onModalClose"
  >
    <Row :gutter="[16, 16]">
      <Col :span="8">
        <BasicTree
          @select="triggerTableAct"
          ref="treeRef"
          :treeData="treeData"
          :fieldNames="{ key: 'value', title: 'label' }"
          ><template #title="item"
            ><Tag :color="genColor(item.depth)">{{ genClassLevel(item.depth) }}</Tag
            >{{ item.label }}</template
          ></BasicTree
        >
      </Col>
      <Col :span="16">
        <BasicTable
          @register="registerTable"
          :canResize="false"
          :immediate="false"
          :dataSource="tableData"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'op'">
              <a-button size="small" @click="openDetailFormDialog(false, record)" color="warning">
                修改
              </a-button>
              <a-button size="small" class="ml-1" @click="deleteDetail(record.id)" color="error">
                删除
              </a-button>
            </template>
          </template>
          <template #toolbar>
            <a-button
              preIcon="mdi:new-box"
              v-show="isTrigger"
              @click="openDetailFormDialog(true, { classId: classId, analysisId: analysisId })"
              type="primary"
            >
              新建
            </a-button>
          </template>
        </BasicTable>
      </Col>
    </Row>
    <template #footer>
      <a-button type="primary" class="ml-2" @click="expandAll(false)"> 全部收缩</a-button>
      <a-button @click="onModalClose"> 取消</a-button>
    </template>
  </BasicModal>
  <AnalysisDetailFormModal @register="register1" @check="tableReload" />
</template>
<script setup lang="ts">
  import { ref, toRef, reactive, onMounted, nextTick } from 'vue'
  import { Tag, Row, Col } from 'ant-design-vue'
  import { BasicTable, useTable } from '@/components/Table'
  import { useMessage } from '@/hooks/web/useMessage'
  import { useModal, BasicModal, useModalInner } from '@/components/Modal'
  import AnalysisDetailFormModal from './AnalysisDetailFormModal.vue'
  import { BasicColumn } from '@/components/Table/src/types/table'
  import { BasicTree } from '@/components/Tree/index'
  import { getClassTree } from '@/api/productManage/productParam'
  import {
    getAnalysisDetailListByParent,
    deleteAnalysisDetail,
    addAnalysisDetail,
    updateAnalysisDetail,
  } from '@/api/productManage/productAnalysis'

  const { createMessage } = useMessage()
  const { info, success, warning, error } = createMessage

  const depth = ref()
  const analysisId = ref()
  const isAdd = ref(true)
  const isTrigger = ref(false)
  const treeData = ref([])
  const treeRef = ref()
  const classId = ref()
  const tableData = ref()
  const loading = ref(false)

  const [register1, { openModal: openAnalysisDetailFormModal }] = useModal()
  const [register, { closeModal }] = useModalInner((data) => {
    getClassTree().then((data) => {
      if (data.code == 200) {
        treeData.value = data.data
      } else {
        error(data.msg)
      }
    })
    data && onTypeReceive(data)
    tableReload()
  })
  const [registerTable, { reload, getForm }] = useTable({
    title: '分析细节维护(一个分类只能维护一条细节)',
    columns: getDetailColumns(),
    striped: false,
    pagination: { pageSize: 5 },
    showIndexColumn: false,
  })
  function getDetailColumns(): BasicColumn[] {
    return [
      { dataIndex: 'id', title: 'id', key: 'id', defaultHidden: true },
      { dataIndex: 'classId', title: '分类id', key: 'classId' },
      { dataIndex: 'name', title: '名称', key: 'name' },
      { dataIndex: 'oeder', title: '顺序', key: 'order' },
      { dataIndex: 'op', title: '操作', key: 'op' },
    ]
  }
  function genColor(v) {
    switch (v) {
      case 1:
        return '#027be3'
      case 2:
        return '#26a69a'
      case 3:
        return '#800080'
      case 4:
        return '#31ccec'
      case 5:
        return '#f2c037'
      default:
        return '#027be3'
    }
  }
  function genClassLevel(v) {
    switch (v) {
      case 1:
        return '归属'
      case 2:
        return '类别'
      case 3:
        return '大类'
      case 4:
        return '中类'
      case 5:
        return '小类'
      default:
        return '未知'
    }
  }
  function triggerTableAct(selectedKeys, { selected, selectedNodes }) {
    if (selected) {
      classId.value = selectedKeys[0]
      const depthSelected = selectedNodes[0].depth
      const isMainTain = tableData.value.some((item) => item.classId == selectedKeys[0])
      if (depthSelected != depth.value) {
        isTrigger.value = false
      } else if (isMainTain) {
        isTrigger.value = false
      } else {
        isTrigger.value = true
      }
    } else {
      isTrigger.value = false
    }
  }
  function onModalClose() {
    closeModal()
    treeRef.value.setSelectedKeys([])
    isTrigger.value = false
    tableData.value = []
    expandAll(false)
  }
  function expandAll(op: boolean) {
    treeRef.value.expandAll(op)
  }

  function tableReload() {
    getAnalysisDetailListByParent(analysisId.value).then((data) => {
      if (data.code == 200) {
        tableData.value = data.data
      } else {
        error(data.msg)
      }
    })
  }
  function openDetailFormDialog(v, record) {
    if (v) {
      const isMainTain = tableData.value.some((item) => item.classId == classId.value)
      if (isMainTain) {
        warning('该分类已维护细节，不可重复添加')
        return
      }
      isAdd.value = true
      record.isAdd = true
    } else {
      record.isAdd = false
      isAdd.value = false
    }

    openAnalysisDetailFormModal(true, record)
  }
  //delete
  function deleteDetail(id) {
    deleteAnalysisDetail(id).then((data) => {
      if (data.code == 200) {
        tableReload()
        success(data.msg)
      } else {
        error(data.msg)
      }
    })
  }
  function onTypeReceive(data) {
    depth.value = data.depth
    analysisId.value = data.id
  }
</script>
