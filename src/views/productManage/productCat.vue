<template>
  <PageWrapper contentBackground dense contentFullHeight>
    <Card title="维护商品/物料相关参数">
      <CardGrid v-for="item in navItems" :key="item.title" v-show="hasPermission(item.auth)">
        <span class="flex flex-col items-center" @click="item.fn">
          <Icon :icon="item.icon" :color="item.color" size="40" />
          <span class="text-md mt-2 truncate">{{ item.title }}</span>
        </span>
      </CardGrid>
    </Card>
    <ClassModal @register="register1" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page'
  import { Card, CardGrid } from 'ant-design-vue'
  import Icon from '@/components/Icon/Icon.vue'
  import { usePermission } from './customUtil/usePermission'
  import { useModal } from '@/components/Modal'
  import ClassModal from './component/ClassModal.vue'

  //modal
  const [register1, { openModal: openClassModal }] = useModal()

  const { hasPermission } = usePermission()
  interface NavItem {
    title: string
    icon: string
    color: string
    auth: string
    fn: any
  }
  const navItems: NavItem[] = [
    {
      title: '商品类别',
      icon: 'ion:settings-outline',
      color: '#1fdaca',
      auth: 'productCat:family',
      fn: openClassModal,
    },
    {
      title: '商品属性',
      icon: 'ion:settings-outline',
      color: '#bf0c2c',
      auth: 'productCat:attr',
      fn: openClassModal,
    },
    {
      title: '商品品类',
      icon: 'ion:settings-outline',
      color: '#e18525',
      auth: 'productCat:cat',
      fn: openClassModal,
    },
    {
      title: '商品规格',
      icon: 'ion:settings-outline',
      color: '#3fb27f',
      auth: 'productCat:spe',
      fn: openClassModal,
    },
    {
      title: '商品年份',
      icon: 'iwwa:year',
      color: '#4daf1bc9',
      auth: 'productCat:year',
      fn: openClassModal,
    },
    {
      title: '商品季节',
      icon: 'ph:calendar',
      color: '#00d8ff',
      auth: 'productCat:season',
      fn: openClassModal,
    },
    {
      title: '商品花色',
      icon: 'mdi:color',
      color: '#FF6600',
      auth: 'productCat:color',
      fn: openClassModal,
    },
    {
      title: '商品档次',
      icon: 'carbon:skill-level',
      color: '#9900FF',
      auth: 'productCat:level',
      fn: openClassModal,
    },
    {
      title: '商品设计师',
      icon: 'iconoir:people-tag',
      color: '#FF99CC',
      auth: 'productCat:designer',
      fn: openClassModal,
    },
  ]
</script>
<style lang="less"></style>
