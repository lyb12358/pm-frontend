<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="getName()"
    :maskClosable="false"
    :confirmLoading="loading"
    @visible-change="handleVisibleChange"
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
  import {
    addProdCat,
    updateProdCat,
    addProdSpe,
    updateProdSpe,
  } from '@/api/productManage/productParam'

  const { createMessage } = useMessage()
  const { info, success, warning, error } = createMessage
  const props = defineProps({
    isCat: { type: Boolean },
    isAdd: { type: Boolean },
  })
  const emit = defineEmits(['check', 'register'])
  const modelRef = ref({})
  const loading = ref(false)
  const isCat = ref(true)
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
      field: 'classId',
      component: 'InputNumber',
      label: 'classId',
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
    isAdd.value = true
    closeModal()
    resetFields()
  }
  function getName() {
    if (isCat.value && isAdd.value) {
      return '新建品类'
    } else if (isCat.value) {
      return '修改品类'
    } else if (isAdd.value) {
      return '新建规格'
    } else {
      return '修改规格'
    }
  }
  function onOk() {
    submit()
  }
  function onTypeReceive(value1, value2) {
    isCat.value = value1
    isAdd.value = value2
  }
  function onDataReceive(data) {
    if (data.isAdd) {
      modelRef.value = {
        classId: data.classId,
      }
    } else {
      modelRef.value = {
        id: data.id,
        name: data.name,
        classId: data.classId,
      }
    }
  }
  function handleSubmit(values) {
    loading.value = true
    values.isSync = 1
    values.status = 1
    values.isDel = 0
    values.orderId = 0
    if (isCat.value && isAdd.value) {
      addProdCat(values)
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
    } else if (isCat.value) {
      updateProdCat(values)
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
    } else if (isAdd.value) {
      addProdSpe(values)
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
      updateProdSpe(values)
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
  function handleVisibleChange(v) {
    v && nextTick(() => onTypeReceive(props.isCat, props.isAdd))
  }
</script>
