<template>
  <div class="section">
    <div class="columns">
      <div class="column is-10 is-offset-1">
        <div class="content">
          <h1>Inscription</h1>
        </div>
        <div class="box">
          <form @submit.prevent="signUpWithPassword()">
            <div class="field is-horizontal">
              <div class="field-label is-medium">
                <label class="label">Email</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input class="input is-medium" type="text" v-model="email" />
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-medium">
                <label class="label">Mot de passe</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input class="input is-medium" type="password" v-model="password" />
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-medium">
                <label class="label">Confirmer le mot de passe</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input class="input is-medium" type="password" v-model="confirmPassword" />
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <button class="button is-primary">Créer le compte</button>
            </div>
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
  name: 'signup',
  data () {
    return {
      email: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    signUpWithPassword () {
      if (this.password !== this.confirmPassword) {
        this.$root.$emit('addError', 'La confirmation du mot de passe est incorrect')
        return
      }
      app.auth().createUserWithEmailAndPassword(this.email, this.password)
      .then(() => this.signInWithPassword())
      .catch((error) => { this.$root.$emit('addError', error.message) })
    },
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
    }
  }
}
</script>
