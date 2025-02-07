import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isAuthenticated: false,
    token: null,
    userRole: '',
  },
  mutations: {
    setAuth(state, { isAuthenticated, token, userRole }) {
      state.isAuthenticated = isAuthenticated;
      state.token = token;
      state.userRole = userRole;
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      state.userId = decodedPayload.nameid; 
      state.userEmail = decodedPayload.email;
      state.userName = decodedPayload.name;
      state.userRole = decodedPayload.role;
      state.fname = decodedPayload.fname; 

    },
     clearAuth(state) {
    state.isAuthenticated = false;
    state.token = null;
    state.userId = null;  
    state.userEmail = '';
    state.userName = '';
    state.userRole = '';
  },

  },
  actions: {
   /* login({ commit }, authData) {
      return new Promise((resolve, reject) => {
        axios.post('https://localhost:7072/api/User/LoginUser', authData)
          .then(res => {
            if (res.data && res.data.token && res.data.user) {
              const token = res.data.token;
              const user = res.data.user;
              const userName = user.fname;
              const id = user.id;
              const userRole = user.role_id;

              commit('setAuth', {
                isAuthenticated: true,
                token,
                userRole,
              });
              resolve(userRole);
            } else {
              console.error("Invalid response format:", res.data);
              reject(new Error("Invalid response format. See console for details."));
            }
          })
          .catch(error => {
            console.error("Login error:", error);
            reject(error);
          });
      });
    },*/
    login({ commit }, authData) {
      return new Promise((resolve, reject) => {
        axios.post('https://localhost:7072/api/User/LoginUser', authData)
          .then(res => {
            if (res.data && res.data.token && res.data.user) {
              const token = res.data.token;
              localStorage.setItem('token', token);
              const user = res.data.user;
              const userRole = user.roles[0]; 
              commit('setAuth', {
                isAuthenticated: true,
                token,
                userRole,
              });
              resolve(userRole);
            } else {
              console.error("Invalid response format:", res.data);
              reject(new Error("Invalid response format. See console for details."));
            }
          })
          .catch(error => {
            console.error("Login error:", error);
            reject(error);
          });
      });
    },
    

    logout({ commit }) {
      commit('clearAuth');
      localStorage.removeItem('token');
    },
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    userRole: state => state.userRole,
  },
  modules: {},
});

export default store;