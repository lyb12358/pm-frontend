<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="商品五级分类维护"
    :maskClosable="false"
    @visible-change="handleVisibleChange"
    :confirmLoading="loading"
    @cancel="onModalClose"
    @ok="onOk"
  >
    <Row :gutter="[16, 16]">
      <Col :span="8">
        <BasicTree
          @select="opShow"
          ref="treeRef"
          :treeData="treeData"
          :fieldNames="{ key: 'value', title: 'label' }"
          ><template #title="item"
            ><Tag :color="genColor(item.depth)">{{ genClassLevel(item.depth) }}</Tag
            >{{ item.label }}</template
          ></BasicTree
        >
      </Col>
      <Col :span="8">
        <!-- <BasicTable @register="registerTable">

      <template #toolbar>
        <a-button preIcon="mdi:new-box" type="primary"> 新建 </a-button>
      </template>
    </BasicTable> -->
      </Col>
    </Row>
    <template #footer>
      <a-button type="primary" class="ml-2" @click="expandAll(false)"> 全部收缩</a-button>
      <a-button @click="onModalClose"> 取消</a-button>
    </template>
  </BasicModal>
  <ClassFormModal @register="register1" @check="treeReload" :singleClassData="singleClassData" />
</template>
<script setup lang="ts">
  import { ref, toRef, reactive, onMounted, nextTick } from 'vue'
  import { Tag, Row, Col } from 'ant-design-vue'
  import { BasicTable, useTable, TableImg, TableAction } from '@/components/Table'
  import { useMessage } from '@/hooks/web/useMessage'
  import { useModal, BasicModal, useModalInner } from '@/components/Modal'
  import ClassFormModal from './ClassFormModal.vue'
  import {
    BasicTree,
    TreeActionType,
    TreeActionItem,
    ContextMenuItem,
  } from '@/components/Tree/index'
  import { getProdClassTreeOnBigType } from '@/api/productManage/productParam'

  const { createMessage } = useMessage()
  const { info, success, warning, error } = createMessage

  const treeData = ref([])
  const treeRef = ref()
  const className = ref()
  const treeStatus = ref(false)
  const singleClassData = ref({})
  const loading = ref(false)

  const [register1, { openModal: openClassFormModal }] = useModal()
  const [register, { closeModal }] = useModalInner()
  // const [registerTable, { reload, getForm }] = useTable({
  //   title: '分析管理',
  //   titleHelpMessage: ['可对商品五层级别额外设置对应分析维度'],
  //   api: getAnalysisList,
  //   columns: getAnalysisColumns(),
  //   striped: false,
  //   pagination: { pageSize: 5 },
  //   showIndexColumn: false,
  // })
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
  function opShow() {
    const key = treeRef.value.getSelectedKeys()
  }
  function onModalClose() {
    closeModal()
    expandAll(false)
  }
  function expandAll(op: boolean) {
    treeRef.value.expandAll(op)
  }

  function treeReload() {
    getProdClassTreeOnBigType().then((data) => {
      if (data.code == 200) {
        treeData.value = data.data
      } else {
        error(data.msg)
      }
    })
  }
  function onOk() {}
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
