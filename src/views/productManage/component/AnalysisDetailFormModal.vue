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
  import { addAnalysisDetail, updateAnalysisDetail } from '@/api/productManage/productAnalysis'

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
      field: 'classId',
      component: 'InputNumber',
      label: 'classId',
      defaultValue: 0,
      show: false,
    },
    {
      field: 'analysisId',
      component: 'InputNumber',
      label: 'analysisId',
      defaultValue: 0,
      show: false,
    },
    {
      field: 'order',
      component: 'InputNumber',
      label: 'order',
    },
    {
      field: 'remark',
      component: 'InputTextArea',
      label: '备注',
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
    isAdd.value = data.isAdd
    if (data.isAdd) {
      modelRef.value = {
        classId: data.classId,
        analysisId: data.analysisId,
      }
    } else {
      modelRef.value = {
        id: data.id,
        name: data.name,
        remark: data.remark,
        order: data.order,
        classId: data.classId,
        analysisId: data.analysisId,
      }
    }
  }
  function handleSubmit(values) {
    loading.value = true
    if (isAdd.value) {
      values.isDel = 0
      addAnalysisDetail(values)
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
      updateAnalysisDetail(values)
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
