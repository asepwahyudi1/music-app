<script setup>
import { onMounted } from "vue";
import SongRow from "../components/SongRow.vue";
import MusicPlayer from "../components/MusicPlayer.vue";

import { useSongStore } from "../stores/song";
import { storeToRefs } from "pinia";
const useSong = useSongStore();
const { isPlaying, currentTrack, currentArtist, musics, fetchPlaylist } =
  storeToRefs(useSong);

onMounted(() => {
  isPlaying.value = false;
  useSong.fetchMusics();
});
</script>

<template>
  <section class="mb-[100px]">
    <div class="container px-3 md:mx-auto">
      <h1
        class="text-white py-4 text-center font-semibold cursor-pointer md:hidden text-xl md:text-2xl lg:text-4xl"
      >
        Songs
      </h1>

      <div
        class="text-white font-bold text-xl hidden md:block md:my-4 md:text-2xl mb-1"
      >
        <h1>Recomendation</h1>
      </div>
      <div
        class="w-full overflow-y-scroll md:overflow-hidden md:grid md:grid-cols-5 xl:grid-cols-6 md:gap-4"
      >
        <div
          class="bg-gray-900 border border-gray-800 rounded-3xl shadow-lg md:hidden"
        >
          <div
            v-for="track in musics"
            :key="track.id"
            class="w-full max-w-md md:w-32 md:h-48 lg:w-48 lg:h-64 p-3 md:p-4 md:border md:border-gray-800 md:rounded-3xl md:shadow-lg md:bg-gray-900 md:mt-1"
          >
            <SongRow :track="track" :artist="track.artist" />
          </div>
        </div>

        <div
          v-for="track in musics"
          :key="track.id"
          class="hidden md:block w-full max-w-md md:w-32 md:h-48 lg:w-48 lg:h-64 p-3 md:p-4 md:border md:border-gray-800 md:rounded-3xl md:shadow-lg md:bg-gray-900 md:mt-1"
        >
          <SongRow :track="track" :artist="track.artist" />
        </div>
      </div>
    </div>
  </section>
  <MusicPlayer v-if="currentTrack" />
</template>
