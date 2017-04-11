<template>
  <div id="app">
    <navbar></navbar>
    <message></message>
    <div class="container has-text-centered">
      <router-view></router-view>
    </div>
    <navfooter></navfooter>
  </div>
</template>

<script>

import navbar from './components/Navbar.vue'
import message from './components/Message.vue'
import navfooter from './components/Footer.vue'

export default {
  name: 'app',
  components: {
    navbar,
    navfooter,
    message
  }
}
</script>

<style>
#app {
  margin-top: 70px;
}

.logo {
  width: 100px;
  height: 100px;
}
</style>
