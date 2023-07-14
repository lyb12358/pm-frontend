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
  import { usePermission } from '.././customUtil/usePermission'

  const { checkMaintainPermission } = usePermission()
  const { createMessage } = useMessage()
  const { info, success, warning, error } = createMessage
  const props = defineProps({
    singleClassData: { type: Object },
  })
  const emit = defineEmits(['check', 'register'])
  const modelRef = ref({})
  const loading = ref(false)
  const opType = ref()
  const schemas: FormSchema[] = [
    {
      field: 'label',
      component: 'Input',
      label: '名称',
      componentProps: {
        placeholder: '请输入名称',
      },
      rules: [{ min: 1, max: 10, required: true, message: '名称是必填项,1位到10位' }],
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
        parentId: data.parentId,
      }
    } else {
      modelRef.value = {
        value: data.value,
        depth: data.depth,
        label: data.label,
        parentId: data.parentId,
      }
    }
  }
  function handleSubmit(values) {
    console.log(opType.value)
  }
  function handleVisibleChange(v) {
    v && props.singleClassData && nextTick(() => onDataReceive(props.singleClassData))
  }
</script>
