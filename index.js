import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
Vue.use(VueRouter)

import App from './app/App'
import Intro from './app/views/Intro'


const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

const router = new VueRouter({
	routes: [
		{ path: '/', component: Intro },
		{ path: '/bar', component: Bar }
	],
}
)

new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App }
})







