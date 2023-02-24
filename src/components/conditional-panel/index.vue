<template>
  <n-popover :width="300" trigger="click" placement="bottom" display-directive="show">
    <template #trigger>
      <n-button>筛选</n-button>
    </template>
    <!-- content -->
    <n-form ref="formRef" :model="model" label-placement="left">
      <n-form-item v-for="item in props.config" :key="item.key" :label="item.title + '：'" :path="item.filed">
        <!-- radio -->
        <n-radio-group @update:value="handleModel" v-model:value="model[item.filed]" name="radiogroup" v-if="item.type === EConfigType.Radio" :default-value="item.defaultValue">
          <n-space>
            <n-radio v-for="radio in item.options" :key="radio.value" :value="radio.value">
              {{ radio.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
        <!-- select -->
        <n-select clearable @clear="model[item.filed] = item.defaultValue" @update:value="handleModel" v-model:value="model[item.filed]" :options="item.options" v-else-if="item.type === EConfigType.Select" :default-value="item.defaultValue" ></n-select>
      </n-form-item>
      <n-form-item class="flex justify-end">
        <n-button type='primary' @click="resetModel">重置</n-button>
      </n-form-item>
    </n-form>
  </n-popover>
</template>

<script setup lang="ts">
import { FormInst } from 'naive-ui';
import { ref ,reactive} from 'vue';
import { defaultProps } from './props'
import { EConfigType } from './props'
const props = defineProps(defaultProps)
const model = reactive<any>({})
const formRef = ref<FormInst | null>(null)
const emit = defineEmits(['change','reset'])
const handleModel = () => {  
 setTimeout(() => {
    emit('change', model)
  }, 0)
}

const resetModel = () => {
  Object.keys(model).forEach((key) => {
    model[key] = props.config.find((item) => item.filed === key)?.defaultValue
  })
  //重置表单
  emit('reset')
}
</script>

<style scoped></style>