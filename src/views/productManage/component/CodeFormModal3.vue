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
    <!-- <template #remoteSearch="{ model, field }">
      <ApiSelect
        :api="getProdStyleOptions"
        showSearch
        v-model:value="model[field]"
        valueField="subLabel"
        :params="searchParams"
        @search="onSearch"
      />
    </template> -->
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref, nextTick } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicModal, useModalInner } from '@/components/Modal'
  import { BasicForm, FormSchema, useForm, ApiSelect } from '@/components/Form/index'
  import { usePermission } from '.././customUtil/usePermission'
  import { getProdStyleOptions, getProdStyleById } from '@/api/productManage/productStyle'

  const { checkMaintainPermission } = usePermission()
  const { createMessage } = useMessage()
  const { info, success, warning, error } = createMessage

  const emit = defineEmits(['check', 'register'])
  const modelRef = ref({})
  const loading = ref(false)
  // const options = ref([])
  // const searchParams = ref({})
  const schemas: FormSchema[] = [
    {
      field: 'id',
      component: 'ApiSelect',
      label: '款名',
      componentProps: ({ schema, tableAction, formActionType, formModel }) => {
        return {
          api: getProdStyleOptions,
          showSearch: true,
          //filterOption: filterOption,
          optionFilterProp: 'label',
          getPopupContainer: () => document.body,
          placeholder: '请输入款名',
        }
      },
      rules: [{ required: true, message: '款名是必填项', type: 'number' }],
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
  const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }
  function handleSubmit(values) {
    loading.value = true
    getProdStyleById(values.id)
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
