<template>
  <Card title="维护商品/物料相关参数">
    <CardGrid v-for="item in navItems" :key="item.title" v-show="hasPermission(item.auth)">
      <span class="flex flex-col items-center">
        <Icon :icon="item.icon" :color="item.color" size="40" />
        <span class="text-md mt-2 truncate">{{ item.title }}</span>
      </span>
    </CardGrid>
  </Card>
</template>
<script lang="ts" setup>
  import { Card, CardGrid } from 'ant-design-vue'
  import Icon from '@/components/Icon/Icon.vue'
  import { usePermission } from './customUtil/usePermission'

  const { hasPermission } = usePermission()
  interface NavItem {
    title: string
    icon: string
    color: string
    auth: string
  }
  const navItems: NavItem[] = [
    {
      title: '商品类别',
      icon: 'ion:settings-outline',
      color: '#1fdaca',
      auth: 'productCat:family',
    },
    {
      title: '商品属性',
      icon: 'ion:settings-outline',
      color: '#bf0c2c',
      auth: 'productCat:attr',
    },
    {
      title: '商品品类',
      icon: 'ion:settings-outline',
      color: '#e18525',
      auth: 'productCat:cat',
    },
    {
      title: '商品规格',
      icon: 'ion:settings-outline',
      color: '#3fb27f',
      auth: 'productCat:spe',
    },
    {
      title: '商品年份',
      icon: 'iwwa:year',
      color: '#4daf1bc9',
      auth: 'productCat:year',
    },
    {
      title: '商品季节',
      icon: 'ph:calendar',
      color: '#00d8ff',
      auth: 'productCat:season',
    },
    {
      title: '商品花色',
      icon: 'mdi:color',
      color: '#FF6600',
      auth: 'productCat:color',
    },
    {
      title: '商品档次',
      icon: 'carbon:skill-level',
      color: '#9900FF',
      auth: 'productCat:level',
    },
    {
      title: '商品设计师',
      icon: 'iconoir:people-tag',
      color: '#FF99CC',
      auth: 'productCat:designer',
    },
  ]
</script>
