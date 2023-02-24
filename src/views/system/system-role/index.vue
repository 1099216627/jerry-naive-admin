<template>
  <div>
    <n-card size="small" class="mt-2 mb-2 p-0">
      <div class="flex justify-between items-center">
        <n-space>
          <n-button :color="componentSetting.button.primaryColor" @click="openModal()">新建角色</n-button>
        </n-space>
        <n-space>
          <n-input @keydown.enter="handleSearch" v-model:value="params.name" placeholder="请输入角色名称" class=" max-w-xs">
            <template #suffix>
              <n-icon class="cursor-pointer" @click="handleSearch" :component="SearchOutlined" />
            </template>
          </n-input>
        </n-space>
      </div>
    </n-card>
    <!-- 角色数据表格 -->
    <n-card>
      <n-data-table :columns="createRoleColumns(openModal, openPermissionModal, deleteRole)" remote
        :pagination="pagination" @update:page="handlePageChange" @update:pageSize="handlePageSizeChange" :data="roleList"
        :rowKey="record => record.id">
      </n-data-table>
    </n-card>
    <!-- 新建、编辑角色 -->
    <n-modal v-model:show="showModal" :mask-closable="false" :close-on-esc="false">
      <n-card :title="modalTitle" style="width: 600px" size="huge" role="dialog" aria-modal="true">
        <template #header-extra>
          <n-icon class="cursor-pointer" @click="handleCancel">
            <CloseOutlined></CloseOutlined>
          </n-icon>
        </template>
        <n-form :model="roleModel" ref="formRef" :label-width="80" label-placement="left" :rules="formRules">
          <n-form-item path="name" label="角色名称">
            <n-input placeholder="请输入角色名称" v-model:value="roleModel.name"></n-input>
          </n-form-item>
          <n-form-item path="menus" label="角色菜单">
            <n-tree block-line :cascade="cascade" @update:checked-keys="updateCheckedKeys" :checkedKeys="roleModel.menus"
              :data="menusList" key-field="key" label-field="title" children-field="children" checkable expand-on-click
              selectable></n-tree>
          </n-form-item>
          <n-form-item class="flex justify-end">
            <n-button :color="componentSetting.button.warningColor" @click="handleCancel">取消</n-button>
            <n-button :color="componentSetting.button.primaryColor" class="ml-2" type="primary"
              @click="handleSubmit">确定</n-button>
          </n-form-item>
        </n-form>
      </n-card>
    </n-modal>
    <!-- 分配权限 -->
    <n-modal v-model:show="showPermissionModal" :maskClosable="false" :closeOnEsc="false">
      <n-card title="分配权限" style="width: 600px" size="huge" role="dialog" aria-modal="true">
        <template #header-extra>
          <n-icon class="cursor-pointer" @click="closePermissionModal">
            <CloseOutlined></CloseOutlined>
          </n-icon>
        </template>
        <n-checkbox-group v-model:value="selectPermissions">
          <n-space item-style="display: flex;">
            <n-checkbox v-for="item in permissionsList" :key="item.id" :value="item.key" :label="item.title" />
          </n-space>
        </n-checkbox-group>
        <div class="flex justify-end mt-10">
          <n-button :color="componentSetting.button.warningColor" @click="closePermissionModal">取消</n-button>
          <n-button :color="componentSetting.button.primaryColor" class="ml-2" type="primary"
            @click="handlePermission">确定</n-button>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { findRoleListApi, createRoleApi, CreateRoleModel, distributionRoleApi, updateRoleApi, deleteRoleApi } from '@/api/role';
import { ResultEnum } from '@/enums/httpEnum';
import componentSetting from '@/settings/component-setting';
import { CloseOutlined, SearchOutlined } from "@vicons/antd";
import { computed, onMounted, reactive, ref } from 'vue';
import { IRole } from './types/role-type';
import { createRoleColumns } from './config'
import { getMenusApi, getPermissionsApi } from '@/api/menu';
import { IMenu, IPermission } from '../system-menu/types/menu-type';
import { flatToTree } from '@/utils';
import { FormInst, useMessage, useDialog } from 'naive-ui';
import { formRules } from './config';
const formRef = ref<FormInst | null>(null);
const cascade = ref(true);
const message = useMessage()
const dialog = useDialog()
const params = reactive({
  page: 1,
  limit: 10,
  name: ''
});
const paginationParams = reactive({
  page: 0,
  size: 0,
  total: 0,
  pages: 0
});
const showModal = ref(false);
const showPermissionModal = ref(false);
const modalTitle = ref('');
const selectPermissions = ref<string[]>([]);
const roleList = reactive<IRole[]>([]);
const menusList = reactive<IMenu[]>([]);
const permissionsList = reactive<IPermission[]>([]);
const roleId = ref(0);
const roleModel = reactive<CreateRoleModel>({
  name: '',
  menus: []
});

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

