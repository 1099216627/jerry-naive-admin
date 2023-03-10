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
          <n-form-item class="default-color">
            <div class="flex justify-between items-center">
              <div class="flex-initial">
                <n-checkbox v-model:checked="
                  rememberMe
                ">记住我</n-checkbox>
              </div>
              <div class="flex-initial order-last">
                <!-- <a href="javascript:">忘记密码</a> -->
              </div>
            </div>
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="handleSubmit" size="large" :loading="loading" block>
              登录
            </n-button>
          </n-form-item>
          <n-form-item class="default-color">
            <div class="flex view-account-other">
              <div class="flex-initial">
                <span>其它登录方式</span>
              </div>
              <div class="flex-initial mx-2">
                <a @click="notOpen" href="javascript:">
                  <n-icon size="24" color="#2d8cf0">
                    <LogoGithub />
                  </n-icon>
                </a>
              </div>
              <div class="flex-initial mx-2">
                <a @click="notOpen" href="javascript:">
                  <n-icon size="24" color="#2d8cf0">
                    <LogoFacebook />
                  </n-icon>
                </a>
              </div>
              <div class="flex-initial" style="margin-left: auto">
                <a @click="toRegister" href="javascript:">注册账号</a>
              </div>
            </div>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/modules/user";
import { FormRules, useMessage } from "naive-ui";
import { ResultEnum } from "@/enums/httpEnum";
import {
  PersonOutline,
  LockClosedOutline,
  LogoGithub,
  LogoFacebook,
} from "@vicons/ionicons5";
import { PageEnum } from "@/enums/pageEnum";
import { websiteConfig } from "@/config/website.config";
import { validatePassword, validateUsername } from "@/utils/validate";
interface FormState {
  username: string;
  password: string;
}

const formRef = ref();
const message = useMessage();
const loading = ref(false);
const rememberMe = ref(false);
const LOGIN_NAME = PageEnum.BASE_LOGIN_NAME;

const formInline = reactive({
  username: "",
  password: "",
});

const rules = {
  username: { required: true, validator:validateUsername, trigger: "blur" },
  password: { required: true, validator:validatePassword, trigger: "blur" },
} as FormRules;

const userStore = useUserStore();

const router = useRouter();
const route = useRoute();
//暂未开通
const notOpen = () => {
  message.info("暂未开通此登录方式");
};

const toRegister = () => {  
  router.push({
    path:PageEnum.BASE_REGISTER,
    query: {
      redirect: route.query.redirect,
    },
  });
};

const handleSubmit = (e) => {
  e.preventDefault();
  formRef.value.validate(async (errors) => {
    if (!errors) {
      const { username, password } = formInline;
      message.loading("登录中...");
      loading.value = true;

      const params: FormState = {
        username,
        password,
      };

      try {
        const { code, message: msg } = await userStore.login(params,rememberMe.value);
        message.destroyAll();
        if (code == ResultEnum.SUCCESS) {
          const toPath = decodeURIComponent(
            (route.query?.redirect || "/") as string
          );
          message.success("登录成功，即将进入系统");
          if (route.name === LOGIN_NAME) {
            await router.replace("/");
          } else await router.replace(toPath);
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
onMounted(()=>{
  const { params } = useUserStore()
  if(params){
    formInline.username = params.username
    formInline.password = params.password
    rememberMe.value = params.rememberMe
  }
})
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
