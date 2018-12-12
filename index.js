import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
Vue.use(VueRouter)

import App from './app/App'
import Grid from './app/views/Grid'

const router = new VueRouter({
	routes: [
		{ 
			path: '/grid', 
			component: Grid,
		}
	],
}
)

new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>',
})







