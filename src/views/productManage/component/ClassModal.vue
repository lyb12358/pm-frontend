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
    <template #footer>
      <Dropdown
        :trigger="['click']"
        :dropMenuList="[
          {
            event: '1',
            text: '添加' + className + '同级',
            icon: 'mdi:plus-box',
            onClick: openClassDialog.bind(null, 1),
          },
          {
            event: '2',
            text: '添加' + className + '下级',
            icon: 'mdi:library-plus',
            onClick: openClassDialog.bind(null, 2),
          },
          {
            event: '3',
            text: '修改' + className,
            icon: 'mdi:format-list-numbers',
            onClick: openClassDialog.bind(null, 3),
          },
          {
            event: '3',
            text: '删除' + className,
            icon: 'mdi:delete',
            onClick: deleteClass.bind(null),
          },
        ]"
        ><a-button type="primary" v-if="treeStatus" postIcon="mdi:arrow-down"> 操作</a-button>
      </Dropdown>
      <!-- <a-button type="primary" class="ml-2" @click="expandAll(true)"> 全部展开</a-button> -->
      <a-button type="primary" class="ml-2" @click="expandAll(false)"> 全部收缩</a-button>
      <a-button @click="onModalClose"> 取消</a-button>
    </template>
  </BasicModal>
  <ClassFormModal @register="register1" @check="treeReload" :singleClassData="singleClassData" />
</template>
<script setup lang="ts">
  import { ref, toRef, reactive, onMounted, nextTick } from 'vue'
  import { Avatar, Badge, Tag } from 'ant-design-vue'
  import { Dropdown } from '@/components/Dropdown'
  import { useMessage } from '@/hooks/web/useMessage'
  import { useModal, BasicModal, useModalInner } from '@/components/Modal'
  import ClassFormModal from './ClassFormModal.vue'
  import {
    BasicTree,
    TreeActionType,
    TreeActionItem,
    ContextMenuItem,
  } from '@/components/Tree/index'
  import { getClassTree, deleteProdClass } from '@/api/productManage/productParam'

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
    treeStatus.value = Boolean(key[0])
    if (treeStatus.value) {
      className.value = treeRef.value.getSelectedNode(key[0]).label
    }
  }
  function onModalClose() {
    closeModal()
    expandAll(false)
  }
  function expandAll(op: boolean) {
    treeRef.value.expandAll(op)
  }

  function openClassDialog(action) {
    const key = treeRef.value.getSelectedKeys()
    singleClassData.value = treeRef.value.getSelectedNode(key[0])
    if (action == 1) {
      //add bro
      openClassFormModal(true, 1)
    } else if (action == 2) {
      //add child
      openClassFormModal(true, 2)
    } else {
      //update
      openClassFormModal(true, 3)
    }
  }
  function treeReload() {
    getClassTree().then((data) => {
      if (data.code == 200) {
        treeData.value = data.data
      } else {
        error(data.msg)
      }
    })
  }
  function onOk() {}
  function deleteClass() {
    const key = treeRef.value.getSelectedKeys()
    const id = treeRef.value.getSelectedNode(key[0]).value
    loading.value = true
    deleteProdClass(id)
      .then((data) => {
        if (data.code == 200) {
          treeReload()
          success(data.msg)
        } else {
          error(data.msg)
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
  function handleVisibleChange(v) {
    v &&
      getClassTree().then((data) => {
        if (data.code == 200) {
          treeData.value = data.data
        } else {
          error(data.msg)
        }
      })
  }
</script>
