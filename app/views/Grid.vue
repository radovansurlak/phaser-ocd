<template>
  <main>
    <div id="gameArea"></div>
  </main>
</template>

<script>
import BootState from "../../js/states/BootState.js";
import HomeState from "../../js/states/HomeState.js";
import PreloadState from "../../js/states/PreloadState.js";
import GameState from "../../js/states/GameState.js";

export default {
  name: "GridGame",
  mounted() {
    let game = new Phaser.Game(640, 360, Phaser.AUTO);
    //var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'gameArea');
    game.state.add("GameState", GameState);
    game.state.add("HomeState", HomeState);
    game.state.add("PreloadState", PreloadState);
    game.state.add("BootState", BootState);
    game.state.start("BootState");
  }
};
</script>