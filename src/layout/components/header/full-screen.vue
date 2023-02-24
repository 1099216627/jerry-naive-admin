<template>
  <div>
    <fullscreen-exit-outlined
      v-if="isFullscreen"
      @click="toggleFullScreen"
    ></fullscreen-exit-outlined>
    <fullscreen-outlined v-else @click="toggleFullScreen"></fullscreen-outlined>
  </div>
</template>

<script setup lang="ts">
import { FullscreenOutlined, FullscreenExitOutlined } from "@vicons/antd";
import { ref } from "vue";
const isFullscreen = ref(false);
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    isFullscreen.value = true;
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      isFullscreen.value = false;
      document.exitFullscreen();
    }
  }
};
</script>

<style scoped></style>
