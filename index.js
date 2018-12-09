import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
Vue.use(VueRouter)

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

const router = new VueRouter({
	routes: [
		{ path: '/foo', component: Foo },
		{ path: '/bar', component: Bar }
	],
}
)

new Vue({
	router,
	data: () => ({
		title: 'OCD Step 1',
		validationRules: {
			age: [
				value => !!value || 'Your age is required'
			],
			educationLevel: [
				value => !!value || 'Your education level is required'
			],
		},
		options: {
			ageGroup: ["10 - 15", "16 - 20", "21 - 30", "31 - 45"],
			educationLevel: [
				"Primary education",
				"Secondary education",
				"Higher education",
			]
		},
		userSelection: {
			ageGroup: '',
			educationLevel: ''
		},
		dataConsent: false,
		dataConsentText: 'I agree to submit my anonymous data for academic research'
	}),
	computed: {
		formFilled() {
			return this.dataConsent && this.$refs.form.validate();
		}
	},
}).$mount('#app');

