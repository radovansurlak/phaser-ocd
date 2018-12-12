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
									<v-btn large :disabled="!formFilled || gridTestDone" @click="playGame('grid')"> 
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
			ageGroup: ["10 - 15", "16 - 20", "21 - 30", "31 - 45"],
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
		dataConsent: false,
		dataConsentText: 'I agree to submit my anonymous data for academic research'
	}),
	computed: {
		formFilled() {
			return this.dataConsent && this.$refs.form.validate();
		},
		gridTestDone() {
			return localStorage.getItem('gridTestDone') === 'true' || false;
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