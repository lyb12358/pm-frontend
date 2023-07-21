<template>
  <div class="md:flex">
    <Card
      size="small"
      title="商品款式数量"
      class="md:w-1/4 w-full !md:mt-0"
      :class="{ '!md:mr-4': 0 + 1 < 4, '!mt-4': 0 > 0 }"
    >
      <div class="py-4 px-4 flex justify-between items-center">
        <CountTo :startVal="1" :endVal="count1" class="text-2xl" />
        <Icon icon="icon-park:data-all" :size="40" />
      </div>
    </Card>
    <Card
      size="small"
      title="商品编号数量"
      class="md:w-1/4 w-full !md:mt-0"
      :class="{ '!md:mr-4': 1 + 1 < 4, '!mt-4': 1 > 0 }"
    >
      <div class="py-4 px-4 flex justify-between items-center">
        <CountTo :startVal="1" :endVal="count2" class="text-2xl" />
        <Icon icon="icon-park:data-all" :size="40" />
      </div>
    </Card>
    <Card
      size="small"
      title="物料辅料数量"
      class="md:w-1/4 w-full !md:mt-0"
      :class="{ '!md:mr-4': 2 + 1 < 4, '!mt-4': 2 > 0 }"
    >
      <div class="py-4 px-4 flex justify-between items-center">
        <CountTo :startVal="1" :endVal="count3" class="text-2xl" />
        <Icon icon="icon-park:data-all" :size="40" />
      </div>
    </Card>
    <Card
      size="small"
      title="编号图片数量"
      class="md:w-1/4 w-full !md:mt-0"
      :class="{ '!md:mr-4': 3 + 1 < 4, '!mt-4': 3 > 0 }"
    >
      <div class="py-4 px-4 flex justify-between items-center">
        <CountTo :startVal="1" :endVal="count4" class="text-2xl" />
        <Icon icon="icon-park:data-all" :size="40" />
      </div>
    </Card>
  </div>
</template>
<script lang="ts" setup>
  import { CountTo } from '/@/components/CountTo/index'
  import Icon from '@/components/Icon/Icon.vue'
  import { Tag, Card } from 'ant-design-vue'
  import { styleCount } from '@/api/productManage/productStyle'
  import { matCount } from '@/api/productManage/material'
  import { codeCount, imageCount } from '@/api/productManage/productCode'
  import { ref, onMounted } from 'vue'

  const count1 = ref()
  const count2 = ref()
  const count3 = ref()
  const count4 = ref()

  onMounted(() => {
    imageCount().then((data) => {
      if (data.code == 200) {
        count4.value = data.data
      } else {
        console.log(data.msg)
      }
    })
    codeCount().then((data) => {
      if (data.code == 200) {
        count2.value = data.data
      } else {
        console.log(data.msg)
      }
    })
    matCount().then((data) => {
      if (data.code == 200) {
        count3.value = data.data
      } else {
        console.log(data.msg)
      }
    })
    styleCount().then((data) => {
      if (data.code == 200) {
        count1.value = data.data
      } else {
        console.log(data.msg)
      }
    })
  })
</script>
