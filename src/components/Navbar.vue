<template>
  <nav class="nav has-shadow">
    <div class="nav-left">
      <a href="#" class="nav-item is-brand">
        <img src="../assets/sandwich.svg" class="logo"> Ça mange où ?
      </a>
    </div>
    <span class="nav-toggle" @click="mobileMenuVisible=!mobileMenuVisible">
      <span></span>
      <span></span>
      <span></span>
    </span>
    <div :class="['nav-right', 'nav-menu', {'is-active': mobileMenuVisible}]">
      <a class="nav-item is-tab is-hidden-tablet">Home</a>
      <a class="nav-item is-tab is-hidden-tablet">Mon compte</a>
      <a class="nav-item is-tab is-hidden-tablet" @click.prevent="signOut">Déconnextion</a>
    </div>
    <div class="nav-right is-hidden-mobile" v-if="userData">
      <span class="nav-item">
        <h2>{{ displayName }}</h2>
      </span>
      <span class="nav-item is-hidden-mobile" @click.prevent="signOut">
        <a class="button">Déconnexion</a>
      </span>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'navbar',
  data () {
    return {
      mobileMenuVisible: false,
      userData: null
    }
  },
  computed: {
    displayName () {
      if (this.userData && this.userData.displayName) {
        return 'Hello ' + this.userData.displayName
      }
      return 'Nom non défini'
    }
  },
  created: function () {
    this.$root.$on('signedIn', (userData) => { this.userData = userData })
    this.$root.$on('signedOut', () => { this.userData = null })
  },
  beforeDestroy: function () {
    this.$root.$off('signedIn', () => {})
  },
  methods: {
    signOut () {
      this.$root.$emit('signOut')
    }
  }
}
</script>

<style>
.logo {
  width: 100px;
  height: 100px;
}
</style>
