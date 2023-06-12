<script setup>
import { ref, toRefs, onMounted, defineProps } from "vue";
import Heart from "vue-material-design-icons/Heart.vue";
import HeartOutline from "vue-material-design-icons/HeartOutline.vue";
import Play from "vue-material-design-icons/Play.vue";
import Pause from "vue-material-design-icons/Pause.vue";

import { useSongStore } from "../stores/song";
import { storeToRefs } from "pinia";
const useSong = useSongStore();
const { isPlaying, currentTrack } = storeToRefs(useSong);

const props = defineProps({
  track: Object,
  artist: Object,
});

const getHeartColor = (track) => {
  return track.like ? "#EB5757" : "#ffffff";
};

const toggleHeart = (track) => {
  track.like = !track.like;
};

const { track, artist } = toRefs(props);

let isTrackTime = ref(null);

onMounted(() => {
  const audio = new Audio(track.value);
  audio.addEventListener("loadedmetadata", function () {
    const duration = audio.duration;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    isTrackTime.value = minutes + ":" + seconds.toString().padStart(2, "0");
  });
});
const playOrPauseThisSong = () => {
  useSong.playOrPauseThisSong(props.artist, props.track);
};
</script>

<template>
  <div class="flex flex-row md:flex-col">
    <div class="flex-shrink-0" @click="playOrPauseThisSong">
      <router-link to="/detail">
        <img
          :src="track.image"
          class="w-16 h-16 md:mt-2 md:w-24 md:h-24 lg:w-full lg:h-32 object-cover rounded-2xl shadow-xl hover:scale-105 md:hover:scale-110 hover:transition will-change-transform"
          :alt="track.title"
        />
      </router-link>
    </div>
    <div
      @click="playOrPauseThisSong"
      class="flex flex-col flex-1 min-w-0 justify-center md:pl-0 pl-3 md:pt-1"
    >
      <router-link to="/detail">
        <h1
          class="font-semibold mb-1 text-xl md:text-xl text-white truncate capitalize"
        >
          {{ track.title }}
        </h1>
        <p class="text-sm text-white truncate md:text-lg">
          {{ track.artist }}
        </p>
      </router-link>
    </div>
    <div
      class="flex items-center justify-center text-center text-white font-semibold cursor-pointer md:hidden"
    >
      <template v-if="!track.like">
        <HeartOutline
          :fillColor="getHeartColor(track)"
          :size="25"
          @click="toggleHeart(track)"
        />
      </template>
      <template v-else>
        <Heart fillColor="#EB5757" :size="25" />
      </template>
    </div>
    <!-- </router-link> -->
  </div>
</template>

<style lang="scss" scoped></style>
