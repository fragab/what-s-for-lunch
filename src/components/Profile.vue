<template>
  <div class="columns container">
    <div class="column is-10 is-offset-1">
      <div class="box has-text-centered">
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
              <label class="label">Prénom</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input class="input is-medium" type="text" v-model="firstname" />
                </div>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-medium">
              <label class="label">Nom</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input class="input is-medium" type="text" v-model="lastname" />
                </div>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-medium">
              <label class="label">Nom affiché</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  {{ displayName }}
                </div>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-medium">
              <label class="label">Changer de mot de passe</label>
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
              <label class="label">Confirmer le nouveau mot de passe</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input class="input is-medium" type="password" v-model="confirmPassword" />
                </div>
              </div>
            </div>
          </div>
          <div class="field">
            <p class="control">
              <button class="button is-primary">Mettre à jour mon profil</button>
            </p>
          </div>
        </form>
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
      confirmPassword: '',
      firstname: '',
      lastname: ''
    }
  },
  computed: {
    displayName () {
      return this.firstname + ' ' + this.lastname
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
    }
  }
}
</script>
