<template>
  <div>
    <n-card size="small" class="mt-2 mb-2 p-0">
      <div class="flex justify-between items-center">
        <n-space>
          <n-button :color="componentSetting.button.primaryColor" @click="openModal(false)">新建用户</n-button>
          <n-button :color="componentSetting.button.dangerColor" @click="toBatchDelete">批量删除</n-button>
          <n-button :color="componentSetting.button.secondaryColor" @click="handleExport">导出数据</n-button>
        </n-space>
        <n-space>
          <!-- 筛选面板 -->
          <conditional-panel @reset="resetCondition" @change="updateCondition" :config="conditionPanelConfig(roleList.map(item => {
            return {
              label: item.name,
              value: item.id
            }
          }))"></conditional-panel>
          <n-input @keydown.enter="handleSearch" v-model:value="params.username" placeholder="请输入用户昵称"
            class=" max-w-xs">
            <template #suffix>
              <n-icon class="cursor-pointer" @click="handleSearch" :component="SearchOutlined" />
            </template>
          </n-input>
        </n-space>
      </div>
    </n-card>
    <n-card>
      <!-- 数据表格 -->
      <n-data-table :row-key="rowKey" v-model:checked-row-keys="selectRowKeys"
        :columns="createUserColumns(openModal, openDialog)" :data="userList" remote
        @update:page-size="handlePageSizeChange" @update:page="handlePageChange" :pagination="pagination">
      </n-data-table>
      <!--      新建、编辑用户信息模态窗-->
      <n-modal v-model:show="showModal" :mask-closable="false" :close-on-esc="false">
        <n-card :title="modalTitle" style="width: 600px" size="huge" role="dialog" aria-modal="true">
          <template #header-extra>
            <n-icon class="cursor-pointer" @click="handleCancel">
              <CloseOutlined></CloseOutlined>
            </n-icon>
          </template>
          <n-form :model="userModel" ref="formRef" :label-width="80" label-placement="left" :rules="rules">
            <n-form-item label="用户名" path="username">
              <n-input v-model:value="userModel.username" :disabled="isEdit" />
            </n-form-item>
            <n-form-item label="密码" path="password" v-if="!isEdit">
              <n-input type="password" show-password-on="click" v-model:value="userModel.password" />
            </n-form-item>
            <n-form-item label="昵称" path="nickname">
              <n-input v-model:value="userModel.nickname" />
            </n-form-item>
            <n-form-item label="角色" path="roleId">
              <n-select label-field="name" value-field="id" v-model:value="userModel.roleId" :options="roleList"
                placeholder="请选择角色"></n-select>
            </n-form-item>
            <n-form-item label="性别" path="gender">
              <n-radio-group v-model:value="userModel.gender" name="radiogroup">
                <n-space>
                  <n-radio v-for="item in genderOptions" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="头像" path="avatar">
              <basic-upload :width="100" :height="100" @uploadChange="uploadChange" v-model:value="fileList"
                :maxNumber="1">
              </basic-upload>
            </n-form-item>
            <n-form-item class="flex justify-end">
              <n-space>
                <n-button attr-type="button" :color="componentSetting.button.warningColor" @click="handleCancel">
                  取消
                </n-button>
                <n-button attr-type="button" :color="componentSetting.button.primaryColor" @click="handleConfirm">
                  确认
                </n-button>
              </n-space>
            </n-form-item>
          </n-form>
        </n-card>
      </n-modal>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, unref, computed } from "vue";
