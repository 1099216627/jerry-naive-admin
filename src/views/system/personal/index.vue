<template>
  <n-card style="margin-bottom: 16px">
    <n-tabs type="line" animated>
      <n-tab-pane name="basic" tab="基本信息">
        <n-form
          ref="formRef"
          :model="model"
          label-placement="top"
          :label-width="80"
          :rules="rules"
          :style="{
            maxWidth: '400px',
          }"
        >
          <n-form-item label="昵称" path="nickname">
            <n-input
              v-model:value="model.nickname"
              placeholder="请输入用户昵称"
            />
          </n-form-item>
          <n-form-item label="性别" path="gender">
            <n-select v-model:value="model.gender" :options="genderOptions" />
          </n-form-item>
          <n-form-item label="地址" path="address">
            <n-input
              :resizable="false"
              type="textarea"
              v-model:value="model.address"
            />
          </n-form-item>
          <n-form-item label="头像" path="avatar">
            <basic-upload
              :width="100"
              :height="100"
              @uploadChange="uploadChange"
              v-model:value="fileList"
              :maxNumber="1"
              helpText="单个文件不超过2MB"
            ></basic-upload>
          </n-form-item>
          <n-button @click="updateUserInfo" type="primary"
            >更新基本信息</n-button
          >
        </n-form>
      </n-tab-pane>
      <n-tab-pane name="safety" tab="安全设置">暂未开通安全设置功能</n-tab-pane>
    </n-tabs>
    <n-modal v-model:show="showModal" preset="card" style="width: 600px">
      <img :src="previewImageUrl" style="width: 100%" alt="" />
    </n-modal>
  </n-card>
</template>
<script lang='ts'>
 export default {
    name:"personal"
 }
</script>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useUserStore } from "@/stores/modules/user";
import { FormRules } from "naive-ui";
import { updateSelfInfoApi } from "@/api/user";
import { GenderEnum } from "@/enums/common";
import { validateGender, validateNickname } from "@/utils/validate";
import BasicUpload from "@/components/upload-image/index.vue";
const userStore = useUserStore();

const formRef = ref(null);
const fileList = reactive<string[]>([]);
const model = reactive({
  nickname: "",
  gender: 1,
  address: "",
  avatar: "",
});
const rules: FormRules = {
  nickname: [
    { required: true, validator: validateNickname, trigger: ["input", "blur"] },
  ],
  gender: [
    { required: true, validator: validateGender, trigger: ["input", "blur"] },
  ],
};
let showModal = ref(false);
let previewImageUrl = ref("");
const genderOptions = [
  {
    label: "男",
    value: GenderEnum.MALE,
  },
  {
    label: "女",
    value: GenderEnum.FEMALE,
  },
];

const updateUserInfo = async () => {
  const { code, data } = await updateSelfInfoApi(model);
  if (code === 200) {
    userStore.setUserInfo(data);
  }
};

const uploadChange = (url: string) => {
  model.avatar = url;
};

onMounted(() => {
  const { profile } = userStore.getInfo;
  model.nickname = profile.nickname;
  model.gender = profile.gender;
  model.address = profile.address;
  model.avatar = profile.avatar;
  fileList.splice(0, fileList.length, profile.avatar);
});
</script>

<style scoped></style>
