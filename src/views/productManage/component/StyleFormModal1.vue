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
  import { ref, nextTick } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicModal, useModalInner } from '@/components/Modal'
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index'
  import { styleModalSchemas as schemas } from '../moduleData'
  import { addProdStyle, updateProdStyle } from '@/api/productManage/productStyle'
  import {
    getProdClassTreeOnMiddleType,
    getProdParamOptions,
  } from '@/api/productManage/productParam'
  import { useUserStore } from '@/store/modules/user'
  import { usePermission } from '.././customUtil/usePermission'

  const { checkMaintainPermission } = usePermission()
  const permissionList: any = useUserStore().getPermissions
  const columnPermissions = permissionList.operations.filter(
    (item: any) => item.operationType == 'productStyle:update',
  )[0].columnPermissions

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
      span: 12,
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
    let prodClass = values.prodFamily
    values.prodFamily = prodClass[0]
    values.prodType = prodClass[1]
    values.bigType = prodClass[2]
    prodClass[3] && (values.middleType = prodClass[3])
    if (modalStatus.value) {
      updateProdStyle(values).then((data) => {
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
      if (!checkMaintainPermission(values.prodType)) {
        error('没有权限维护该类别商品')
        loading.value = false
        return
      }
      values.isDel = 0
      values.status = 1
      values.isSync = 1
      addProdStyle(values).then((data) => {
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

  function onDataReceive(data) {
    modalStatus.value = 1 //修改标题
    let prodFamily: Array<number> = []
    data.prodFamily && prodFamily.push(data.prodFamily)
    data.prodType && prodFamily.push(data.prodType)
    data.bigType && prodFamily.push(data.bigType)
    data.middleType && prodFamily.push(data.middleType)
    modelRef.value = {
      id: data.id,
      prodStyle: data.prodStyle,
      styleName: data.styleName,
      comId: data.comId,
      prodFamily: prodFamily,
      prodAttr: data.prodAttr,
      prodYear: data.prodYear,
      prodSeason: data.prodSeason,
      prodUnit: data.prodUnit,
      prodLevel: data.prodLevel,
      designer: data.designer,
      syncProtype: data.syncProtype,
      prodDesc: data.prodDesc,
    }
    //hide col when do not have permission
    columnPermissions &&
      columnPermissions.forEach((element) => {
        updateSchema([
          {
            field: element.columnName,
            show: false,
          },
        ])
      })
  }

  function handleVisibleChange(v) {
    if (v) {
      const paramOptions = getProdParamOptions()
      nextTick(async () =>
        updateSchema([
          {
            field: 'prodAttr',
            componentProps: {
              options: (await paramOptions).filter((item) => item.parentId == 606),
            },
          },
          {
            field: 'prodYear',
            componentProps: {
              options: (await paramOptions).filter((item) => item.parentId == 464),
            },
          },
          {
            field: 'prodSeason',
            componentProps: {
              options: (await paramOptions).filter((item) => item.parentId == 465),
            },
          },
          {
            field: 'prodUnit',
            componentProps: {
              options: (await paramOptions).filter((item) => item.parentId == 458),
            },
          },
          {
            field: 'prodLevel',
            componentProps: {
              options: (await paramOptions).filter((item) => item.parentId == 486),
            },
          },
          {
            field: 'designer',
            componentProps: {
              options: (await paramOptions).filter((item) => item.parentId == 567),
            },
          },
          {
            field: 'prodFamily',
            componentProps: {
              options: await getProdClassTreeOnMiddleType(),
            },
          },
        ]),
      )
    }

    //v && props.userData && nextTick(() => onDataReceive(props.userData))
  }
</script>
