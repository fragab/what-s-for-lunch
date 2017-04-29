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
      <router-link to="/choice" v-if="userData" class="nav-item is-tab is-hidden-mobile">Voter</router-link>
      <router-link to="/restaurant" v-if="userData" class="nav-item is-tab is-hidden-mobile">Proposer un nouveau restaurant</router-link>
      <router-link to="/profile" v-if="userData" class="nav-item is-tab is-hidden-mobile">Mon compte</router-link>
    </div>
    <span class="nav-toggle" @click="mobileMenuVisible=!mobileMenuVisible">
      <span></span>
      <span></span>
      <span></span>
    </span>
    <transition-group mode="in-out" name="fade">
    <div :class="['nav-right', 'nav-menu', {'is-active': mobileMenuVisible}]" key="submenu">
      <div @click="hideMobileMenu()">
        <router-link v-if="userData" to="/choice" class="nav-item is-hidden-tablet">
          Voter
        </router-link>
      </div>
      <div @click="hideMobileMenu()">
        <router-link v-if="userData" to="/profile" class="nav-item is-hidden-tablet">
          <div @click="hideMobileMenu()" class="is-fullwidth">
            Mon compte
          </div>
        </router-link>
      </div>
      <div @click="hideMobileMenu()">
        <router-link v-if="userData" to="/restaurant" class="nav-item is-hidden-tablet">
          <div @click="hideMobileMenu()" class="is-fullwidth">
            Proposer un restaurant
          </div>
        </router-link>
      </div>
      <span class="nav-item is-hidden-mobile" v-if="userData">
        <h2><router-link to="/profile">{{ displayName }}</router-link></h2>
      </span>
      <router-link @click="hideMobileMenu" v-if="!userData" to="/login" class="nav-item">
         <a class="button is-primary">Connexion</a>
      </router-link>
      <span class="nav-item" @click.prevent="signOut" v-if="userData">
        <a class="button is-primary">Déconnexion</a>
      </span>
    </div>
    </transition-group>
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
      } else {
        this.userData = null
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
    hideMobileMenu () {
      this.mobileMenuVisible = false
    },
    signOut () {
      app.auth().signOut()
      .then(() => {
        this.userData = null
        this.$root.$emit('signOut')
      })
      .catch((error) => { this.$root.$emit('addError', error.message) })
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
