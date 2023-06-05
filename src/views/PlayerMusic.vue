<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Play from "vue-material-design-icons/Play.vue";
import Pause from "vue-material-design-icons/Pause.vue";
import SkipBackward from "vue-material-design-icons/SkipBackward.vue";
import SkipForward from "vue-material-design-icons/SkipForward.vue";
import Repeat from "vue-material-design-icons/Repeat.vue";
import Shuffle from "vue-material-design-icons/Shuffle.vue";
import PlaylistMusicOutline from "vue-material-design-icons/PlaylistMusicOutline.vue";
import ChevronDown from "vue-material-design-icons/ChevronDown.vue";

const musics = ref([]);
const currentMusic = ref(null);
const isPlaying = ref(false);
const currentAudio = ref(null);

onMounted(() => {
  axios.get("https://music-api.matrikdev.repl.co/").then((response) => {
    musics.value = response.data;
  });
});

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
</script>

<template>
  <section class="pb-10 md:pb-0">
    <div class="container px-4 pb-16">
      <div class="w-full flex py-4">
        <router-link to="/lyric" class="text-white pl-3 pt-3">
          <ChevronDown fillColor="#ffffff" :size="20" />
        </router-link>
        <h1
          class="text-white m-auto font-semibold cursor-pointer text-xl md:text-2xl lg:text-4xl"
        >
          Now Playing
        </h1>
      </div>
      <div
        v-for="music in musics"
        :key="music.title"
        class="flex flex-col pt-2 pb-1"
      >
        <div class="flex-shrink-0 mb-2">
          <img
            :src="music.image"
            class="w-full h-56 md:w-36 md:h-36 lg:w-40 lg:h-40 object-cover rounded-2xl shadow-xl"
            :alt="music.title"
          />
        </div>
        <div class="flex flex-col flex-1 min-w-0 pl-4 md:pl-5">
          <h1
            class="font-bold text-2xl md:text-3xl lg:text-4xl text-white truncate capitalize"
          >
            {{ music.title }}
          </h1>
          <p class="text-lg text-gray-300 truncate pt-2 md:text-lg capitalize">
            {{ music.artist }}
          </p>
        </div>

        <!-- progress bar -->
        <div class="space-y-2 px-4">
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
      </div>
      <div
        class="flex flex-col items-start justify-start px-3 py-3 w-[90%] h-28 bg-gray-900 rounded-3xl mx-auto text-gray-300"
      >
        <div class="flex w-full items-center justify-between">
          <h4 class="uppercase">Up Next</h4>

          <span class="right-0">
            <PlaylistMusicOutline fillColor="#d1d5db" :size="20" />
          </span>
        </div>
        <div class="flex w-full pt-2 items-center justify-between">
          <h4 class="">I'm fine</h4>
          <h4 class="">Ashe</h4>
          <p class="font-medium tracking-wide mb-px">1:46</p>
        </div>
        <div class="flex w-full items-center justify-between">
          <h4 class="">Drown</h4>
          <h4 class="">Dabin</h4>
          <p class="font-medium tracking-wide mb-px">4:19</p>
        </div>
      </div>
    </div>
    <div
      class="w-full bg-gray-950 px-4 py-3 bg-transparent backdrop-filter backdrop-blur-sm fixed bottom-0 md:w-[80%] lg:w-[60%] md:flex md:items-center md:left-[10%] lg:left-[18%]"
    >
      <!-- kontrol musik -->
      <div class="flex items-center justify-between mt-3">
        <!-- putar ditempat -->
        <div
          class="flex w-10 h-10 md:w-14 md:h-14 items-center justify-center text-white font-extrabold cursor-pointer"
        >
          <Shuffle fillColor="#ffffff" :size="20" />
        </div>

        <!-- skip start -->
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
        <!-- pause -->
        <div
          class="flex w-14 h-14 md:w-14 md:h-14 items-center justify-center text-black font-extrabold cursor-pointer bg-white rounded-full"
        >
          <button @click="playPauseMusic(music)">
            <Play v-if="!isPlaying" fillColor="#181818" :size="25" />
            <Pause v-else fillColor="#181818" :size="20" />
          </button>
        </div>

        <!-- skip end -->
        <div
          class="flex w-10 h-10 md:w-14 md:h-14 items-center justify-center text-white font-extrabold cursor-pointer bg-gray-900 rounded-full"
        >
          <SkipForward fillColor="#ffffff" :size="20" />
        </div>

        <!-- putar acak -->
        <div
          class="flex w-10 h-10 md:w-14 md:h-14 items-center justify-center text-white font-extrabold cursor-pointer"
        >
          <Repeat fillColor="#ffffff" :size="20" />
        </div>
      </div>
    </div>
  </section>
</template>
