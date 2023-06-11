<script setup>
import { ref, onMounted } from "vue";
import MusicPlayer from "./components/MusicPlayer.vue";

import { useSongStore } from "./stores/song";
import { storeToRefs } from "pinia";
const useSong = useSongStore();
const { isPlaying, currentTrack } = storeToRefs(useSong);

onMounted(() => {
  isPlaying.value = false;
});
</script>

<template>
  <main>
    <router-view />
  </main>
</template>
