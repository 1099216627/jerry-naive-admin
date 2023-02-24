<template>
  <n-card>
    <n-space class="mb-4">
      <n-date-picker v-model:value="range" type="daterange" clearable @update:value="handleDate" />
      <n-button :color="componentSetting.button.warningColor" @click=removeSelectRange>清除选中日志</n-button>
      <n-button :color="componentSetting.button.dangerColor" @click="removeAll">清除全部日志</n-button>
    </n-space>
    <n-data-table ref="tableRef" :data="logList" :columns="createLogColumns()" remote :pagination="pagination"
      @update-page="handlePageChange" @update-page-size="handlePageSizeChange"></n-data-table>
  </n-card>
</template>

<script setup lang="ts">
import { deleteAllLogApi, deleteLogApi, getLogListApi } from '@/api/logger';
import { ResultEnum } from '@/enums/httpEnum';
import { computed, onMounted, reactive, ref } from 'vue';
import { ILog } from './types/log-model';
import { createLogColumns } from './config'
import { DataTableInst, useDialog,useMessage } from 'naive-ui';
import componentSetting from '@/settings/component-setting';
const tableRef = ref<DataTableInst | null>(null)
const message = useMessage()
const dialog = useDialog()
const params = reactive({
  page: 1,
  limit: 20
})
const range = ref<[number, number] | null>(null)
const paginationParams = reactive({
  total: 0,
  page: 1,
  pages: 0,
  size: 20
})
const datePicker = reactive({
  start: 0,
  end: 0
})
const handleDate = (date: [number, number]) => {
  datePicker.start = date[0]
  datePicker.end = date[1]
}
const handlePageChange = (page: number) => {
  params.page = page
  getLogList()
}

const handlePageSizeChange = (pageSize: number) => {
  params.limit = pageSize
  getLogList()
}
const logList = reactive<ILog[]>([])
const pagination = computed(() => {
  return {
    page: params.page,
    pageSize: params.limit,
    pageCount: paginationParams.pages,
    itemCount: paginationParams.total,
    pageSizes: componentSetting.table.pageSizes,
    showSizePicker: true,
    prefix() {
      return `共${paginationParams.total}条数据.`
    }
  }
})

const removeAll = () => {
  dialog.warning({
    title: '警告',
    content: '确定要清空所有日志吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const { code } = await deleteAllLogApi()
      try {
        if (code === ResultEnum.SUCCESS) {
          getLogList()
        }
      } catch (error) {
        dialog.destroyAll()
      }
    }
  })
}

const removeSelectRange = () => {
  if (datePicker.start === 0 || datePicker.end === 0) {
    message.warning('请选择日期范围')
    return
  }
  dialog.warning({
    title: '警告',
    content: '确定要清空选中日志吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
     deleteLogApi(datePicker).then(({code})=>{
        if (code === ResultEnum.SUCCESS) {
          getLogList()
        }
     }).catch(
        ()=>{          
          dialog.destroyAll()
        }
     )
    },
    onNegativeClick: () => {
      dialog.destroyAll()
    }
  })
}

const getLogList = async () => {
  const { code, data } = await getLogListApi(params)
  if (code === ResultEnum.SUCCESS) {
    if (params.page > 1 && data.list.length === 0) {
      params.page--
      getLogList()
    }
    logList.splice(0, logList.length, ...data.list)
    paginationParams.total = data.total
    paginationParams.page = data.pages
    paginationParams.pages = data.pages
    paginationParams.size = data.size
  }
}

onMounted(() => {
  getLogList()
})

</script>

<style scoped></style>
