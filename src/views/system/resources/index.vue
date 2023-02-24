<template>
  <div>
    <n-card class="mt-2 mb-2 p-0" size="small">
      <n-button :color="componentSetting.button.primaryColor" @click="openModal()">新建资源</n-button>
    </n-card>
    <n-card>
      <n-data-table remote :row-key="record => record.id" :columns="createResourceColumns(openModal, deleteResource)"
        @update:page="handlePageChange" @update:pageSize="handlePageSizeChange" :pagination="pagination"
        :data="resourceList"></n-data-table>
    </n-card>
    <!-- 新建、编辑资源 -->
    <n-modal :mask-closable="false" :close-on-esc="false" v-model:show="showModal">
      <n-card style="width: 600px" :title="title" size="huge" role="dialog" aria-modal="true">
        <template #header-extra>
          <n-icon class="cursor-pointer" @click="cancelSubmit">
            <CloseOutlined></CloseOutlined>
          </n-icon>
        </template>
        <n-form :model="resourceModel" label-placement="left" ref="formRef" :label-width="80" :rules="createFormRules()">
          <n-form-item label="资源名称" path="name">
            <n-input placeholder="请输入资源名称" v-model:value="resourceModel.name"></n-input>
          </n-form-item>
          <n-form-item label="资源描述" path="description">
            <n-input maxlength="255" v-model:value="resourceModel.description" type="textarea" placeholder="请输入资源描述"
              :resizable="false" />
          </n-form-item>
          <n-form-item label="资源链接" path="url">
            <n-input maxlength="255" placeholder="请输入资源链接" v-model:value="resourceModel.url"></n-input>
          </n-form-item>
          <n-form-item label="资源封面" path="cover">
            <basic-upload :width="100" :height="100" @uploadChange="uploadChange" v-model:value="fileList" :maxNumber="1"
              helpText="单个文件不超过2MB"></basic-upload>
          </n-form-item>
          <n-space justify="end">
            <n-button :color="componentSetting.button.warningColor" @click="cancelSubmit">取消</n-button>
            <n-button :color="componentSetting.button.primaryColor" @click="submitForm">提交</n-button>
          </n-space>
        </n-form>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import componentSetting from '@/settings/component-setting';
import { FormInst,useDialog } from 'naive-ui';
import { onMounted, reactive, ref, computed, nextTick } from 'vue';
import BasicUpload from '@/components/upload-image/index.vue';
import { createFormRules, createResourceColumns } from './config';
import { createResourceApi, deleteResourceApi, getResourceListApi, updateResourceApi } from '@/api/resource';
import { ResultEnum } from '@/enums/httpEnum';
import { IRessource } from './types/resource-type';
import { CloseOutlined } from '@vicons/antd'
const showModal = ref(false);
const dialog = useDialog();
const title = ref('新建资源');
const formRef = ref<FormInst | null>(null);
const fileList = reactive<string[]>([]);
const resourceId = ref(0);
const resourceList = reactive<IRessource[]>([]);
const resourceModel = reactive({
  name: "",
  url: "",
  description: "",
  cover: "",
})
const paginationParams = reactive({
  page: 1,
  pages: 20,
  total: 0,
  size: 0
})
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
const params = reactive({
  page: 1,
  limit: 20,
  name: "",
})
const openModal = (id?: number) => {
  showModal.value = true;
  nextTick(() => {
    if (id) {
      resourceId.value = id
      const resource = resourceList.find(item => item.id === resourceId.value);
      if (resource) setResourceInfo(resource);
      title.value = '编辑资源';
    } else {
      title.value = '新建资源';
    }
  })
}

const setResourceInfo = (item: IRessource) => {
  resourceModel.name = item.name;
  resourceModel.url = item.url;
  resourceModel.description = item.description;
  resourceModel.cover = item.cover;
  fileList.splice(0, fileList.length, item.cover);
}

const uploadChange = (url: string) => {
  resourceModel.cover = url;
}

const submitForm = () => {
  formRef.value?.validate((erros) => {
    if (erros) {
      return;
    }
    if (resourceId.value) {
      updateResource()
      // 编辑资源
    } else {
      // 新建资源
      createResource()
    }
  })
}

const handlePageChange = (page: number) => {
  params.page = page;
  getResourceList();
}

const handlePageSizeChange = (pageSize: number) => {
  params.limit = pageSize;
  getResourceList();
}

const createResource = async () => {
  // 新建资源
  const { code } = await createResourceApi(resourceModel);
  if (code === 200) {
    cancelSubmit();
    getResourceList();
  }
}
const updateResource = async () => {
  // 编辑资源
  const { code } = await updateResourceApi(resourceId.value,resourceModel);
  if (code === 200) {
    cancelSubmit();
    getResourceList();
  }
}
const getResourceList = async () => {
  // 获取资源列表
  const { code, data } = await getResourceListApi(params);
  if (code === ResultEnum.SUCCESS) {
    if (params.page > 1 && data.list.length === 0) {
      params.page--;
      getResourceList();
      return;
    }
    resourceList.splice(0, resourceList.length, ...data.list);
    paginationParams.page = data.page;
    paginationParams.pages = data.pages;
    paginationParams.total = data.total;
    paginationParams.size = data.size;
  }
}

const deleteResource = async (id: number) => {
  dialog.warning({
    title: '提示',
    content: '确定删除该资源吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const { code } = await deleteResourceApi(id);
      if (code === ResultEnum.SUCCESS) {
        getResourceList();
      }
    }
  })
}

const cancelSubmit = () => {
  showModal.value = false;
  resourceModel.name = "";
  resourceModel.url = "";
  resourceModel.description = "";
  resourceModel.cover = "";
  fileList.splice(0, fileList.length);
}

onMounted(() => {
  getResourceList()
})
</script>

<style lang="scss" scoped></style>