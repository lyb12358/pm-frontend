<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="getName()"
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
  import { addProdParam, updateProdParam } from '@/api/productManage/productParam'

  const { createMessage } = useMessage()
  const { info, success, warning, error } = createMessage
  const emit = defineEmits(['check', 'register'])
  const modelRef = ref({})
  const loading = ref(false)
  const isAdd = ref(true)
  const schemas: FormSchema[] = [
    {
      field: 'name',
      component: 'Input',
      label: '名称',
      componentProps: {
        placeholder: '请输入名称',
      },
      rules: [{ min: 1, max: 10, required: true, message: '名称是必填项,1位到10位' }],
    },
    {
      field: 'id',
      component: 'InputNumber',
      label: 'id',
      show: false,
    },
    {
      field: 'parentId',
      component: 'InputNumber',
      label: 'parentId',
      defaultValue: 0,
      show: false,
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
    closeModal()
    resetFields()
  }
  function getName() {
    if (isAdd.value) {
      return '新建'
    } else {
      return '修改'
    }
  }
  function onOk() {
    submit()
  }
  function onDataReceive(data) {
    if (data.isAdd) {
      isAdd.value = true
      modelRef.value = {
        parentId: data.parentId,
      }
    } else {
      isAdd.value = false
      modelRef.value = {
        id: data.id,
        name: data.name,
        parentId: data.parentId,
      }
    }
  }
  function handleSubmit(values) {
    loading.value = true
    values.isSync = 1
    values.status = 1
    values.isDel = 0
    values.orderId = 0
    if (isAdd.value) {
      addProdParam(values)
        .then((data) => {
          if (data.code == 200) {
            onModalClose()
            emit('check', true)
            success(data.msg)
          } else {
            error(data.msg)
          }
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      updateProdParam(values)
        .then((data) => {
          if (data.code == 200) {
            onModalClose()
            emit('check', true)
            success(data.msg)
          } else {
            error(data.msg)
          }
        })
        .finally(() => {
          loading.value = false
        })
    }
  }
</script>
