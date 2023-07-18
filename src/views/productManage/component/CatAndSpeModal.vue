<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="点击大类后，进行维护"
    :maskClosable="false"
    :width="900"
    @visible-change="handleVisibleChange"
    :confirmLoading="loading"
    @cancel="onModalClose"
  >
    <Row :gutter="[16, 16]">
      <Col :span="12">
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
      <Col :span="12">
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
                @click="openCSDialog(false, record)"
                color="warning"
              >
                修改
              </a-button>
            </template>
          </template>
          <template #toolbar>
            <a-button
              preIcon="mdi:new-box"
              v-show="isTrigger"
              @click="openCSDialog(true, { classId: classId })"
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
  <CatAndSpeFormModal @register="register1" @check="tableReload" :isCat="isCat" :isAdd="isAdd" />
</template>
<script setup lang="ts">
  import { ref, toRef, reactive, onMounted, nextTick } from 'vue'
  import { Tag, Row, Col } from 'ant-design-vue'
  import { BasicTable, useTable, TableImg, TableAction } from '@/components/Table'
  import { useMessage } from '@/hooks/web/useMessage'
  import { useModal, BasicModal, useModalInner } from '@/components/Modal'
  import CatAndSpeFormModal from './CatAndSpeFormModal.vue'
  import { BasicColumn } from '@/components/Table/src/types/table'
  import {
    BasicTree,
    TreeActionType,
    TreeActionItem,
    ContextMenuItem,
  } from '@/components/Tree/index'
  import {
    getProdClassTreeOnBigType,
    getProdCatListByParent,
    getProdSpeListByParent,
  } from '@/api/productManage/productParam'
  import { getSyntheticLeadingComments } from 'typescript'

  const { createMessage } = useMessage()
  const { info, success, warning, error } = createMessage

  const isCat = ref(false)
  const isAdd = ref(true)
  const isTrigger = ref(false)
  const treeData = ref([])
  const treeRef = ref()
  const classId = ref()
  const tableTitle = ref()
  const tableData = ref()
  const loading = ref(false)

  const [register1, { openModal: openCSFormModal }] = useModal()
  const [register, { closeModal }] = useModalInner((data) => {
    data && onTypeReceive(data)
    genTitle()
  })
  const [registerTable, { reload, getForm }] = useTable({
    title: tableTitle,
    titleHelpMessage: ['点击左侧大类后展现所属的品类/规格信息'],
    columns: getCatSpeColumns(),
    striped: false,
    pagination: { pageSize: 5 },
    showIndexColumn: false,
  })
  function getCatSpeColumns(): BasicColumn[] {
    return [
      { dataIndex: 'id', title: 'id', key: 'id', defaultHidden: true },
      { dataIndex: 'classId', title: 'classId', key: 'classId', defaultHidden: true },
      { dataIndex: 'name', title: '分析名称', key: 'name' },
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
  function genTitle() {
    if (isCat.value) {
      tableTitle.value = '品类管理'
    } else {
      tableTitle.value = '规格管理'
    }
  }
  function triggerTableAct(selectedKeys, { selected, selectedNodes }) {
    if (selected) {
      const depth = selectedNodes[0].depth
      if (depth != 3) {
        return
      } else {
        isTrigger.value = true
        classId.value = selectedKeys[0]
        tableReload()
      }
    } else {
      isTrigger.value = false
      tableData.value = []
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
    if (isCat.value) {
      getProdCatListByParent(classId.value).then((data) => {
        if (data.code == 200) {
          tableData.value = data.data
        } else {
          error(data.msg)
        }
      })
    } else {
      getProdSpeListByParent(classId.value).then((data) => {
        if (data.code == 200) {
          tableData.value = data.data
        } else {
          error(data.msg)
        }
      })
    }
  }
  function openCSDialog(v, record) {
    if (v) {
      isAdd.value = true
      record.isAdd = true
    } else {
      record.isAdd = false
      isAdd.value = false
    }

    openCSFormModal(true, record)
  }
  function onTypeReceive(data) {
    if (data == 1) {
      isCat.value = true
    } else {
      isCat.value = false
    }
  }
  function handleVisibleChange(v) {
    v &&
      getProdClassTreeOnBigType().then((data) => {
        if (data.code == 200) {
          treeData.value = data.data
        } else {
          error(data.msg)
        }
      })
  }
</script>
