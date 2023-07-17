<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="查看日志"
    :maskClosable="false"
    @cancel="onModalClose"
  >
    <div class="pt-3px pr-3px">
      <Timeline mode="right">
        <TimelineItem v-for="item in logList" :key="item.id" :label="item.subtitle">
          <Collapse
            ><CollapsePanel :header="item.title">
              <p>{{ item.detail }}</p>
            </CollapsePanel></Collapse
          >
        </TimelineItem>
      </Timeline>
    </div>
    <template #footer><a-button @click="onModalClose"> 取消</a-button></template>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref, nextTick } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { Timeline, TimelineItem, Collapse, CollapsePanel } from 'ant-design-vue'
  import { BasicModal, useModalInner } from '@/components/Modal'
  import { getProdLogList } from '@/api/productManage/log'

  const { createMessage } = useMessage()
  const { info, success, warning, error } = createMessage
  const logList = ref<any>([])
  const [register, { closeModal }] = useModalInner((data) => {
    data && onDataReceive(data)
  })

  function onModalClose() {
    logList.value = []
    closeModal()
  }
  function onDataReceive(data) {
    getProdLogList(data.type, data.id).then((data) => {
      if (data.code == 200) {
        logList.value = data.data
      } else {
        error(data.msg)
      }
    })
  }
</script>
