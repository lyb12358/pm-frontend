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
  import { ref, nextTick, watch } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicModal, useModalInner } from '@/components/Modal'
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index'
  import { matModalSchemas as schemas } from '../moduleData'
  import { addMat, updateMat } from '@/api/productManage/material'
  import {
    getMatClassTree,
    getProdParamOptions,
    getProdCatOptions,
    getProdSpeOptionsByParent,
  } from '@/api/productManage/productParam'
  import { useUserStore } from '@/store/modules/user'

  const permissionList: any = useUserStore().getPermissions
  const columnPermissions = permissionList.operations.filter(
    (item: any) => item.operationType == 'productCode:update',
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
    values.matFamily = values.prodClass[0]
    values.matType = values.prodClass[1]
    values.bigType = values.prodClass[2]
    values.prodClass[3] && (values.middleType = values.prodClass[3])
    values.prodClass[4] && (values.smallType = values.prodClass[4])
    if (modalStatus.value) {
      updateMat(values).then((data) => {
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
      //FIXME 维护类别权限控制
      values.isDel = 0
      values.status = 1
      values.isSync = 1
      addMat(values).then((data) => {
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

  async function onDataReceive(data) {
    modalStatus.value = 1 //修改标题
    let prodClass: Array<number> = []
    data.matFamily && prodClass.push(data.matFamily)
    data.matType && prodClass.push(data.matType)
    data.bigType && prodClass.push(data.bigType)
    data.middleType && prodClass.push(data.middleType)
    data.smallType && prodClass.push(data.smallType)
    //初次修改时触发cat、spe回调
    if (prodClass.length > 2) {
      updateSchema([
        {
          field: 'matCat',
          componentProps: {
            options: (await getProdCatOptions()).filter((item) => item.classId == prodClass[2]),
          },
        },
        {
          field: 'matSpe',
          componentProps: {
            options: await getProdSpeOptionsByParent(prodClass[2]),
          },
        },
      ])
    }
    modelRef.value = {
      id: data.id,
      matCode: data.matCode,
      matName: data.matName,
      comId: data.comId,
      prodClass: prodClass,
      matCat: data.matCat,
      matSpe: data.matSpe,
      matAttr: data.matAttr,
      retailPrice: data.retailPrice,
      supplyPrice: data.supplyPrice,
      costPrice: data.costPrice,
      matYear: data.matYear,
      matUnit: data.matUnit,
      matColor: data.matColor,
      numModel: data.numModel,
      boxWarn: data.boxWarn,
      boxNum: data.boxNum,
      boxVolume: data.boxVolume,
      boxWeight: data.boxWeight,
      collectTime: data.collectTime,
      vipPrice: data.vipPrice,
      point: data.point,
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
          //code 修改时只读
          {
            field: 'matCode',
            componentProps: {
              disabled: Boolean(modalStatus.value),
            },
          },
          {
            field: 'matAttr',
            componentProps: {
              options: (await paramOptions).filter((item) => item.parentId == 606),
            },
          },
          {
            field: 'matYear',
            componentProps: {
              options: (await paramOptions).filter((item) => item.parentId == 464),
            },
          },
          {
            field: 'matUnit',
            componentProps: {
              options: (await paramOptions).filter((item) => item.parentId == 458),
            },
          },
          {
            field: 'matColor',
            componentProps: {
              options: (await paramOptions).filter((item) => item.parentId == 466),
            },
          },
          {
            field: 'prodClass',
            componentProps: {
              options: await getMatClassTree(),
              onChange: async (e) => {
                console.log(e)
                if (e.length == 3) {
                  updateSchema([
                    {
                      field: 'matCat',
                      componentProps: {
                        options: (await getProdCatOptions()).filter((item) => item.classId == e[2]),
                      },
                    },
                    {
                      field: 'matSpe',
                      componentProps: {
                        options: await getProdSpeOptionsByParent(e[2]),
                      },
                    },
                  ])
                }
              },
            },
          },
        ]),
      )
    }

    //v && props.userData && nextTick(() => onDataReceive(props.userData))
  }
</script>
