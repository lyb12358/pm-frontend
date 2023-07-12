<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="商品五级类别维护"
    :maskClosable="false"
    :confirmLoading="loading"
    @cancel="onModalClose"
    @ok="onOk"
  >
    <div class="pt-3px pr-3px">
      <BasicTree :treeData="treeData" :replace-fields="{ key: 'value', title: 'label' }"
    /></div>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref, reactive, onMounted, nextTick } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicModal, useModalInner } from '@/components/Modal'
  import { BasicTree, TreeActionItem, ContextMenuItem } from '@/components/Tree/index'
  import { getProdClassTree, addProdClass, updateProdClass } from '@/api/productManage/productParam'

  const { createMessage } = useMessage()
  const { info, success, warning, error } = createMessage

  const treeData = reactive<any>([])
  const loading = ref(false)

  const [register, { closeModal }] = useModalInner()

  function onModalClose() {}
  function onOk() {}
  onMounted(async () => {
    getProdClassTree().then((data) => {
      if (data.code == 200) {
        treeData.value = data.data
      } else {
        error(data.msg)
      }
    })
  })
</script>
