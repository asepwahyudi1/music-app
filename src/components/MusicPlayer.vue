<script setup>
// import { ref, onMounted } from "vue";
// import axios from "axios";
import Play from "vue-material-design-icons/Play.vue";
import Pause from "vue-material-design-icons/Pause.vue";
import SkipBackward from "vue-material-design-icons/SkipBackward.vue";
import SkipForward from "vue-material-design-icons/SkipForward.vue";
import Repeat from "vue-material-design-icons/Repeat.vue";
import Shuffle from "vue-material-design-icons/Shuffle.vue";
import PlaylistMusicOutline from "vue-material-design-icons/PlaylistMusicOutline.vue";
import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
</script>

<script>
export default {
  data() {
    return {
      isPlaying: true,
    };
  },
  name: "MusicPlayer",
  props: {
    song: {
      name: String,
      artistName: String,
      src: String,
      songSrc: String,
    },
  },
  emits: ["goback", "next", "previous"],
  methods: {
    goback() {
      this.$emit("goback");
    },
    togglePlay() {
      if (this.isPlaying) {
        this.$refs.audioPlayer.pause();
      } else {
        this.$refs.audioPlayer.play();
      }

      this.isPlaying = !this.isPlaying;
    },
    next() {
      this.$emit("next");
    },
    previous() {
      this.$emit("previous");
    },
  },
};
</script>

<template>
  <audio :src="song.music" preload="auto" autoplay ref="audioPlayer" />
  <section class="pb-10 md:pb-0">
    <div class="container px-4 pb-16">
      <div class="w-full flex py-4">
        <!-- <router-link  class="text-white pl-3 pt-3">
        </router-link> -->
        <ChevronDown
          @click="goback"
          fillColor="#ffffff"
          class="text-white pl-3 pt-3"
          :size="20"
        />
        <h1
          class="text-white m-auto font-semibold cursor-pointer text-xl md:text-2xl lg:text-4xl"
        >
          Now Playing
        </h1>
      </div>
      <div class="flex flex-col pt-2 pb-1">
        <div class="flex-shrink-0 mb-2">
          <img
            :src="song.image"
            class="w-full h-56 md:w-36 md:h-36 lg:w-40 lg:h-40 object-cover rounded-2xl shadow-xl"
            :alt="song.title"
          />
        </div>
        <div class="flex flex-col flex-1 min-w-0 pl-4 md:pl-5">
          <h1
            class="font-bold text-2xl md:text-3xl lg:text-4xl text-white truncate capitalize"
          >
            {{ song.title }}
          </h1>
          <p
            class="text-medium text-gray-300 truncate pt-2 md:text-lg capitalize"
          >
            {{ song.artist }}
          </p>
        </div>

        <!-- progress bar -->
        <div class="space-y-2 px-4 pt-1">
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
      class="w-full bg-gray-950 px-4 py-3 bg-transparent backdrop-filter backdrop-blur-sm fixed bottom-0 md:flex md:items-center md:justify-evenly"
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
          @click="previous"
          class="flex w-10 h-10 md:w-14 md:h-14 items-center justify-center text-white font-extrabold cursor-pointer bg-gray-900 rounded-full"
        >
          <SkipBackward fillColor="#ffffff" :size="20" />
        </div>

        <!-- pause -->
        <div
          class="flex w-14 h-14 md:w-14 md:h-14 items-center justify-center text-black font-extrabold cursor-pointer bg-white rounded-full"
        >
          <button @click="togglePlay">
            <Play v-if="!isPlaying" fillColor="#181818" :size="25" />
            <Pause v-else fillColor="#181818" :size="20" />
          </button>
        </div>

        <!-- skip end -->
        <div
          @click="next"
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
