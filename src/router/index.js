import { createRouter, createWebHistory } from "vue-router";
import LyricMusic from "../views/LyricMusic.vue";
import ListMusic from "../views/ListMusic.vue";
import PlayerMusic from "../views/PlayerMusic.vue";

const routes = [
  {
    path: "/",
    name: "ListMusic",
    component: () => ListMusic,
  },
  {
    path: "/lyric",
    name: "Lyric",
    component: LyricMusic,
  },
  {
    path: "/player-music",
    name: "PlayerMusic",
    component: PlayerMusic,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
