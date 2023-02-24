import { DataTableColumns, NTab, NTag } from 'naive-ui';
import { h } from 'vue';
import { IMenu } from './types/menu-type';
const formatBoolean = (value: number) => {
  return Boolean(value) ? "是" : "否"
}
export const createMenuColumn = ():DataTableColumns<IMenu> => {
  return [
    {
      title: "菜单名称",
      key: "title",
      align: "center",
      ellipsis: {
        tooltip: true,
      }
    },
    {
      title: "path",
      key:'path',
      align: "center",
      ellipsis: {
        tooltip: true,
      }
    },
    {
      title: "固钉",
      key: "affix",
      align: "center",
      width: 80,
      render(row){
        return h(NTag,{
          type: row.affix ? "success" : "error",
        },() => formatBoolean(row.affix))
      }
    },
    {
      title: "隐藏",
      key: "hidden",
      align: "center",
      width: 80,
      render(row){
        return h(NTag,{
          type: row.hidden ? "success" : "error",
        },() => formatBoolean(row.hidden))
      }
    },
    {
      title: "缓存",
      key: "cache",
      align: "center",
      width: 80,
      render(row){
        return h(NTag,{
          type: row.cache ? "success" : "error",
        },() => formatBoolean(row.cache))
      }
    },
    {
      title: "外链",
      key: "link",
      align: "center",
      width: 80,
      render(row){
        return h(NTag,{
          type: row.link ? "success" : "error",
        },() => formatBoolean(row.link))
      }
    },
  ]
}
