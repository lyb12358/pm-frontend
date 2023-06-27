<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="新建"
    :maskClosable="false"
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
  import { ref, nextTick } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicModal, useModalInner } from '@/components/Modal'
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index'
  import { addProdStyle, updateProdStyle } from '@/api/productManage/productStyle'

  const { createMessage } = useMessage()

  const { info, success, warning, error } = createMessage

  const emit = defineEmits(['isReload', 'register'])
  const modelRef = ref({})
  const loading = ref(false)
  const schemas: FormSchema[] = [
    {
      field: 'prodStyle',
      component: 'Input',
      label: '款号',
      colProps: {
        span: 24,
      },
    },
  ]
  const [registerForm, { resetFields, updateSchema, submit }] = useForm({
    labelWidth: 100,
    baseColProps: {
      span: 12,
    },
    schemas,
    showActionButtonGroup: false,
  })

  const [register, { closeModal }] = useModalInner()

  function onModalClose() {
    resetFields()
  }
  function onOk() {
    submit()
  }
  function handleSubmit(values) {
    console.log(values)
    closeModal()
    onModalClose()
    //emit('isReload', true)
  }
</script>
