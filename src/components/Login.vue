<template>
  <div class="content">
    <div class="columns container">
      <div class="column is-half is-offset-one-quarter">
        <div class="box has-text-centered">
          <h1>Connexion</h1>
          <form @submit.prevent="signInWithPassword()">
            <div class="field">
              <div class="control">
                <input type="text" placeholder="email" class="input is-medium" v-model="email" />
              </div>
            </div>
            <div class="field">
              <p class="control">
                <input type="password" placeholder="password" class="input is-medium" v-model="password" />
              </p>
            </div>
            <div class="field">
              <p class="control">
                <button :class="['button', 'is-primary', {'is-loading': isSigningIn}]">Se connecter</button>
              </p>
            </div>
            <p>
              <router-link to="signup">Créer un compte</router-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebaseApi from '../api/firebase.js'

let app = firebaseApi.app

export default {
  name: 'login',
  data () {
    return {
      email: '',
      password: '',
      isSigningIn: false,
      userData: null
    }
  },
  created () {
    this.$root.$on('signOut', this.signOut)
  },
  beforeDestroy () {
    this.$root.$off('signOut', this.signOut)
  },
  mounted () {
    app.auth().onAuthStateChanged((userData) => {
      if (userData) {
        this.userData = userData
      }
    })
  },
  methods: {
    signInWithPassword () {
      this.isSigningIn = true
      app.auth().signInWithEmailAndPassword(this.email, this.password)
      .then((userData) => {
        this.onSignedIn(userData)
      })
      .catch((error) => {
        this.$root.$emit('addError', error.message)
        this.isSigningIn = false
      })
      this.password = ''
    },
    signOut () {
      app.auth().signOut()
      .then(() => {
        this.userData = null
      })
      .catch((error) => { this.$root.$emit('addError', error.message) })
    },
    onSignedIn (userData) {
      this.$root.$emit('signedIn', userData)
      this.isSigningIn = false
      this.$router.push('/')
    }
  }
}
</script>
