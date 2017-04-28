<template>
  <div class="columns container">
    <div class="column is-10 is-offset-1">
      <div class="box has-text-centered">
        <form @submit.prevent="updateProfile">
          <div class="field is-horizontal">
            <div class="field-label is-medium">
              <label class="label">Email</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input class="input is-medium" type="text" v-model="email" disabled="disabled" />
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
let db = firebaseApi.db

export default {
  name: 'profile',
  data () {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      userData: {
        uid: null
      },
      userInfos: {
        firstname: '',
        lastname: ''
      }
    }
  },
  beforeCreate () {
    app.auth().onAuthStateChanged((userData) => {
      if (userData) {
        this.userData = userData
        this.email = this.userData.email
        this.loadUser()
        return
      }
      this.$router.push('/')
    })
  },
  computed: {
    displayName () {
      return this.firstname + ' ' + this.lastname
    },
    firstname: {
      get () {
        return this.userInfos.firstname
      },
      set (firstname) {
        this.userInfos.firstname = firstname
      }
    },
    lastname: {
      get () {
        return this.userInfos.lastname
      },
      set (lastname) {
        this.userInfos.lastname = lastname
      }
    }
  },
  methods: {
    loadUser () {
      var uid = app.auth().currentUser.uid
      db.ref('users/' + uid)
      .once('value')
      .then((snapshot) => {
        if (snapshot.val()) {
          this.userInfos = snapshot.val()
          return
        }
      })
      .catch((error) => { this.$root.$emit('addError', error.message) })
    },
    updateProfile () {
      var user = app.auth().currentUser
      user.updateProfile(
        {
          displayName: this.displayName
        }
      )
      .then(() => { this.$root.$emit('addInfo', 'Nom à afficher modifié : ' + this.displayName) })
      .catch((error) => { this.$root.$emit('addError', error.message) })

      if (this.password !== '' && this.password === this.confirmPassword) {
        user.updatePassword(this.password)
        .then(() => this.$root.$emit('addInfo', 'Mot de passe modifié'))
        .catch((error) => { this.$root.$emit('addError', error.message) })
      }

      var uid = app.auth().currentUser.uid
      db.ref('users').child(uid).set(this.userInfos)
      .then(() => { this.$root.$emit('addInfo', 'Nom et prénom mis à jour') })
      .catch((error) => { this.$root.$emit('addError', error.message) })
    }
  }
}
</script>
