import type { PropType } from "vue";
import { NUpload } from "naive-ui";

export const basicProps = {
  ...NUpload.props,
  //支持的文件类型
  accept: {
    type: String,
    default: ".jpg,.png,.jpeg,.svg,.gif",
  },
  //帮助文本
  helpText: {
    type: String as PropType<string>,
    default: "",
  },
  //最大文件大小
  maxSize: {
    type: Number as PropType<number>,
    default: 2,
  },
  //最大文件数量
  maxNumber: {
    type: Number as PropType<number>,
    default: Infinity,
  },
  //文件列表
  value: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  width: {
    type: Number as PropType<number>,
    default: 104,
  },
  height: {
    type: Number as PropType<number>,
    default: 104, //建议不小于这个尺寸 太小页面可能显示有异常
  },
};
