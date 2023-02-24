<template>
  <div class="w-full">
    <div class="upload">
      <div class="upload-card">
        <!--图片列表-->
        <div
          class="upload-card-item"
          :style="getCSSProperties"
          v-for="(item, index) in state.imgList"
          :key="`img_${index}`"
        >
          <div class="upload-card-item-info">
            <div class="img-box">
              <img :src="item" alt="" />
            </div>
            <div class="img-box-actions">
              <n-icon size="18" class="mx-2 action-icon" @click="preview(item)">
                <EyeOutlined />
              </n-icon>
              <n-icon size="18" class="mx-2 action-icon" @click="remove(index)">
                <DeleteOutlined />
              </n-icon>
            </div>
          </div>
        </div>

        <!--上传图片-->
        <div
          class="upload-card-item upload-card-item-select-picture"
          :style="getCSSProperties"
          v-if="state.imgList.length < props.maxNumber"
        >
          <n-upload
            v-bind="$props"
            :file-list-style="{ display: 'none' }"
            @before-upload="beforeUpload"
            @change="handleChange"
            @finish="finish"
            :custom-request="customRequest"
            class="flex justify-center"
          >
            <div class="flex flex-1 flex-col justify-center">
              <n-icon size="18" class="m-auto">
                <PlusOutlined />
              </n-icon>
              <span class="upload-title">上传图片</span>
            </div>
          </n-upload>
        </div>
      </div>
    </div>

    <!--上传图片-->
    <n-space>
      <n-alert
        title="提示"
        type="info"
        v-if="props.helpText"
        class="flex w-full"
      >
        {{ props.helpText }}
      </n-alert>
    </n-space>
  </div>

  <!--预览图片-->
  <n-modal
    v-model:show="state.showModal"
    preset="card"
    title="预览"
    :bordered="false"
    :style="{ width: '520px' }"
  >
    <img :src="state.previewUrl" alt="" />
  </n-modal>
</template>

<script lang="ts" setup>
import { reactive, computed, watch, ref } from "vue";
import { EyeOutlined, DeleteOutlined, PlusOutlined } from "@vicons/antd";
import { basicProps } from "./props";
import { useMessage, useDialog, UploadFileInfo } from "naive-ui";
import { ResultEnum } from "@/enums/httpEnum";
import componentSetting from "@/settings/component-setting";
import { useGlobSetting } from "@/hooks/settings";
import { isString } from "@/utils/is";
import { uploadApi } from "@/api/upload";
const props = defineProps(basicProps);
const emit = defineEmits(["uploadChange", "delete"]);
const globSetting = useGlobSetting();
const getCSSProperties = computed(() => {
  return {
    width: `${props.width}px`,
    height: `${props.height}px`,
  };
});

const message = useMessage();
const dialog = useDialog();
const backendUrl = ref("");

const state = reactive({
  showModal: false,
  previewUrl: "",
  originalImgList: [] as string[],
  imgList: [] as string[],
});

//赋值默认图片显示
watch(
  () => props.value,
  () => {
    state.imgList = props.value.map((item) => {
      return getImgUrl(item);
    });
  },
  { deep: true }
);

//预览
function preview(url: string) {
  state.showModal = true;
  state.previewUrl = url;
}

function customRequest({ file, onFinish, onError }) {
  uploadApi(file.file as File).then((res) => {
    if (res.data.code === ResultEnum.SUCCESS) {
      backendUrl.value = res.data.data;
      onFinish();
    } else {
      message.error(res.data.message);
      onError();
    }
  });
}
//删除
function remove(index: number) {
  dialog.info({
    title: "提示",
    content: "你确定要删除吗？",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      state.imgList.splice(index, 1);
      state.originalImgList.splice(index, 1);
      emit("uploadChange", state.originalImgList);
      emit("delete", state.originalImgList);
    },
    onNegativeClick: () => {},
  });
}

//组装完整图片地址
function getImgUrl(url: string): string {
  const { imgUrl } = globSetting;
  return /(^http|https:\/\/)/g.test(url) ? url : `${imgUrl}${url}`;
}

function checkFileType(fileType: string) {
  return componentSetting.upload.fileType.includes(fileType);
}

//上传之前
function beforeUpload({ file }) {
  const fileInfo = file.file;
  const { maxSize, accept } = props;
  const acceptRef = (isString(accept) && accept.split(",")) || [];

  // 设置最大值，则判断
  if (maxSize && fileInfo.size / 1024 / 1024 >= maxSize) {
    message.error(`上传文件最大值不能超过${maxSize}M`);
    return false;
  }

  // 设置类型,则判断
  const fileType = componentSetting.upload.fileType;
  if (acceptRef.length > 0 && !checkFileType(fileInfo.type)) {
    message.error(`只能上传文件类型为${fileType.join(",")}`);
    return false;
  }
  return true;
}
function handleChange({ file }: { file: UploadFileInfo }) {
  // 上传中
  if (file.status === "pending") {
    message.loading("上传中...");
  }
  // 上传成功
  if (file.status === "finished") {
    message.destroyAll();
    message.success("上传成功", {
      duration: 1,
    });
  }
  // 上传失败
  if (file.status === "error") {
    message.destroyAll();
    message.error("上传失败", {
      duration: 1,
    });
  }
}
//上传结束
function finish() {
  state.imgList.push(getImgUrl(backendUrl.value));
  state.originalImgList.push(backendUrl.value);
  emit("uploadChange", backendUrl.value);
}
</script>

<style scoped lang="less">
.upload {
  width: 100%;
  overflow: hidden;

  &-card {
    width: auto;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    &-item {
      margin: 0 8px 8px 0;
      position: relative;
      padding: 8px;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;

      &:hover {
        background: 0 0;

        .upload-card-item-info::before {
          opacity: 1;
        }

        &-info::before {
          opacity: 1;
        }
      }

      &-info {
        position: relative;
        height: 100%;
        width: 100%;
        padding: 0;
        overflow: hidden;

        &:hover {
          .img-box-actions {
            opacity: 1;
          }
        }

        &::before {
          position: absolute;
          z-index: 1;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          opacity: 0;
          transition: all 0.3s;
          content: " ";
        }

        .img-box {
          position: relative;
          //padding: 8px;
          //border: 1px solid #d9d9d9;
          border-radius: 2px;
        }

        .img-box-actions {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 10;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: space-between;

          &:hover {
            background: 0 0;
          }

          .action-icon {
            color: rgba(255, 255, 255, 0.85);

            &:hover {
              cursor: pointer;
              color: #fff;
            }
          }
        }
      }
    }

    &-item-select-picture {
      border: 1px dashed #d9d9d9;
      border-radius: 2px;
      cursor: pointer;
      background: #fafafa;
      color: #666;

      .upload-title {
        color: #666;
      }
    }
  }
}
</style>
