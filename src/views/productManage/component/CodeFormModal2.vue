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
  import { usePermission } from '.././customUtil/usePermission'
  import { getProdStyleByProdStyle } from '@/api/productManage/productStyle'

  const { checkMaintainPermission } = usePermission()
  const { createMessage } = useMessage()
  const { info, success, warning, error } = createMessage

  const emit = defineEmits(['check', 'register'])
  const modelRef = ref({})
  const loading = ref(false)
  const schemas: FormSchema[] = [
    {
      field: 'prodStyle',
      component: 'Input',
      label: '款号',
      componentProps: {
        placeholder: '请输入完整准确的款号',
      },
      rules: [{ min: 6, max: 10, required: true, message: '款号是必填项,6位到10位' }],
    },
  ]
  const [registerForm, { resetFields, updateSchema, submit }] = useForm({
    labelWidth: 100,
    baseColProps: {
      span: 24,
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
    loading.value = true
    getProdStyleByProdStyle(values.prodStyle)
      .then((data) => {
        if (data.code == 200) {
          if (checkMaintainPermission(data.data.prodType)) {
            closeModal()
            onModalClose()
            emit('check', data.data)
          } else {
            error('没有权限维护该类别商品')
          }
        } else {
          error(data.msg)
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
</script>