import { batchDeleteUserApi, createUserApi, deleteUserApi, disableUserApi, enableUserApi, getAllUsersApi, getAllUsersParams, getUserDetailApi, getUserListByIDsApi, recoverUserApi, updateUserInfoApi } from "@/api/user";
import { HttpStatusCode } from "axios";
import { IUserProfile } from "@/views/system/system-user/types/user-type";
import componentSetting from "@/settings/component-setting";
import {
  createUserColumns,
  genderOptions,
  rules,
} from "@/views/system/system-user/config";
import { FormInst, useMessage, useDialog, NButton } from "naive-ui";
import { findAllRolesApi } from "@/api/role";
import { IRole } from "@/views/system/system-role/types/role-type";
import { GenderEnum } from "@/enums/common";
import BasicUpload from "@/components/upload-image/index.vue";
import ConditionalPanel from "@/components/conditional-panel/index.vue";
import { ResultEnum } from "@/enums/httpEnum";
import { CloseOutlined, SearchOutlined } from "@vicons/antd";
import { isVoid } from "@/utils/is";
import { removeEmptyValue } from "@/utils/url-utils";
import { conditionPanelConfig } from './config'
import { useXlsx, XlsxType } from "@/hooks/use-xlsx";
interface IUserModel {
  username: string;
  password: string;
  nickname: string;
  roleId: null | number;
  gender: GenderEnum;
  avatar: string;
}
const xlsxParams = reactive<XlsxType>({
  header: {
    username: '用户名',
    nickname: '昵称',
    roleName: "角色",
    gender: '性别',
    status: '状态',
    createTime: '创建时间',
    address: '地址'
  },
  data: [],
  fileName: `${new Date().getTime()}用户列表}`,
  sheetName: '用户列表'
})
const params = reactive<getAllUsersParams>({
  page: 1,
  limit: 20,
  username: "",
  gender: null,
  roleId: null,
  status: null,
});
const paginationParams = reactive({
  page: 1,
  pages: 0,
  total: 0,
  size: 20
})
const userList = reactive<IUserProfile[]>([]);
const roleList = reactive<IRole[]>([]);
const message = useMessage();
const dialog = useDialog()
const showModal = ref(false);
const formRef = ref<FormInst | null>(null);
const modalTitle = ref("新建用户");
const isEdit = ref(false);
const userId = ref(0);
const userModel = reactive<IUserModel>({
  username: "",
  password: "",
  nickname: "",
  roleId: null,
  gender: GenderEnum.MALE,
  avatar: "",
});
const fileList = reactive([]);
const selectRowKeys = ref<number[]>([]);
const pagination = computed(() => {
  return {
    page: params.page,
    pageSize: params.limit,
    pageCount: paginationParams.pages,
    itemCount: paginationParams.total,
    pageSizes: componentSetting.table.pageSizes,
    showSizePicker: true,
    prefix({ itemCount }) {
      return `共${itemCount}条数据.`
    }
  }
})

const handlePageChange = (page) => {
  params.page = page
  getAllUsers()
}
const handlePageSizeChange = (size) => {
  params.limit = size
  getAllUsers()
}

const handleCancel = () => {
  showModal.value = false;
  userModel.username = "";
  userModel.password = "";
  userModel.nickname = "";
  userModel.roleId = null;
  userModel.avatar = "";
  userModel.gender = GenderEnum.MALE;
  userId.value = 0;
  fileList.splice(0, fileList.length);
};
const rowKey = (row: IUserProfile) => {
  return row.id
}
const handleConfirm = () => {
  formRef.value?.validate(
    (errors) => {
      if (errors) {
        message.error("请检查表单信息");
      } else {
        //新建用户
        if (isVoid(userId.value) || userId.value === 0) {
          createUser();
        } else {
          //编辑用户
          updateUser();
        }
        message.success("提交成功");
      }
    });
};
const updateCondition = (model) => {
  const { gender, status, roleId } = unref(model);
  params.gender = gender;
  params.status = status;
  params.roleId = roleId;
  handleSearch()
}
const resetCondition = () => {
  params.gender = null;
  params.status = null;
  params.roleId = null;
  handleSearch()
}
const createUser = async () => {
  const { code } = await createUserApi(userModel);
  if (code === ResultEnum.SUCCESS) {
    handleCancel();
    getAllUsers();
  }
};
const updateUser = async () => {
  const updateParams = {
    nickname: userModel.nickname,
    roleId: userModel.roleId,
    avatar: userModel.avatar,
    gender: userModel.gender
  }
  const { code } = await updateUserInfoApi(userId.value, updateParams)
  if (code === ResultEnum.SUCCESS) {
    handleCancel();
    getAllUsers();
  }
}

