<template>
  <n-card>
    <n-data-table :data="menusList" :columns="createMenuColumn()"></n-data-table>
  </n-card>
</template>

<script setup lang="ts">
import { getMenusApi } from '@/api/menu';
import { onMounted, reactive } from 'vue';
import { IMenu } from './types/menu-type';
import { createMenuColumn } from './config';
const menusList = reactive<IMenu[]>([]);
const getAllMenus = async () => {
  const { data } = await getMenusApi();
  menusList.splice(0, menusList.length, ...data);
}

onMounted(() => {
  getAllMenus();
})
</script>

<style scoped></style>
