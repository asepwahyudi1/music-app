<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Play from "vue-material-design-icons/Play.vue";
import Pause from "vue-material-design-icons/Pause.vue";
import Music from "vue-material-design-icons/Music.vue";
import SkipBackward from "vue-material-design-icons/SkipBackward.vue";
import SkipForward from "vue-material-design-icons/SkipForward.vue";
import Repeat from "vue-material-design-icons/Repeat.vue";
import Shuffle from "vue-material-design-icons/Shuffle.vue";
import ChevronDown from "vue-material-design-icons/ChevronDown.vue";

const musics = ref([]);
const musicLyrics = ref([]);
const currentMusic = ref(null);
const isPlaying = ref(false);
const currentAudio = ref(null);

const fetchMusics = () => {
  axios.get("https://music-api.matrikdev.repl.co/").then((response) => {
    musics.value = response.data;
  });
};

const fetchMusicLyric = async () => {
  try {
    const response = await fetch("https://music-api.matrikdev.repl.co/");
    const data = await response.json();
    musicLyrics.value = data[0];
  } catch (error) {
    console.log(error);
  }
};

async function playPauseMusic(music) {
  try {
    if (isPlaying.value) {
      // Musik sedang diputar, jadi hentikan pemutaran
      isPlaying.value = false;
      const audio = currentAudio.value;
      if (audio) {
        await audio.pause();
        audio.currentTime = 0;
      }
    } else {
      // Musik belum diputar, mulai pemutaran
      isPlaying.value = true;
      const audio = new Audio(music.music);
      currentAudio.value = audio;
      await audio.play();
      audio.addEventListener("ended", () => {
        // Pemutaran selesai, setel kembali ke status berhenti
        isPlaying.value = false;
        currentAudio.value = null;
      });
    }
  } catch (error) {
    console.log("Failed to play music:", error);
  }
}

onMounted(() => {
  fetchMusics();
  fetchMusicLyric();
});
</script>

<template>
  <section class="pb-10 md:pb-0">
    <div class="container px-3">
      <div class="w-full flex py-4">
        <router-link to="/" class="text-white pl-3 pt-3">
          <ChevronDown fillColor="#ffffff" :size="20" />
        </router-link>
        <h1
          class="text-white m-auto font-semibold cursor-pointer text-xl md:text-2xl lg:text-4xl"
        >
          Now Playing
        </h1>
      </div>
      <router-link to="/player-music">
        <div
          v-for="music in musics"
          :key="music.title"
          class="flex flex-row pt-4"
        >
          <div class="flex-shrink-0">
            <img
              :src="music.image"
              class="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 object-cover rounded-2xl shadow-xl"
              :alt="music.title"
            />
          </div>
          <div class="flex flex-col flex-1 min-w-0 pl-4 md:pl-5">
            <h1
              class="font-bold text-2xl md:text-3xl lg:text-4xl text-white capitalize"
            >
              {{ music.title }}
            </h1>
            <p class="text-lg text-gray-300 truncate pt-2 md:text-lg">
              {{ music.artist }}
            </p>
          </div>
        </div>
      </router-link>
      <div class="w-full flex items-end justify-end md:hidden">
        <div
          class="flex w-10 h-10 md:w-14 md:h-14 mb-1 items-center justify-center text-white font-extrabold cursor-pointer bg-gray-900 rounded-full"
        >
          <Music fillColor="#ffffff" :size="20" />
        </div>
      </div>
      <div
        class="w-full h-72 max-w-md lg:max-w-xl p-4 overflow-y-scroll border border-gray-800 rounded-3xl shadow-lg bg-gray-900 md:mx-auto"
      >
        <div
          class="flex items-center justify-center mb-2 text-white font-semibold"
        >
          <Music fillColor="#ffffff" :size="20" />
          <h4 class="pl-2">Lyrics</h4>
        </div>

        <p
          v-for="lyric in musicLyrics.lirics"
          :key="lyric"
          class="text-white text-lg font-semibold"
        >
          {{ lyric }}
        </p>
      </div>
    </div>

    <div
      class="w-full bg-gray-950 px-4 py-3 bg-opacity-50 backdrop-filter backdrop-blur-sm fixed bottom-0 md:w-[80%] lg:w-[60%] md:flex md:flex-col md:items-center md:left-[10%] lg:left-[18%]"
    >
      <!-- progress bar -->
      <div class="space-y-2 px-4 w-full">
        <div class="relative">
          <div
            class="bg-[#5E5A5A] transition-all duration-500 dark:bg-slate-700 rounded-full overflow-hidden"
          >
            <div
              class="bg-[#52D7BF] transition-all duration-500 dark:bg-cyan-400 w-[20%] h-2"
              role="progressbar"
              aria-label="music progress"
              aria-valuenow="1456"
              aria-valuemin="0"
              aria-valuemax="4550"
            ></div>
          </div>
          <div
            class="ring-[#52D7BF] transition-all duration-500 dark:ring-cyan-400 ring-2 absolute left-[20%] top-1/2 w-4 h-4 -mt-2 -ml-2 flex items-center justify-center bg-white rounded-full shadow"
          >
            <div
              class="w-1.5 h-1.5 bg-[#52D7BF] transition-all duration-500 dark:bg-cyan-400 rounded-full ring-1 ring-inset ring-slate-900/5"
            ></div>
          </div>
        </div>
        <div
          class="flex justify-between text-sm leading-6 font-medium tabular-nums"
        >
          <div
            class="text-[#52D7BF] transition-all duration-500 dark:text-slate-100"
          >
            1:46
          </div>
          <div
            class="text-slate-500 transition-all duration-500 dark:text-slate-400"
          >
            3:40
          </div>
        </div>
      </div>

      <!-- kontrol musik -->
      <div
        class="flex items-center justify-between md:w-full md:justify-evenly mt-1"
      >
        <div
          class="flex w-10 h-10 md:w-14 md:h-14 items-center justify-center text-white font-extrabold cursor-pointer"
        >
          <Shuffle fillColor="#ffffff" :size="20" />
        </div>

        <div
          class="flex w-10 h-10 md:w-14 md:h-14 items-center justify-center text-white font-extrabold cursor-pointer bg-gray-900 rounded-full"
        >
          <SkipBackward fillColor="#ffffff" :size="20" />
        </div>

        <audio
          :src="currentMusic && currentMusic.music"
          id="audio"
          style="display: none"
        ></audio>

        <div
          class="flex w-14 h-14 md:w-14 md:h-14 items-center justify-center text-black font-extrabold cursor-pointer bg-white rounded-full"
        >
          <button @click="playPauseMusic(music)">
            <Play v-if="!isPlaying" fillColor="#181818" :size="25" />
            <Pause v-else fillColor="#181818" :size="20" />
          </button>
        </div>

        <div
          class="flex w-10 h-10 md:w-14 md:h-14 items-center justify-center text-white font-extrabold cursor-pointer bg-gray-900 rounded-full"
        >
          <SkipForward fillColor="#ffffff" :size="20" />
        </div>

        <div
          class="flex w-10 h-10 md:w-14 md:h-14 items-center justify-center text-white font-extrabold cursor-pointer"
        >
          <Repeat fillColor="#ffffff" :size="20" />
        </div>
      </div>
    </div>
  </section>
</template>
