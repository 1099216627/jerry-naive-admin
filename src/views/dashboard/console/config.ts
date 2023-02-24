import echarts from "@/utils/lib/echarts";

export interface CardItem {
  title: string;
  value: number;
  key: string;
  icon: string;
  percentage: number;
  unit: string;
  up: boolean;
}

import visitsIcon from "@/assets/images/dashboard/visits.svg";
import salesIcon from "@/assets/images/dashboard/sale.svg";
import ordersIcon from "@/assets/images/dashboard/order.svg";
import volumeIcon from "@/assets/images/dashboard/volume.svg";

export const cardConfig: CardItem[] = [
  {
    title: "访问量",
    icon: visitsIcon,
    key: "visits",
    value: 100,
    percentage: 12,
    unit: "周",
    up: true,
  },
  {
    title: "销售额",
    icon: salesIcon,
    key: "sales",
    value: 3980,
    percentage: 20,
    unit: "周",
    up: false,
  },
  {
    title: "订单量",
    icon: ordersIcon,
    key: "orders",
    value: 3685,
    percentage: 35,
    unit: "周",
    up: true,
  },
  {
    title: "成交额",
    icon: volumeIcon,
    key: "volume",
    value: 29856,
    percentage: 5,
    unit: "周",
    up: false,
  },
];

export const visitsOptions = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      data: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ],
      axisTick: {
        alignWithLabel: true,
      },
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      name: "访问量",
      type: "bar",
      barWidth: "60%",
      data: [10, 52, 200, 334, 390, 330, 220, 100, 200, 334, 390, 330, 220],
    },
  ],
};
const datas = [
  {
    value: 36,
    name: "上海市",
  },
  {
    value: 54,
    name: "北京市",
  },
  {
    value: 29,
    name: "广州市",
  },
  {
    value: 25,
    name: "深圳市",
  },
  {
    value: 55,
    name: "杭州市",
  },
  {
    value: 69,
    name: "南京市",
  },
  {
    value: 75,
    name: "天津市",
  },
  {
    value: 85,
    name: "重庆市",
  },
  {
    value: 36,
    name: "孝感市",
  },
  {
    value: 36,
    name: "武汉市",
  },
];

const colorList = [
  "#fc619d",
  "#f4a64f",
  "#4ff4a6",
  "#4f9ff4",
  "#4f9ff4",
  "#4f9ff4",
  "#4f9ff4",
  "#4f9ff4",
  "#4f9ff4",
  "#4f9ff4",
];
export const areaOptions = {
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    show: false,
  },
  yAxis: [
    {
      show: true,
      data: datas.map((item) => item.name),
      inverse: true,
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    {
      show: true,
      inverse: true,
      data: datas.map((item) => item.value),
      axisLabel: {
        textStyle: {
          color: function (_, index) {
            const num = colorList.length;
            return colorList[index % num];
          },
        },
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
  ],
  series: [
    {
      name: "条",
      type: "bar",
      yAxisIndex: 0,
      data: datas.map((item) => item.value),
      barWidth: 10,
      itemStyle: {
        normal: {
          barBorderRadius: 30,
          color: function (params) {
            const num = colorList.length;
            return colorList[params.dataIndex % num];
          },
        },
      },
    },
  ],
};

export const saleOptions = {
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  color: ["#80FFA5", "#00DDFF"],
  title: {
    text: "单位：万",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
    },
  },
  legend: {
    data: ["当月销售额", "月均销售额"],
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      data: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ],
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      name: "当月销售额",
      type: "line",
      stack: "Total",
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgb(128, 255, 165)",
          },
          {
            offset: 1,
            color: "rgb(1, 191, 236)",
          },
        ]),
      },
      emphasis: {
        focus: "series",
      },
      data: [140, 232, 101, 264, 90, 340, 250, 140, 232, 101, 264, 90],
    },
    {
      name: "月均销售额",
      type: "line",
      stack: "Total",
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgb(0, 221, 255)",
          },
          {
            offset: 1,
            color: "rgb(77, 119, 255)",
          },
        ]),
      },
      emphasis: {
        focus: "series",
      },
      data: [120, 282, 111, 234, 220, 340, 310, 120, 282, 111, 234, 220],
    },
  ],
};

export const accessOptions = {
  title: {
    text: "访问来源",
    subtext: "全网访问统计",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  series: [
    {
      name: "访问来源",
      type: "pie",
      radius: "50%",
      data: [
        { value: 1048, name: "视频广告" },
        { value: 580, name: "搜索引擎" },
        { value: 484, name: "直接访问" },
        { value: 300, name: "邮件营销" },
        { value: 300, name: "联盟广告" },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};
