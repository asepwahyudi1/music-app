<script setup>
import { ref, watch, onMounted } from "vue";
import MusicPlayerVolume from "./MusicPlayerVolume.vue";
import Heart from "vue-material-design-icons/Heart.vue";
import PictureInPictureBottomRight from "vue-material-design-icons/PictureInPictureBottomRight.vue";
import Play from "vue-material-design-icons/Play.vue";
import Pause from "vue-material-design-icons/Pause.vue";
import SkipBackward from "vue-material-design-icons/SkipBackward.vue";
import SkipForward from "vue-material-design-icons/SkipForward.vue";
import Repeat from "vue-material-design-icons/Repeat.vue";
import Shuffle from "vue-material-design-icons/Shuffle.vue";

import { useSongStore } from "../stores/song";
import { storeToRefs } from "pinia";
const useSong = useSongStore();
const { isPlaying, audio, currentTrack, currentArtist } = storeToRefs(useSong);

let isHover = ref(false);
let isTrackTimeCurrent = ref(null);
let isTrackTimeTotal = ref(null);
let seeker = ref(null);
let seekerContainer = ref(null);
let range = ref(0);

onMounted(() => {
  const loadmetadata = () => {
    audio.value.addEventListener("loadedmetadata", function () {
      const duration = audio.value.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      isTrackTimeTotal.value =
        minutes + ":" + seconds.toString().padStart(2, "0");
    });
  };

  const timeupdate = () => {
    audio.value.addEventListener("timeupdate", function () {
      var minutes = Math.floor(audio.value.currentTime / 60);
      var seconds = Math.floor(audio.value.currentTime - minutes * 60);
      isTrackTimeCurrent.value =
        minutes + ":" + seconds.toString().padStart(2, "0");
      const value = (100 / audio.value.duration) * audio.value.currentTime;
      range.value = value;
      seeker.value = value;
    });
  };

  // watch(
  //   () => audio.value,
  //   () => {
  //     timeupdate();
  //     loadmetadata();
  //   }
  // );

  watch(
    () => audio.value,
    () => {
      audio.value.removeEventListener("timeupdate", timeupdate);
      audio.value.removeEventListener("loadedmetadata", loadmetadata);
      timeupdate();
      loadmetadata();
    }
  );

  // if (currentTrack.value && currentTrack.value.music) {
  //   if (audio.value instanceof Audio) {
  //     audio.value.pause();
  //     audio.value = null;
  //   }

  //   audio.value = new Audio(currentTrack.value.music);
  //   setTimeout(() => {
  //     timeupdate();
  //     loadmetadata();
  //   }, 300);
  // }

  if (currentTrack.value && currentTrack.value.music) {
    if (audio.value instanceof Audio) {
      audio.value.pause();
      audio.value.removeEventListener("timeupdate", timeupdate);
      audio.value.removeEventListener("loadedmetadata", loadmetadata);
      audio.value = null;
    }

    audio.value = new Audio(currentTrack.value.music);
    setTimeout(() => {
      timeupdate();
      loadmetadata();
    }, 300);
  }

  if (currentTrack.value) {
    seeker.value.addEventListener("change", function () {
      const time = audio.value.duration * (this.value / 100);
      audio.value.currentTime = time;
    });

    seeker.value.addEventListener("mousedown", function () {
      audio.value.pause();
      isPlaying.value = false;
    });

    seeker.value.addEventListener("mouseup", function () {
      audio.value.play();
      isPlaying.value = true;
    });

    seekerContainer.value.addEventListener("click", function (e) {
      const clickPosition = (e.pageX - this.offsetLeft) / this.offsetWidth;
      const time = audio.value.duration * clickPosition;
      audio.value.currentTime = time;
      seeker.value.value =
        (100 / audio.value.duration) * audio.value.currentTime;
    });
  }
});
</script>

<template>
  <div
    id="MusicPlayer"
    v-if="audio"
    class="fixed flex items-center justify-between bottom-0 w-full z-50 h-[90px] bg-polos shadow-xl rounded-xl bg-opacity-30 backdrop-blur-md border border-slate-900"
  >
    <div class="flex items-center w-1/4">
      <router-link to="/detail">
        <div class="flex items-center ml-4">
          <img
            class="rounded-lg shadow-2xl"
            width="65"
            :src="currentTrack.image"
          />

          <div class="ml-3">
            <div
              class="text-lg md:text-xl text-white font-bold hover:underline cursor-pointer truncate capitalize"
            >
              <h1>{{ currentTrack.title }}</h1>
            </div>
            <div
              class="text-xs md:text-sm truncate text-white hover:underline hover:text-white cursor-pointer capitalize"
            >
              <p>{{ currentTrack.artist }}</p>
            </div>
          </div>
        </div>
      </router-link>
    </div>

    <div class="ml-[55%] md:max-w-[35%] md:mx-auto md:w-2/4 md:mb-3">
      <div class="flex-col items-center justify-end">
        <div class="buttons flex items-center justify-center h-[30px]">
          <div class="hidden md:block">
            <button class="mx-2">
              <Shuffle
                fillColor="#FFFFFF"
                :size="25"
                @click="useSong.shuffleSongs"
              />
            </button>
          </div>
          <div class="hidden md:block">
            <button class="mx-2">
              <SkipBackward
                fillColor="#FFFFFF"
                :size="25"
                @click="useSong.prevSong(currentTrack)"
              />
            </button>
          </div>

          <button
            class="p-1 rounded-full mx-4 bg-white"
            @click="useSong.playOrPauseThisSong(currentArtist, currentTrack)"
          >
            <Play v-if="!isPlaying" fillColor="#181818" :size="25" />
            <Pause v-else fillColor="#181818" :size="25" />
          </button>

          <div class="hidden md:block">
            <button class="mx-2">
              <SkipForward
                fillColor="#FFFFFF"
                :size="25"
                @click="useSong.nextSong(currentTrack)"
              />
            </button>
          </div>

          <div class="hidden md:block">
            <button class="mx-2" @click="useSong.toggleRepeat">
              <Repeat fillColor="#FFFFFF" :size="25" />
            </button>
          </div>
        </div>

        <div class="hidden md:block">
          <div class="flex items-center h-[25px]">
            <div
              v-if="isTrackTimeCurrent"
              class="text-white text-[12px] pr-2 pt-[11px]"
            >
              {{ isTrackTimeCurrent }}
            </div>
            <div
              ref="seekerContainer"
              class="w-full relative mt-2 mb-3"
              @mouseenter="isHover = true"
              @mouseleave="isHover = false"
            >
              <input
                v-model="range"
                ref="seeker"
                type="range"
                class="absolute rounded-full my-2 w-full h-0 z-40 appearance-none bg-opacity-100 focus:outline-none accent-white"
                :class="{ rangeDotHidden: !isHover }"
              />
              <div
                class="pointer-events-none mt-[6px] absolute h-[4px] z-10 inset-y-0 left-0 w-0"
                :style="`width: ${range}%;`"
                :class="isHover ? 'bg-[#52D7BF]' : 'bg-white'"
              />
              <div
                class="absolute h-[4px] z-[-0] mt-[6px] inset-y-0 left-0 w-full bg-gray-500 rounded-full"
              />
            </div>
            <div
              v-if="isTrackTimeTotal"
              class="text-white text-[12px] pl-2 pt-[11px]"
            >
              {{ isTrackTimeTotal }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center w-1/4 justify-end pr-10">
      <div class="hidden md:block">
        <MusicPlayerVolume />
      </div>
    </div>
  </div>
</template>

<style>
.rangeDotHidden[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
}
</style>
