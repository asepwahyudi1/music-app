import { defineStore } from "pinia";
import axios from "axios";

export const useSongStore = defineStore("song", {
  state: () => ({
    musics: [],
    isPlaying: false,
    audio: null,
    currentArtist: null,
    currentTrack: null,
    repeatCount: 0,
  }),
  actions: {
    async fetchMusics() {
      try {
        const response = await axios.get("/musics");
        this.musics = response.data;

        const firstMusic = this.musics[0];

        if (firstMusic.id && firstMusic.music && firstMusic.artist) {
          const musicUrl = firstMusic.music;
          const track = {
            id: firstMusic.id,
            title: firstMusic.title,
            artist: firstMusic.artist,
            image: firstMusic.image,
            lyrics: firstMusic.lyrics,
            music: firstMusic.music,
            like: firstMusic.like,
          };
          const artist = {
            id: firstMusic.artist.id,
            title: firstMusic.artist.title,
            artist: firstMusic.artist.artist,
            music: firstMusic.artist.music,
            lyrics: firstMusic.artist.lyrics,
            image: firstMusic.artist.image,
            like: firstMusic.artist.like,
          };

          this.playOrPauseThisSong(artist, track);
          this.loadSong(artist, track);
        } else {
          console.log("Artist or track is missing id");
        }
      } catch (error) {
        console.log(error);
      }
    },

    async loadSong(artist, track) {
      try {
        this.currentArtist = artist;
        this.currentTrack = track;

        // Memeriksa apakah audio sedang diputar dan menghentikannya jika iya
        if (this.audio && typeof this.audio.pause === "function") {
          this.audio.pause();
        }

        if (!this.audio) {
          this.audio = new Audio();
        }

        // Mengatasi kemungkinan kesalahan saat memuat audio
        this.audio.addEventListener("error", (error) => {
          console.log("Error loading audio:", error);
          if (error.target && error.target.error) {
            console.log("Audio load error code:", error.target.error.code);
            console.log(
              "Audio load error message:",
              error.target.error.message
            );
          }
        });

        // Memulai pemutaran setelah audio dimuat
        this.audio.addEventListener("loadedmetadata", () => {
          this.isPlaying = true;
          this.audio.play();
        });

        this.audio.addEventListener("ended", () => {
          this.nextSong();
        });

        this.audio.src = track.music;

        // Tunggu hingga audio selesai dimuat
        await this.audio.load();

        // Mulai pemutaran audio
        this.audio.play();
      } catch (error) {
        console.log(error);
      }
    },

    playOrPauseSong() {
      if (this.audio.readyState === 4) {
        if (this.audio.paused) {
          this.isPlaying = true;
          this.audio.play();
        } else {
          this.isPlaying = false;
          this.audio.pause();
        }
      }
    },

    playOrPauseThisSong(artist, track) {
      if (
        !this.audio ||
        !this.audio.src ||
        this.currentTrack?.id !== track?.id
      ) {
        this.loadSong(artist, track);
        return;
      }

      this.playOrPauseSong();

      if (!this.audio.paused) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    },

    setCurrentTrack(track) {
      this.currentTrack = track;
    },

    prevSong(currentTrack) {
      if (!Array.isArray(this.musics)) {
        console.error("Invalid musics data");
        return;
      }

      const currentIndex = this.musics.findIndex(
        (song) => song.id === currentTrack.id
      );
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        const prevSong = this.musics[prevIndex];
        this.loadSong(this.currentArtist, prevSong);
        this.setCurrentTrack(prevSong);
      }
    },

    shuffleSongs(currentTrack) {
      if (currentTrack) {
        trackIndex = Math.floor(Math.random() * this.musics.length);
      } else if (trackIndex < 0) {
        trackIndex = musics.length - 1;
      } else if (trackIndex >= musics.length) {
        trackIndex = 0;
      }
    },

    toggleRepeat() {
      this.repeatCount++;
      if (this.repeatCount === 1) {
        // Memutar seluruh lagu
        console.log("Memutar seluruh lagu");
      } else if (this.repeatCount === 2) {
        // Memutar 1 lagu
        console.log("Memutar 1 lagu");
      } else {
        this.repeatCount = 0;
        // Menghentikan pemutaran
        console.log("Menghentikan pemutaran");
      }
    },

    nextSong(currentTrack) {
      if (!Array.isArray(this.musics)) {
        console.error("Invalid musics data");
        return;
      }

      const currentIndex = this.musics.findIndex(
        (song) => song.id === currentTrack?.id
      );
      const nextIndex = currentIndex + 1;
      if (nextIndex < this.musics.length) {
        const nextSong = this.musics[nextIndex];
        this.loadSong(this.currentArtist, nextSong);
        this.setCurrentTrack(nextSong);
      }
    },

    playFromFirst() {
      this.resetState();
      let track = this.musics[0];
      this.loadSong(this.currentArtist, track);
    },

    resetState() {
      this.isPlaying = false;
      this.audio = null;
      this.currentArtist = null;
      this.currentTrack = null;
    },
  },
  persist: true,
});
