<template>
  <div class="content">
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
                <button :class="['button', 'is-primary', {'is-loading': isSigningIn}]">Se connecter</button>
              </p>
            </div>
            <p>
              <router-link to="signup">Créer un compte</router-link>
            </p>
          </form>
        </div>
      </div>
        <div v-else-if="this.hasVoted()">
        Tu as choisi :
          {{ this.userChoice()[0].restaurant.name }} / {{ this.userChoice()[0].place }}
        </div>
        <div v-else class="container">
          <h2>Tu veux manger quoi aujourd'hui ?</h2>
            <transition name="fade" mode="out-in">
              <restaurants-list v-if="selectedRestaurant == null" :selected-restaurant="selectedRestaurant" :restaurants="restaurants" key="list"></restaurants-list>
            </transition>
            <restaurant-selected v-if="selectedRestaurant != null" :selected-restaurant="selectedRestaurant"></restaurant-selected>
          <template v-if="selectedRestaurant != null">
            <h2>Où ?</h2>
            <div class="container is-fluid">
              <div class="columns is-multiline">
                <template v-if="selectedRestaurant.takeaway">
                <div class="column is-4" v-for="place in places">
                  <a v-on:click.prevent="setPlace(place.name)" :class="['button', 'is-large', 'is-primary']" style="width: 100%;">
                    {{ place.name }} <img alt="A emporter" title="A emporter" src="../assets/takeaway.svg" class="picto" />
                  </a>
                </div>
                </template>
                <div class="column is-4" v-if="selectedRestaurant.on_the_spot">
                  <a v-on:click.prevent="setPlace('Sur place')" :class="['button', 'is-large', 'is-primary']" style="width: 100%;">
                    Sur place <img alt="Sur place" title="Sur place" src="../assets/on-the-spot.svg" class="picto" />
                  </a>
                </div>
              </div>
            </div>
          </template>
          <br />
          <button class="button is-primary"@click.prevent="saveWish()" :disabled="selectedPlace == null">Valider mon choix</button>
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
var anime = require('animejs')

let app = firebaseApi.app
let db = firebaseApi.db

export default {
  name: 'hello',
  components: {
    restaurantsList,
    restaurantSelected
  },
  firebase () {
    return {
      restaurants: db.ref('restaurants/validated').orderByChild('name'),
      wishes: db.ref('wishes/' + moment().format('YYYY-MM-DD')),
      places: db.ref('places').orderByChild('name')
    }
  },
  data () {
    return {
      selectedRestaurant: null,
      selectedPlace: null,
      email: '',
      password: '',
      confirmPassword: '',
      wantsToSignUp: false,
      isSigningIn: false,
      user: firebaseApi.user
    }
  },
  created () {
    this.$root.$on('signOut', this.signOut)
    this.$on('setRestaurant', (restaurant) => this.setRestaurant(restaurant))
    this.$on('unsetRestaurant', () => {
      this.selectedRestaurant = null
      this.selectedPlace = null
    })
  },
  beforeDestroy () {
    this.$root.$off('signOut', this.signOut)
    this.$off('setRestaurant', (restaurant) => this.setRestaurant(restaurant))
    this.$off('unsetRestaurant', () => '')
  },
  mounted () {
    app.auth().onAuthStateChanged((userData) => {
      if (userData) {
        this.user = userData
      }
    })
  },
  methods: {
    moment () {
      return moment().locale('fr')
    },
    setRestaurant (restaurant) {
      anime({
        targets: ['.logo'],
        rotate: '1turn',
        easing: 'easeInOutQuart',
        direction: 'reverse'
      })
      this.selectedRestaurant = restaurant
      this.selectedPlace = null
    },
    unsetRestaurant () {
      this.selectedRestaurant = null
      this.selectedPlace = null
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
    },
    signOut () {
      app.auth().signOut()
      .then(() => {
        firebaseApi.setUser(null)
        this.$root.$emit('signedOut')
      })
      .catch((error) => { this.$root.$emit('addError', error.message) })
    },
    onSignedIn (userData) {
      this.$root.$emit('signedIn', userData)
      firebaseApi.setUser(userData)
      this.isSigningIn = false
    },
    saveWish () {
      if (this.hasVoted()) {
        this.$root.$emit('addError', 'Déjà voté !')
        return false
      }
      var selectedRestaurant = this.selectedRestaurant
      selectedRestaurant.uid = selectedRestaurant['.key']
      delete selectedRestaurant['.key']

      var user = {
        uid: this.user.uid
      }
      user.displayName = this.user.displayName || this.user.email
      console.log(firebaseApi.user)

      var wish = {
        date: moment().format(),
        place: this.selectedPlace,
        restaurant: selectedRestaurant,
        user: user
      }

      this.$firebaseRefs.wishes.push(wish)
      .then(() => { this.$root.$emit('addInfo', 'Choix sauvegardé !') })
      .catch((error) => { this.$root.$emit('addError', error.message) })
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
    },
    setPlace (place) {
      this.selectedPlace = place
    },
    userChoice () {
      return this.wishes.filter(
        (wish) => {
          return wish.user.uid === this.user.uid
        }
      )
    },
    hasVoted () {
      return this.userChoice().length > 0
    }
  },
  filters: {
    moment: function (date) {
      return moment(date).locale('fr').format('ddd LL')
    }
  }
}
</script>
