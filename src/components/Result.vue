<template>
  <div class="section">
    <div class="columns">
      <div class="column is-10 is-offset-1">
        <div class="box">
          <div class="content">
            <h1 class="has-text-centered">Résultat</h1>
          </div>
          <div v-if="loading" class="loader has-text-centered"></div>
          <template v-else>
          <div v-if="isMonday()" class="has-text-centered">
            <img src="../assets/bk.svg" />
          </div>
          <div v-else-if="result.length" class="content">
            <ol>
              <template v-for="wish in result">
              <li>
                {{ wish.user.displayName }} - {{ wish.restaurant.name }} - {{ wish.place }} <button v-if="canVote()" class="button is-primary" @click="addVote(wish)">J'suis ben d'accord</button>
              </li>
              </template>
            </ol>
          </div>
          <div v-else class="has-text-centered">
            <img src="../assets/undefined.gif" title="Personne n'a voté pour le moment" alt="Personne n'a voté pour le moment" />
          </div>
          <div class="columns" v-if="!userData">
            <div class="column is-half is-offset-one-quarter has-text-centered">
            <router-link to="/login">
              <a class="button is-primary">Connexion</a>
            </router-link>
            </div>
          </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebaseApi from '../api/firebase.js'

var moment = require('moment')

let db = firebaseApi.db
let app = firebaseApi.app

export default {
  name: 'result',
  data () {
    return {
      loading: true,
      userData: null
    }
  },
  firebase () {
    return {
      wishes: {
        source: db.ref('wishes/' + moment().format('YYYY-MM-DD')),
        readyCallback () { this.loading = false }
      }
    }
  },
  created () {
    app.auth().onAuthStateChanged((userData) => {
      if (userData) {
        this.userData = userData
      }
    })
    this.$root.$on('signOut', () => { this.userData = null })
  },
  methods: {
    isMonday () {
      return moment().format('d') === '1'
    },
    canVote () {
      return this.userData != null && this.wishes.filter(
        wish => { return wish.user.uid === this.userData.uid }
      ).length === 0
    },
    addVote (wish) {
      if (this.canVote()) {
        this.$root.$emit('addError', 'Tu n\'es pas connecté ou tu as déjà voté !')
        return false
      }
      if (confirm(`Voter pour ${wish.restaurant.name} / ${wish.place} ?`)) {
        var newWish = {
          restaurant: wish.restaurant,
          place: wish.place
        }

        var user = {
          uid: this.userData.uid
        }
        user.displayName = this.userData.displayName || this.userData.email

        newWish.user = user

        this.$firebaseRefs.wishes.push(newWish)
        .then(() => {
          this.$root.$emit('addInfo', 'Choix sauvegardé !')
        })
        .catch((error) => { this.$root.$emit('addError', error.message) })
      }
    }
  },
  computed: {
    result () {
      // @TODO un reduce certainement
      return this.wishes.filter(
        (wish) => {
          return true
        }
      )
    }
  },
  filters: {
    moment: function (date) {
      return moment(date).locale('fr').format('ddd LL')
    }
  }
}
</script>
