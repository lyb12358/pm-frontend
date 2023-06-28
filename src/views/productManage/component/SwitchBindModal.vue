<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="更换款式"
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
  import { getProdStyleByProdStyle } from '@/api/productManage/productStyle'
  import { switchBind } from '@/api/productManage/productCode'

  const { createMessage } = useMessage()

  const { info, success, warning, error } = createMessage

  const emit = defineEmits(['isReload', 'register'])
  const modelRef = ref({})
  const loading = ref(false)
  const id = ref()
  const styleId = ref()
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

  const [register, { closeModal }] = useModalInner((data) => {
    data && onDataReceive(data)
  })

  function onModalClose() {
    resetFields()
  }
  function onOk() {
    submit()
  }
  function onDataReceive(data) {
    data.styleId ? (styleId.value = data.styleId) : (styleId.value = data.id)
    data.styleId ? (id.value = data.id) : (id.value = 0)
  }
  function handleSubmit(values) {
    getProdStyleByProdStyle(values.prodStyle).then((data) => {
      if (data.code == 20000) {
        if (data.data.id == styleId.value) {
          warning('请填写一个和当前商品不同的款式')
          loading.value = false
          return
        }
        switchBind(styleId.value, data.data.id, id.value).then((data) => {
          if (data.code == 20000) {
            closeModal()
            onModalClose()
            emit('isReload', true)
          } else {
            error(data.msg)
          }
          loading.value = false
        })
      } else {
        error(data.msg)
      }
      loading.value = false
    })
  }
</script>
