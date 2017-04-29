<template>
  <div id="app">
    <navbar></navbar>
    <message></message>
    <router-view></router-view>
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
  },
  data () {
    return {
      user: null
    }
  },
  created () {
    this.$root.$on('signedIn', (user) => { this.user = user })
    this.$root.$on('signedOut', () => { this.user = null })
  },
  beforeDestroy () {
    this.$root.$on('signIn', () => {})
    this.$root.$on('signedOut', () => {})
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
