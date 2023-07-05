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
    <Description
      title="款式信息"
      :collapseOptions="{ canExpand: true, helpMessage: '展示该产品编号所属款式的信息' }"
      :column="3"
      :data="styleDescData"
      :schema="styleDescSchema"
    />
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
  import { Description, DescItem, useDescription } from '@/components/Description/index'
  import { codeModalSchemas as schemas, styleDescSchema } from '../moduleData'
  import { addProdCode, updateProdCode } from '@/api/productManage/productCode'
  import {
    getProdClassOptionsByParent,
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

  const props = defineProps({
    styleData: { type: Object },
  })
  //让父组件表格刷新
  const emit = defineEmits(['isReload', 'register'])
  const modelRef = ref({})
  const modalStatus = ref(0)
  const loading = ref(false)
  const styleDescData = ref({})
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
    if (modalStatus.value) {
      updateProdCode(values, false).then((data) => {
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
      addProdCode(values, values.isThird).then((data) => {
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
  async function onStyleDataReceive(data) {
    styleDescData.value = {
      prodStyle: data.prodStyle,
      styleName: data.styleName,
      familyName: data.familyName,
      typeName: data.typeName,
      attrName: data.attrName,
      bigName: data.bigName,
      middleName: data.middleName,
      comName: data.comName,
    }
    //when add new code
    if (!modalStatus.value) {
      updateSchema([
        {
          field: 'styleId',
          defaultValue: data.id,
        },
        {
          field: 'prodName',
          defaultValue: data.styleName,
        },
      ])
    }
    updateSchema([
      {
        field: 'prodCat',
        componentProps: {
          options: (await getProdCatOptions()).filter((item) => item.classId == data.bigType),
        },
      },
      {
        field: 'prodSpe',
        componentProps: {
          options: await getProdSpeOptionsByParent(data.bigType),
        },
      },
    ])
    data.middleType &&
      updateSchema([
        {
          field: 'smallType',
          componentProps: {
            options: await getProdClassOptionsByParent(data.middleType),
          },
        },
      ])
  }
  function onDataReceive(data) {
    modalStatus.value = 1 //修改标题
    modelRef.value = {
      id: data.id,
      styleId: data.styleId,
      prodCode: data.prodCode,
      prodName: data.prodName,
      prodCat: data.prodCat,
      prodSpe: data.prodSpe,
      smallType: data.smallType,
      prodMat: data.prodMat,
      retailPrice: data.retailPrice,
      supplyPrice: data.supplyPrice,
      costPrice: data.costPrice,
      costPrice2: data.costPrice2,
      costPrice3: data.costPrice3,
      costPrice4: data.costPrice4,
      prodColor: data.prodColor,
      netWeight: data.netWeight,
      numModel: data.numModel,
      boxModel: data.boxModel,
      boxWarn: data.boxWarn,
      boxNum: data.boxNum,
      boxVolume: data.boxVolume,
      boxWeight: data.boxWeight,
      prodCycle: data.prodCycle,
      isRemind: data.isRemind,
      isSecurity: data.isSecurity,
      isRate: data.isRate,
      isQxmini: data.codeIsQxmini,
      code69: data.code69,
      grossWeight: data.grossWeight,
      singleWeight: data.singleWeight,
      pakMat: data.pakMat,
      pakSize: data.pakSize,
      remark: data.remark,
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
            field: 'prodCode',
            componentProps: {
              disabled: Boolean(modalStatus.value),
            },
          },
          {
            field: 'isThird',
            show: Boolean(!modalStatus.value),
          },
          {
            field: 'prodColor',
            componentProps: {
              options: (await paramOptions).filter((item) => item.parentId == 466),
            },
          },
        ]),
      )
    }

    v && props.styleData && nextTick(() => onStyleDataReceive(props.styleData))
  }
</script>