const openModal = async (edit: boolean, id?: number) => {
  showModal.value = true;
  modalTitle.value = edit ? "编辑用户" : "新建用户";
  isEdit.value = edit;
  if (id) {
    userId.value = id;
    const res = await getUserDetail(id)
    if (res) {
      userModel.username = res.username
      userModel.nickname = res.profile.nickname
      userModel.roleId = res.role.id
      userModel.gender = res.profile.gender
      userModel.avatar = res.profile.avatar
    }
  }
};

const getUserDetail = async (id: number) => {
  const { code, data } = await getUserDetailApi(id)
  if (code === ResultEnum.SUCCESS) {
    return data
  }
  return null
}

const openDialog = (title: string, content: string, id: number, action: string) => {
  dialog.warning({
    title,
    content,
    positiveText: '确定',
    negativeText: '取消',
    maskClosable: false,
    closeOnEsc: false,
    onPositiveClick: () => {
      switch (action) {
        case 'disabled':
          disabledUser(id)
          break;
        case 'enabled':
          enabledUser(id)
          break;
        case 'delete':
          deleteUser(id)
          break;
        case 'recover':
          recoverUser(id)
          break;
        case 'batchDelete':
          batchDeleteUser()
          break;
        case 'export':
          exportUser()
          break;
      }
    }
  })
};

const disabledUser = async (id: number) => {
  const { code } = await disableUserApi(id);
  if (code === ResultEnum.SUCCESS) {
    getAllUsers();
  }
};

const enabledUser = async (id: number) => {
  const { code } = await enableUserApi(id);
  if (code === ResultEnum.SUCCESS) {
    getAllUsers();
  }
};

const deleteUser = async (id: number) => {
  const { code } = await deleteUserApi(id);
  if (code === ResultEnum.SUCCESS) {
    getAllUsers();
  }
};

const recoverUser = async (id: number) => {
  const { code } = await recoverUserApi(id);
  if (code === ResultEnum.SUCCESS) {
    getAllUsers();
  }
};
const batchDeleteUser = async () => {
  const { code } = await batchDeleteUserApi({ ids: selectRowKeys.value });
  if (code === ResultEnum.SUCCESS) {
    getAllUsers();
    selectRowKeys.value = []
  }
};

const exportUser = async () => {
  const { code, data } = await getUserListByIDsApi(selectRowKeys.value);
  if (code === ResultEnum.SUCCESS) {
    // header:['用户名', '昵称', '角色', '性别', '状态', '创建时间','状态','地址'],
    xlsxParams.data.push(...data.map(item => {
      return {
        username: item.username,
        nickname: item.profile.nickname,
        roleName: item.role.name,
        gender: item.profile.gender,
        status: item.status,
        createTime: item.createdAt,
        address: item.profile.address
      }
    }))
    const { exportData } = useXlsx(xlsxParams)
    exportData()
    selectRowKeys.value = []
  }
};

const toBatchDelete = () => {
  if (!selectRowKeys.value.length) {
    message.warning('请选择要删除的用户')
    return
  }
  openDialog('删除用户', `确定删除选中的${selectRowKeys.value.length}条用户吗？`, 0, 'batchDelete')
};

const handleExport = () => {
  if (!selectRowKeys.value.length) {
    message.warning('请选择要导出的用户')
    return
  }
  openDialog('导出用户', `确定导出选中的${selectRowKeys.value.length}条用户吗？`, 0, 'export')
}

const getAllRoles = async () => {
  const { code, data } = await findAllRolesApi();
  if (code === HttpStatusCode.Ok) {
    roleList.push(...data);
  }
};
const uploadChange = (url: string) => {
  userModel.avatar = url;
};

const handleSearch = () => {
  params.page = 1;
  getAllUsers();
};

const getAllUsers = async () => {
  const { code, data } = await getAllUsersApi(removeEmptyValue(params));
  if (code === ResultEnum.SUCCESS) {
    if (data.list.length === 0 && params.page > 1) {
      params.page--;
      getAllUsers();
      return;
    }
    paginationParams.page = data.page;
    paginationParams.pages = data.pages;
    paginationParams.total = data.total;
    paginationParams.size = data.size;
    userList.splice(0, userList.length, ...data.list);
  }
};

onMounted(async () => {
  await getAllRoles();
  await getAllUsers();
});
</script>

<style scoped></style>
