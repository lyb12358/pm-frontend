<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="getName()"
    :maskClosable="false"
    @visible-change="handleVisibleChange"
    :width="700"
    :confirmLoading="loading"
    @cancel="onModalClose"
    @ok="onOk"
  >
    <div class="pt-3px pr-3px">
      <BasicForm @register="registerForm" :model="modelRef" @submit="handleSubmit" />
    </div>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref, nextTick, watch } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicModal, useModalInner } from '@/components/Modal'
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index'
  import { analysisModalSchemas as schemas } from '../productAnalysisData'
  import { addAnalysis, updateAnalysis } from '@/api/productManage/productAnalysis'

  import { useUserStore } from '@/store/modules/user'

  const { createMessage } = useMessage()

  const { info, success, warning, error } = createMessage

  // const props = defineProps({
  //   userData: { type: Object },
  // })
  //让父组件表格刷新
  const emit = defineEmits(['isReload', 'register'])
  const modelRef = ref({})
  const modalStatus = ref(0)
  const loading = ref(false)
  const [registerForm, { resetFields, updateSchema, submit }] = useForm({
    labelWidth: 100,
    baseColProps: {
      span: 24,
    },
    schemas,
    showActionButtonGroup: false,
  })

  const [register, { closeModal }] = useModalInner((data) => {
    data && onDataReceive(data)
  })
  function getName() {
    if (modalStatus.value) {
      return '修改'
    } else {
      return '新建'
    }
  }
  function onModalClose() {
    modalStatus.value = 0 //恢复标题
    resetFields()
  }
  function onOk() {
    submit()
  }
  function handleSubmit(values) {
    loading.value = true
    if (modalStatus.value) {
      updateAnalysis(values).then((data) => {
        if (data.code == 200) {
          success(data.msg)
          closeModal()
          onModalClose()
          emit('isReload', true)
        } else {
          error(data.msg)
        }
        loading.value = false
      })
    } else {
      values.isDel = 0
      values.userId = useUserStore().getUserInfo.sysUser.id
      values.userName = useUserStore().getUserInfo.sysUser.realName
      addAnalysis(values).then((data) => {
        if (data.code == 200) {
          success(data.msg)
          closeModal()
          onModalClose()
          emit('isReload', true)
        } else {
          error(data.msg)
        }
        loading.value = false
      })
    }
  }

  async function onDataReceive(data) {
    modalStatus.value = 1 //修改标题
    modelRef.value = {
      id: data.id,
      name: data.name,
      depth: data.depth,
      remark: data.remark,
    }
  }

  function handleVisibleChange(v) {
    //v && props.userData && nextTick(() => onDataReceive(props.userData))
  }
</script>
