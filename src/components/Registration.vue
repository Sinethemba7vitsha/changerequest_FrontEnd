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
                <v-col cols="12" md="6" class="black rounded-br-xl">
                  <div style="text-align: center; padding: 180px 0;">
                    <v-card-text class="white--text">
                      <h3 class="text-center">Already Signed up?</h3>
                      <h6 class="text-center">Log in to your account so you can continue Requesting</h6>
                    </v-card-text>
                    <div class="text-center">
                      <v-btn tile outlined dark>
                        <router-link :to="{ path: '/' }">
                          Login
                        </router-link>
                      </v-btn>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card-text>
                    <h4 class="text-center">Sign Up for an Account</h4>
                  </v-card-text>
                  <v-card-text>
                    <v-row :align="'center'" justify="center">
                      <v-col cols="16" sm="12">
                        <v-text-field label="First Name" v-model="model.name" outlined dense color="yellow darken-2"
                          autocomplete="true" class="mt-1" />
                        <v-text-field label="Last Name" v-model="model.surname" outlined dense color="yellow darken-2"
                          autocomplete="true" class="mt-1" />
                        <v-select label="Department" v-model="model.departmentId" outlined dense
                          @change="onDepartmentChange" color="yellow darken-2" :items="departments"></v-select>
                        <v-select label="Job Title" v-model="model.jobTitleId" outlined dense @change="onJobTitleChange"
                          color="yellow darken-2" :items="jobTitles"></v-select>

                        <v-text-field label="Employee Number" v-model="model.employeenumber" outlined dense
                          color="yellow darken-2" autocomplete="true" class="mt-1" type="number" />


                        <v-text-field label="Email" v-model="model.email" outlined dense color="yellow darken-2"
                          autocomplete="false" />
                        <v-text-field label="Password" v-model="model.password" outlined dense color="yellow darken-2"
                          autocomplete="true" type="password" />
                        <v-btn color="yellow darken-2" dark block tile @click="registerUser">Sign up</v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import axiosInstance from '@/Services/axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      step: 1,
      model: {
        name: '',
        surname: '',
        email: '',
        password: '',
        employeenumber: null,
        departmentId: null,
        jobTitleId: null,
      },
      departments: [
        { text: 'Administration', value: 1 },
        { text: 'Diamond Trade', value: 2 },
        { text: 'Regulatory Compliance', value: 3 },
        { text: 'Finance', value: 4 },
        { text: 'Licensing', value: 5 },
      ],
      jobTitles: [
        { text: 'Staff', value: 1 },
        { text: 'Developer', value: 2 },
        { text: 'Manager', value: 3 }
      ],
      snackbar: false,
      timeout: 6000,
      successMessage: 'Registration successful! You can now log in.',
    };
  },
  mounted() {
    this.$root.$on('registration-successful', () => {
      this.showSnackbar();

    });
  },


  computed: {
    ...mapGetters(['getToken']),
  },
  methods: {
    async registerUser() {
      try {
        const response = await axiosInstance.post('User/CreateUser', {
          email: this.model.email,
          password: this.model.password,
          name: this.model.name,
          surname: this.model.surname,
          departmentId: this.model.departmentId,
          jobtitleId: this.model.jobTitleId,
          employeenumber: this.model.employeenumber
        });
        if (response.status === 200) {
          this.$emit('registration-successful');
          this.$router.push('/');
        } else {
          console.error('Registration failed:', response.data);
        }
      } catch (error) {
        console.error('An error has occurred:', error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  computed: {
    token() {
      return this.$store.state.token;
    },
  },
}
</script>

<style scoped>
.v-application .rounded-bl-xl {
  border-bottom-left-radius: 300px !important;
}

.v-application .rounded-br-xl {
  border-bottom-right-radius: 300px !important;
}
</style>
Services/axios