const handleCancel = () => {
  showModal.value = false;
  roleModel.name = '';
  roleModel.menus = [];
  roleId.value = 0;
  modalTitle.value = '';
}

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (errors) {
      message.error("请检查表单信息");
    } else {
      if (roleId.value) {
        updateRole()
      } else {
        createRole()
      }
    }
  });
  console.log(roleModel);
}

const createRole = async () => {
  const { code } = await createRoleApi(roleModel)
  if (code === ResultEnum.SUCCESS) {
    getRoleList()
    handleCancel()
  }
}

const updateRole = async () => {
  const { code } = await updateRoleApi(roleId.value, roleModel)
  if (code === ResultEnum.SUCCESS) {
    getRoleList()
    handleCancel()
  }
}

const deleteRole = (id: number) => {
  dialog.warning({
    title: '提示',
    content: '确定删除该角色吗？',
    positiveText: '确定',
    negativeText: '取消',
    maskClosable: false,
    closeOnEsc: false,
    onPositiveClick: async () => {
      const { code } = await deleteRoleApi(id)
      if (code === ResultEnum.SUCCESS) {
        getRoleList()
      }
    }
  })
}

const getChildrenKeys = (menus: IMenu[]) => {
  const treeMenus = flatToTree(menus)
  const keys: string[] = []
  const getKeys = (menus: any) => {
    menus.forEach(item => {
      if (item.children) {
        getKeys(item.children)
      } else {
        keys.push(item.key)
      }
    })
  }
  getKeys(treeMenus)
  return keys
}

const openModal = (id?: number) => {
  if (id) {
    const role = findRoleByList(id)
    if (role) {
      roleModel.name = role.name;
      roleModel.menus = getChildrenKeys(role.menus);
      roleId.value = id;
      modalTitle.value = '编辑角色';
      showModal.value = true;
    } else {
      message.error('角色不存在，请刷新重试')
    }
  } else {
    modalTitle.value = '新增角色';
    showModal.value = true;
  }
}

const openPermissionModal = (id: number) => {
  const role = findRoleByList(id)
  if (role) {
    selectPermissions.value = role.permissions.map(item => item.key)
    showPermissionModal.value = true;
    roleId.value = id;
  } else {
    message.error('角色不存在，请刷新重试')
  }
}

const findRoleByList = (id: number) => {
  const role = roleList.find(item => item.id === id)
  if (role) {
    return role
  }
  return null
}

const closePermissionModal = () => {
  showPermissionModal.value = false;
  roleId.value = 0;
  selectPermissions.value?.splice(0, selectPermissions.value?.length);
}

const updateCheckedKeys = (keys: string[]) => {
  roleModel.menus = keys;
}

const handlePermission = async () => {
  const { code } = await distributionRoleApi(roleId.value, { permissions: selectPermissions.value })
  if (code === ResultEnum.SUCCESS) {
    closePermissionModal()
    getRoleList()
  }
}

const handleSearch = () => {
  params.page = 1;
  getRoleList();
}

const getRoleList = async () => {
  const { code, data } = await findRoleListApi(params);
  if (code === ResultEnum.SUCCESS) {
    if (params.page > 1 && data.list.length === 0) {
      params.page--;
      getRoleList();
      return;
    }
    roleList.splice(0, roleList.length, ...data.list);
    paginationParams.page = data.page;
    paginationParams.size = data.size;
    paginationParams.total = data.total;
    paginationParams.pages = data.pages;
  }
}

const getAllMenus = async () => {
  const { code, data } = await getMenusApi();
  if (code === ResultEnum.SUCCESS) {
    menusList.splice(0, menusList.length, ...flatToTree(data));
  }
}

const getAllPermissions = async () => {
  const { code, data } = await getPermissionsApi();
  if (code === ResultEnum.SUCCESS) {
    permissionsList.splice(0, permissionsList.length, ...data);
  }
}

const handlePageChange = (page: number) => {
  params.page = page;
  getRoleList();
}

const handlePageSizeChange = (size: number) => {
  params.pageSize = size;
  getRoleList();
}

onMounted(() => {
  getRoleList();
  getAllMenus();
  getAllPermissions();
})

</script>

<style scoped></style>
