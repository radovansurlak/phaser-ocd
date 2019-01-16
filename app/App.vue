<template>
	<main>
		<router-view></router-view>
		<v-app v-show="isRootPage">
				<v-content >
					<v-container fluid fill-height>
						<v-layout align-center justify-center>
							<v-card>
								<v-toolbar dark color="primary">
									<v-toolbar-title>{{ title }}</v-toolbar-title>
								</v-toolbar>
								<v-card-text>
									<v-form ref="form">
										<v-select v-model="userSelection.ageGroup" :items="options.ageGroup" :rules="validationRules.age" label="Your age"
											required></v-select>
										<v-select v-model="userSelection.educationLevel" :items="options.educationLevel" :rules="validationRules.educationLevel"
											label="Your education level" required></v-select>
											<v-radio-group v-model="userSelection.gender" row :rules="validationRules.gender">
												<v-radio
													v-for="gender in options.genders"
													:key="gender"
													:label="gender"
													:value="gender"
												></v-radio>
											</v-radio-group>
										<v-checkbox v-model="dataConsent" :label="dataConsentText" required></v-checkbox>
								</v-card-text>
								<v-card-actions>
									<v-btn large :disabled="true || !formFilled" @click="playGame('ferry')">
										Play Ferry Game
									</v-btn>
									<v-spacer></v-spacer>
									<v-btn large :disabled="!formFilled || testCompletion.gridTest" @click="playGame('grid')"> 
										Play Grid Game
									</v-btn>
								</v-card-actions>
							</v-form>
						</v-layout>
					</v-container>
				</v-content>
			</v-app>
	</main>
</template>

<style lang="scss">
	 @media screen and (max-width: 450px) {
		.v-card__actions {
			flex-wrap: wrap;
			justify-content: center;
			.spacer {
				display: none;
			}
			button	{
				width: 100%;
				margin-left: 0;
				margin-right: 0;
			}
			.v-btn ~ .v-btn {
				margin-top: 17px;
			}
		}
	 }
</style>

<script>
export default {
	name: 'App',
	data: () => ({
		title: 'OCD Step 1',
		validationRules: {
			age: [
				value => !!value || 'Your age is required'
			],
			educationLevel: [
				value => !!value || 'Your education level is required'
			],
			gender: [
				value => !!value || 'Your gender is required'
			]
		},
		options: {
			genders: ['Male', 'Female'],
			ageGroup: ["0 - 6", "7 - 11", "12 - 19", "20 - 30", "31 - 40", "41 - 50", "51 - 60", "60+"],
			educationLevel: [
				"Primary education",
				"Secondary education",
				"Higher education",
			]
		},
		userSelection: {
			ageGroup: '',
			educationLevel: '',
			gender: '',
		},
		testCompletion: {

		},
		dataConsent: false,
		dataConsentText: 'I agree to submit my anonymous data for academic research'
	}),
	mounted() {
		// if (localStorage.gridTestDone) {
		// 	this.testCompletion.gridTest = true
		// }
	},
	watch:{
    $route (to, from) {
			if (from.path.match(/grid/)) {
				// this.testCompletion.gridTest = true
			}
    }
	},
	computed: {
		formFilled() {
			return this.dataConsent && this.$refs.form.validate();
		},
		isRootPage() {
			return this.$route.path === '/'
		}

	},
	methods: {
		playGame(game) {
			localStorage.setItem('userData', JSON.stringify(this.userSelection));
			this.$router.push(game);
		}
	}
};
</script>