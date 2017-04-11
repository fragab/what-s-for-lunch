<template>
  <div class="content">
    <div class="notification is-danger" v-if="errorMessage">
      <button class="delete" v-on:click.prevent="errorMessage = ''"></button>
      {{ errorMessage }}
    </div>
    <div class="notification is-success" v-if="infoMessage">
      <button class="delete" v-on:click.prevent="infoMessage = ''"></button>
      {{ infoMessage }}
    </div>
    <div class="columns container">
      <div v-if="!user" class="column is-half is-offset-one-quarter">
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
                <button class="button is-primary">Se connecter</button>
              </p>
            </div>
            <p>
              <router-link to="signup">Créer un compte</router-link>
            </p>
          </form>
        </div>
      </div>
        <div v-else class="container">
          <h2>Tu veux manger quoi aujourd'hui ?</h2>
            <transition name="fade" mode="out-in">
              <restaurants-list v-if="selectedRestaurant == null" :selected-restaurant="selectedRestaurant" :restaurants="restaurants" key="list"></restaurants-list>
            </transition>
            <restaurant-selected v-if="selectedRestaurant != null" :selected-restaurant="selectedRestaurant"></restaurant-selected>
          <template v-if="selectedRestaurant != null">
            <h2>Où ?</h2>
            <ul class="buttons">
              <template v-if="selectedRestaurant.takeaway == 'yes'">
              <template v-for="place in places">
              <li v-bind:class="{ on: selectedPlace == place['.key'] }">
                <label>
                  <input type="radio" v-model="selectedPlace" :value="place['.key']" /> {{ place.name }} <img alt="A emporter" title="A emporter" src="../assets/takeaway.svg" class="picto" />
                </label>
              </li>
              </template>
              </template><li :class="{ on: selectedPlace == 'on_the_spot' }" v-if="selectedRestaurant.on_the_spot == 'yes'">
                <label>
                  <input type="radio" v-model="selectedPlace" value="on_the_spot" /><img alt="Sur place" title="Sur place" src="../assets/on-the-spot.svg" class="picto" /> Sur place
                </label>
              </li>
            </ul>
            <br />
            <input type="submit" value="Valider mon choix" />
          </template>
          <ul class="wishes">
          <template v-for="wish in wishes">
            <li>
              {{ wish['.key'] | moment }}
              <ul>
              <template v-for="restaurant in wish.restaurants">
                <li>
                  {{ restaurant.name }} - {{ restaurant.takeaway }} <img alt="A emporter" title="A emporter" src="../assets/takeaway.svg" class="picto" /> - {{ restaurant.on_the_spot }} <img alt="Sur place" title="Sur place" src="../assets/on-the-spot.svg" class="picto" />
                </li>
              </template>
              </ul>
            </li>
          </template>
          </ul>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>

// import Firebase from 'firebase'
import restaurantsList from './RestaurantsList.vue'
import restaurantSelected from './RestaurantSelected.vue'
import firebaseApi from '../api/firebase.js'

var moment = require('moment')

let app = firebaseApi.app
let db = firebaseApi.db

export default {
  name: 'hello',
  components: {
    restaurantsList,
    restaurantSelected
  },
  firebase: {
    restaurants: db.ref('restaurants').orderByChild('name'),
    wishes: db.ref('wishes').limitToLast(1),
    places: db.ref('places').orderByChild('name')
  },
  data () {
    return {
      selectedRestaurant: null,
      selectedPlace: null,
      email: '',
      password: '',
      confirmPassword: '',
      wantsToSignUp: false,
      errorMessage: '',
      infoMessage: '',
      user: null
    }
  },
  created: function () {
    this.$root.$on('signOut', this.signOut)
    this.$on('setRestaurant', (restaurant) => this.setRestaurant(restaurant))
  },
  beforeDestroy: function () {
    this.$root.$off('signOut', this.signOut)
    this.$off('setRestaurant', (restaurant) => this.setRestaurant(restaurant))
  },
  methods: {
    moment () {
      return moment().locale('fr')
    },
    setRestaurant (restaurant) {
      this.selectedRestaurant = restaurant
      this.selectedPlace = null
    },
    signInWithPassword () {
      app.auth().signInWithEmailAndPassword(this.email, this.password)
      .then((userData) => {
        this.onSignedIn(userData)
      })
      .catch((error) => { this.$root.$emit('addError', error.message) })
      this.password = 'DTC'
    },
    signOut () {
      app.auth().signOut()
      .then(() => {
        this.user = null
        this.infoMessage = 'Déconnecté'
        this.$root.$emit('signedOut')
      })
      .catch((error) => { this.$root.$emit('addError', error.message) })
    },
    onSignedIn (userData) {
      this.user = userData
      this.$root.$emit('signedIn', userData)
    },
    setDisplayName () {
      var user = app.auth().currentUser
      user.updateProfile(
        {
          displayName: this.displayName
        }
      )
      .then(() => { this.infoMessage = 'Nom à afficher modifié' })
      .catch((error) => { this.$root.$emit('addError', error.message) })
    }
  },
  filters: {
    moment: function (date) {
      return moment(date).locale('fr').format('ddd LL')
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul.buttons {
  color: #fff;
  display: inline-block;
  border-radius: 4px 4px 4px 4px;
  -moz-border-radius: 4px 4px 4px 4px;
  -webkit-border-radius: 4px 4px 4px 4px;

}

ul li {
  padding: 5px 8px;
  margin: 0;
}

ul.buttons li {
  border-right: 1px solid #fff;
  color: #666;
  background: #aaa;
}

ul.buttons li input {
  display: none;
}

ul.buttons li.on {
  background: #00b7ea; /* Old browsers */
  background: -moz-linear-gradient(top, #00b7ea 0%, #009ec3 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(top, #00b7ea 0%,#009ec3 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom, #00b7ea 0%,#009ec3 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00b7ea', endColorstr='#009ec3',GradientType=0 ); /* IE6-9 */
  color: #fff;
}

li {
  display: inline-block;
  /*margin: 0 10px;*/
}

ul.buttons li:first-child {
  border-radius: 4px 0 0 4px;
  -moz-border-radius: 4px 0 0 4px;
  -webkit-border-radius: 4px 0 0 4px;
  padding-left: 12px;
}

ul.buttons li:last-child {
  border-radius: 0 4px 4px 0;
  -moz-border-radius: 0 4px 4px 0;
  -webkit-border-radius: 0 4px 4px 0;
  padding-right: 12px;
  border-right: none;
}

ul.buttons li:only-child {
  border-radius: 4px;
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  padding-right: 12px;
  border-right: none;
}

ul.wishes li {
  display: block;
}

input[type=submit] {
  padding: 10px;
  font-size: 1.6em;
  font-weight: bold;
}
</style>
