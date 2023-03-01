import { defineStore } from "pinia";
import { store } from "@/stores";
import { getUserInfoApi, signInApi, signOutApi, signUpApi, updatePasswordApi } from "@/api/user";
import { ResultEnum } from "@/enums/httpEnum";
import { storage } from "@/utils/storage";
import { ACCESS_TOKEN, IS_LOCKSCREEN } from "@/stores/mutation-types";
import { IUserProfile } from "@/views/system/system-user/types/user-type";
interface UserState {
  token: string;
  info: IUserProfile | {};
  params: {
    username: string;
    password: string;
    rememberMe: boolean;
  };
}

export const useUserStore = defineStore({
  id: "app-user",
  persist: {
    storage:window.localStorage,
    paths:['params']    
  },
  state: ():UserState => ({
    token: "",
    info: {},
    params: {
      username: "",
      password: "",
      rememberMe: false,
    },
  }),
  getters: {
    getToken(): string {
      return this.token || storage.get(ACCESS_TOKEN, "");
    },
    getInfo(): any {
      return this.info;
    },
  },
  actions: {
    async login(userInfo,rememberMe) {
      try {
        const response = await signInApi(userInfo);
        const { data, code } = response;
        if (code === ResultEnum.SUCCESS) {
          const ex = 7 * 24 * 60 * 60;
          storage.set(ACCESS_TOKEN, data.access_token, ex);
          storage.set(IS_LOCKSCREEN, false);
          this.setToken(data.access_token);
          if(rememberMe){
            this.params = {...userInfo,rememberMe};
          }else{
            this.params = {
              username: "",
              password: "",
              rememberMe: false,
            };
          }
        }
        return Promise.resolve(response);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async register(userInfo) {
      try {
        const response = await signUpApi(userInfo);
        return Promise.resolve(response);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async updatePassword(data) {
      try {
        const response = await updatePasswordApi(data);
        return Promise.resolve(response);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async getUserInfo() {
      const { data, code } = await getUserInfoApi();
      if (code === ResultEnum.SUCCESS) {
        this.setUserInfo(data);
      }
      return data;
    },
    async signOut () {
      const {  code } = await signOutApi();
      if (code === ResultEnum.SUCCESS) {
        this.resetState();
        storage.remove(ACCESS_TOKEN);
        storage.remove(IS_LOCKSCREEN);
      }
    },
    resetState() {
      this.token = "";
      this.info = {};
    },
    setToken(token: string) {
      this.token = token;
    },
    setUserInfo(info) {
      this.info = info;
    },
  },
});
export function useUserStoreWithout() {
  return useUserStore(store);
}
