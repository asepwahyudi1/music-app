<script setup>
import axios from "axios";
import { ref, onMounted, reactive } from "vue";
import Play from "vue-material-design-icons/Play.vue";
import Pause from "vue-material-design-icons/Pause.vue";
import Heart from "vue-material-design-icons/Heart.vue";

import PlayerMusicKlik from "../components/PlayerMusicKlik.vue";

const isPlayerVisible = ref(false);
const currentSongIndex = ref(0);
const list = ref([]);
const selectedMusic = reactive({});
const isPlaying = ref(false);

const fetchSongList = async () => {
  try {
    const response = await axios.get(
      "https://music-api-devmuhamadtaufik.vercel.app/musics"
    );
    list.value = response.data;
  } catch (error) {
    console.error("failed mengambil list musik", error);
  }
};

const playSong = (index) => {
  currentSongIndex.value = index;
  isPlayerVisible.value = true;
};

onMounted(() => {
  fetchSongList();
});

const playNext = () => {
  if (currentSongIndex.value < list.value.length - 1) {
    currentSongIndex.value += 1;
  } else {
    currentSongIndex.value = 0;
  }
};

const playPrevious = () => {
  if (currentSongIndex.value != 0) {
    currentSongIndex.value -= 1;
  } else {
    currentSongIndex.value = list.value.length - 1;
  }
};

function togglePlay() {
  isPlaying.value = !isPlaying.value;
}

function selectMusic(music) {
  selectedMusic.title = music.title;
  selectedMusic.artist = music.artist;
  selectedMusic.image = music.image;
}
</script>

<template>
  <section v-if="!isPlayerVisible" class="">
    <div class="container px-3 md:mx-auto">
      <h1
        class="text-white py-4 text-center font-semibold cursor-pointer text-xl md:text-2xl lg:text-4xl"
      >
        Songs
      </h1>

      <div class="text-white font-bold text-xl md:text-2xl">
        <h1>Recomendation</h1>
      </div>
      <div
        class="w-full overflow-y-scroll md:grid md:grid-cols-5 xl:grid-cols-6 md:gap-1"
      >
        <div
          v-for="(song, songIndex) in list"
          :key="song.id"
          @click="playSong(songIndex)"
          class="w-full max-w-md md:w-32 md:h-48 lg:w-36 lg:h-56 p-4 border border-gray-800 rounded-3xl shadow-lg bg-gray-900 mt-1"
        >
          <div class="flex flex-row md:flex-col">
            <div class="flex-shrink-0">
              <img
                :src="song.image"
                class="w-16 h-16 mt-2 md:w-24 md:h-24 lg:w-28 lg:h-28 object-cover rounded-2xl shadow-xl"
                :alt="song.title"
              />
            </div>
            <div
              class="flex flex-col flex-1 min-w-0 justify-center md:pl-0 pl-3 md:pt-1"
            >
              <h1
                class="font-semibold mb-1 text-xl md:text-xl text-white truncate capitalize"
              >
                {{ song.title }}
              </h1>
              <p class="text-sm text-gray-300 truncate md:text-lg">
                {{ song.artist }}
              </p>
            </div>
            <div
              class="flex items-center justify-center text-center text-white font-semibold cursor-pointer md:hidden"
            >
              <Heart fillColor="#ffffff" :size="25" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isTrackTime" class="text-xs mx-5 text-gray-400">
      {{ isTrackTime }}
    </div>
  </section>

  <div v-if="isPlayerVisible">
    <PlayerMusicKlik
      v-bind:song="list[currentSongIndex]"
      @goback="isPlayerVisible = !isPlayerVisible"
      @next="playNext"
      @previous="playPrevious"
    />
  </div>
</template>
