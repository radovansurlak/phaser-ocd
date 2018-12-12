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
    let game = new Phaser.Game({
			width: 640,
			height: 360,
			renderer: Phaser.AUTO,
			antialias: true,
			parent: this.$el,
		});
    //var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'gameArea');
		let boundRedirectHome = (function(testDone) {this.$router.push({ path: '/'})}).bind(this)

    game.state.add("GameState", GameState);
    game.state.add("HomeState", HomeState);
    game.state.add("PreloadState", PreloadState);
    game.state.add("BootState", BootState);
		game.state.states.GameState.redirectHome = boundRedirectHome;
		game.state.start("BootState");

		// Redirect function that uses Vue's router to redirect user home 
		// (we can keep user data filled out in the form this way + prevent browser refresh)

		// Setting the redirect function as a method of the GameState object so we can
		// call the redirect funciton from within the GameState object
  }
};
</script>