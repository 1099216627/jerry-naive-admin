<template>
  <div class="view-account">
    <div class="view-account-header"></div>
    <div class="view-account-container">
      <div class="view-account-top">
        <div class="view-account-top-logo">
          <img :src="websiteConfig.loginImage" alt="" />
        </div>
        <div class="view-account-top-desc">{{ websiteConfig.loginDesc }}</div>
      </div>
      <div class="view-account-form">
        <n-form ref="formRef" label-placement="left" size="large" :model="formInline" :rules="rules">
          <n-form-item path="username">
            <n-input v-model:value="formInline.username" placeholder="请输入用户名">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <PersonOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password">
            <n-input v-model:value="formInline.password" type="password" showPasswordOn="click" placeholder="请输入密码">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="passwordRepeat">
            <n-input v-model:value="formInline.passwordRepeat" type="password" showPasswordOn="click" placeholder="请输入密码">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item>
            <div class="w-full">
              <div @click="toLogin" class=" mb-2 text-blue-500 text-end cursor-pointer">
                去登录
              </div>
              <n-button class="w-full" type="primary" @click="handleSubmit" size="large" :loading="loading" block>
                注册
              </n-button>
            </div>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/modules/user";
import { FormRules, useMessage } from "naive-ui";
import { ResultEnum } from "@/enums/httpEnum";
import {
  PersonOutline,
  LockClosedOutline,
} from "@vicons/ionicons5";
import { PageEnum } from "@/enums/pageEnum";
import { websiteConfig } from "@/config/website.config";
import { validatePassword, validateUsername } from "@/utils/validate";
interface FormState {
  username: string;
  password: string;
  passwordRepeat: string;
}

const formRef = ref();
const message = useMessage();
const loading = ref(false);
const LOGIN_NAME = PageEnum.BASE_LOGIN_NAME;

const formInline = reactive({
  username: "",
  password: "",
  passwordRepeat: "",
});

const validatorPasswordRepeat = (_, value, callback) => {
  if (value !== formInline.password) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};

const rules = {
  username: { required: true, validator: validateUsername, trigger: "blur" },
  password: { required: true, validator: validatePassword, trigger: "blur" },
  passwordRepeat: { required: true, validator: validatorPasswordRepeat, trigger: "blur" },
} as FormRules;

const userStore = useUserStore();

const router = useRouter();
const route = useRoute();

const toLogin = () => {
  router.push({
    name: LOGIN_NAME,
    query: {
      redirect: route.query.redirect,
    },
  });
};

const handleSubmit = (e) => {
  e.preventDefault();
  formRef.value.validate(async (errors) => {
    if (!errors) {
      const { username, password, passwordRepeat } = formInline;
      message.loading("注册中...");
      loading.value = true;

      const params: FormState = {
        username,
        password,
        passwordRepeat
      };

      try {
        const { code, message: msg } = await userStore.register(params);
        message.destroyAll();
        if (code == ResultEnum.SUCCESS) {
          message.success("注册成功，即将跳转到登录页面");
          setTimeout(() => {
            toLogin();
          }, 1000);
        } else {
          message.info(msg || "登录失败");
        }
      } finally {
        loading.value = false;
      }
    } else {
      message.error("请填写完整信息，并且进行验证码校验");
    }
  });
};
</script>

<style lang="less" scoped>
.view-account {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;

  &-container {
    flex: 1;
    padding: 32px 12px;
    max-width: 384px;
    min-width: 320px;
    margin: 0 auto;
  }

  &-top {
    padding: 32px 0;
    text-align: center;

    &-desc {
      font-size: 14px;
      color: #808695;
    }
  }

  &-other {
    width: 100%;
  }

  .default-color {
    color: #515a6e;

    .ant-checkbox-wrapper {
      color: #515a6e;
    }
  }
}

@media (min-width: 768px) {
  .view-account {
    background-image: url("../../assets/images/login.svg");
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: 100%;
  }

  .page-account-container {
    padding: 32px 0 24px 0;
  }
}
</style>
