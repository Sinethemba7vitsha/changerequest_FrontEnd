<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import Registration from './components/Registration.vue';
import UserDashboard from './components/User.vue';
import DeveloperDashaboard from './components/DeveloperDashaboard.vue';
import ManagerDashboard from './components/ManagerDashboard.vue';

export default {
  name: 'App',

  data: () => ({

  }),
  components:
  {
    Registration,
    UserDashboard,
    DeveloperDashaboard,
    ManagerDashboard
  }
};
</script>
