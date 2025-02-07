<template>
    <v-app>
        <v-app-bar app color="black">
            <v-toolbar-title style="color: white;">Change Request </v-toolbar-title>
            <v-spacer></v-spacer>
        </v-app-bar>

        <v-main class="ma-10 pa-20">
            <v-container fluid>
                <v-row :align="'center'" justify="center">
                    <v-col cols="12" sm="10">
                        <v-card class="elevation-6 mt-10">

                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-card-text class="mt-12">
                                        <h4 class="text-center">Login in to Your Account</h4>
                                        <h6 class="text-center grey--text">Use Your SADPMR Email and Password</h6>
                                        <v-row :align="'center'" justify="center">
                                            <v-col cols="12" sm="8">
                                                <v-text-field label="Email" v-model="email" outlined dense
                                                    color="yellow darken-2" autocomplete="true" class="mt-16" />
                                                <v-text-field label="Password" v-model="password" outlined dense
                                                    color="yellow darken-2" autocomplete="true" type="password" />
                                                <v-btn color="yellow darken-2" dark block tile @click="loginUser">Log
                                                    in</v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-col>
                                <v-col cols="12" md="6" class="black rounded-bl-xl">
                                    <div style="text-align: center; padding: 180px 0;">
                                        <v-card-text class="white--text">
                                            <h3 class="text-center">Don't Have an Account Yet?</h3>
                                            <h6 class="text-center">Let's get you all set up so you can start your
                                                Change Request</h6>
                                        </v-card-text>
                                        <div class="text-center">
                                            <v-btn tile outlined dark>
                                                <router-link :to="{ path: '/registration' }">
                                                    SIGN UP
                                                </router-link>
                                            </v-btn>
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
        <v-snackbar v-model="snackbarVisible" :timeout="timeout" color="success">
            {{ successMessage }}
            <template v-slot:action="{ attrs }">
                <v-btn text color="white" v-bind="attrs" @click="snackbarVisible = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-app>
</template>
<script>

export default {
    data() {
        return {
            email: '',
            password: '',
            error: '',
            snackbarVisible: false,
            timeout: 3000, 
            successMessage: 'Registration successful! You can now log in.',
        };
    },

    methods: {
        async loginUser() {
            if (this.isAuthenticated) {
                this.redirectBasedOnRole(this.$store.getters.userRole);
            } else {
                this.$store.dispatch('login', {
                    email: this.email,
                    password: this.password,
                }).then(() => {
                    const role = this.$store.getters.userRole;
                    this.redirectBasedOnRole(role);
                    this.showSnackbar();
                });
            }
        },
        redirectBasedOnRole(role) {
            if (role === 'user') {
                this.$router.push({ name: 'user' });
            } else if (role === 'manager') {
                this.$router.push({ name: 'manager' }).catch(() => { });
            } else if (role === 'developer') {
                this.$router.push({ name: 'developer' }).catch(() => { });
            } else {
                this.$router.push({ name: 'fourofour' }).catch(() => { });
            }
        },
        showSnackbar(message, color) {
            this.snackbarMessage = message;
            this.snackbarColor = color;
            this.snackbar = true;
        },
        closeSnackbar() {
            this.snackbar = false;
        },
        showSuccessSnackbar(message) {
            this.showSnackbar(message, 'success');
            setTimeout(() => {
                this.closeSnackbar();
            }, this.timeout);
        },
        showErrorSnackbar(message) {
            this.showSnackbar(message, 'error');
            setTimeout(() => {
                this.closeSnackbar();
            }, this.timeout);
        },



    },
    computed: {
        isAuthenticated() {
            return this.$store.getters.isAuthenticated;
        },
    },
    mounted() {
        this.$root.$on('registration-successful', () => {
            this.showSnackbar();
        });
    },
};
</script>