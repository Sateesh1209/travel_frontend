<script setup>
import MenuBar from "./components/MenuBar.vue";
import travelBg from "./images/travel-bg1.webp";
</script>

<template>
  <v-app
    :style="{
      'background-image': `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
                  url(${travelBg})`,
      'background-position': 'center',
      'background-repeat': 'no-repeat',
      'background-size': 'cover',
    }"
  >
    <MenuBar :key="$route.fullPath" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
