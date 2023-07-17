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
  import { addProdClass, updateProdClass } from '@/api/productManage/productParam'

  const { createMessage } = useMessage()
  const { info, success, warning, error } = createMessage
  const props = defineProps({
    singleData: { type: Object },
  })
  const emit = defineEmits(['check', 'register'])
  const modelRef = ref({})
  const loading = ref(false)
  const opType = ref()
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
    data && onTypeReceive(data)
  })

  function onModalClose() {
    closeModal()
    resetFields()
  }
  function getName() {
    if (opType.value == 1) {
      return '创建同级分类'
    } else if (opType.value == 2) {
      return '创建下级分类'
    } else {
      return '修改'
    }
  }
  function onOk() {
    submit()
  }
  function onTypeReceive(value) {
    opType.value = value
  }
  function onDataReceive(data) {
    if (opType.value == 1) {
      modelRef.value = {
        depth: data.depth,
        parentId: data.parentId,
      }
    } else if (opType.value == 2) {
      modelRef.value = {
        depth: data.depth + 1,
        parentId: data.value,
      }
    } else {
      modelRef.value = {
        id: data.value,
        depth: data.depth,
        name: data.label,
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
    if (opType.value != 3) {
      addProdClass(values)
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
      updateProdClass(values)
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
    v && props.singleData && nextTick(() => onDataReceive(props.singleData))
  }
</script>
