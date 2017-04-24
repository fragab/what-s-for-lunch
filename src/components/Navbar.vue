<template>
  <nav class="nav has-shadow">
    <div class="nav-left">
      <transition-group
        appear
        v-on:appear="appear"
      >
      <div key="animation-group">
        <a href="#" class="nav-item is-brand">
          <img src="../assets/sandwich.svg" class="logo" /> Ça mange où ?
        </a>
      </div>
      </transition-group>
      <router-link to="/all" class="nav-item is-tab is-hidden-mobile">Voter</router-link>
      <router-link to="/restaurant" class="nav-item is-tab is-hidden-mobile">Proposer un restaurant</router-link>
    </div>
    <span class="nav-toggle" @click="mobileMenuVisible=!mobileMenuVisible">
      <span></span>
      <span></span>
      <span></span>
    </span>
    <div :class="['nav-right', 'nav-menu', {'is-active': mobileMenuVisible}]">
      <router-link to="/" class="nav-item is-tab is-hidden-tablet">Home</router-link>
      <router-link to="/all" class="nav-item is-tab is-hidden-tablet">Voter</router-link>
      <router-link to="/profile" class="nav-item is-tab is-hidden-tablet">Mon compte</router-link>
      <router-link to="/restaurant" class="nav-item is-tab is-hidden-tablet">Proposer un restaurant</router-link>
      <a class="nav-item is-tab is-hidden-tablet" @click.prevent="signOut">Déconnexion</a>
    </div>
    <div class="nav-right is-hidden-mobile" v-if="userData">
      <span class="nav-item">
        <h2><router-link to="/profile">{{ displayName }}</router-link></h2>
      </span>
      <span class="nav-item is-hidden-mobile" @click.prevent="signOut">
        <a class="button is-light">Déconnexion</a>
      </span>
    </div>
  </nav>
</template>

<script>
import firebaseApi from '../api/firebase.js'

let app = firebaseApi.app
var anime = require('animejs')

export default {
  name: 'navbar',
  data () {
    return {
      mobileMenuVisible: false,
      userData: null
    }
  },
  mounted () {
    app.auth().onAuthStateChanged((userData) => {
      if (userData) {
        this.userData = userData
      }
    })
  },
  computed: {
    displayName () {
      if (this.userData && this.userData.displayName) {
        return 'Hello ' + this.userData.displayName
      }
      return 'Nom non défini'
    }
  },
  methods: {
    signOut () {
      this.userData = null
      this.$root.$emit('signOut')
    },
    appear (el, done) {
      var animation = anime({
        targets: [el],
        translateX: -250,
        rotate: '2turn',
        direction: 'reverse',
        easing: 'easeInOutBack',
        duration: 2000
      })
      animation.complete = () => { done() }
    }
  }
}
</script>

<style>
.logo {
  width: 28px;
  height: 28px;
  margin: 0 8px;
}
</style>
