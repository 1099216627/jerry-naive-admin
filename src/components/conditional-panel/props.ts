import { popoverProps } from 'naive-ui'
// 目前只支持这几种类型
export enum EConfigType {
  Input = 'input',
  Select = 'select',
  Radio = 'radio',
  Checkbox = 'checkbox',
}

export type IConfigItem = {
  title: string
  type: EConfigType,
  key: string,
  filed: string,
  defaultValue?: any,
  options?: Array<{ label: string, value: string | number }>
}

export const defaultProps = {
  ...popoverProps,
  //配置项
  config: {
    type: Array as PropType<IConfigItem[]>,
    default: () => []
  },
}  
