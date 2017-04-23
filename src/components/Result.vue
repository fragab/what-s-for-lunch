<template>
  <div class="columns container">
    <div class="column is-10 is-offset-1">
      <div class="box has-text-centered">
        <ul v-if="result.length">
          <h1>Resultat</h1>
          <template v-for="wish in result">
          <li>
            {{ wish.user.displayName }} - {{ wish.restaurant.name }} - {{ wish.place }}
          </li>
          </template>
        </ul>
        <img v-else src="../assets/undefined.gif" alt="Personne n'a voté pour le moment" />
      </div>
    </div>
  </div>
</template>

<script>
import firebaseApi from '../api/firebase.js'

var moment = require('moment')

let db = firebaseApi.db

export default {
  name: 'result',
  firebase () {
    return {
      wishes: db.ref('wishes/' + moment().format('YYYY-MM-DD'))
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
