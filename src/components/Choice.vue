<template>
  <div>
    <section v-if="this.hasVoted()" class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Tu as choisi : {{ this.userChoice()[0].restaurant.name }} / {{ this.userChoice()[0].place }}
          </h1>
        </div>
      </div>
    </section>
    <template v-else>
    <div class="section">
      <div class="container">
        <div class="heading">
          <h1 class="title">Tu veux manger quoi aujourd'hui ?</h1>
        </div>
        <div class="content">
          <transition name="fade" mode="out-in">
          <restaurants-list v-if="selectedRestaurant == null" :selected-restaurant="selectedRestaurant" :restaurants="restaurants" key="list"></restaurants-list>
          </transition>
          <restaurant-selected v-if="selectedRestaurant != null" :selected-restaurant="selectedRestaurant"></restaurant-selected>
        </div>
      </div>
    </div>
    </template>
    <div v-if="selectedRestaurant != null" class="section">
      <div class="container">
        <div class="heading">
          <h1 class="title">Où ?</h1>
        </div>
        <div class="content">
          <div class="container is-fluid">
            <div class="columns is-multiline">
              <template v-if="selectedRestaurant.takeaway">
              <div class="column is-4" v-for="place in places">
                <a
                  v-on:click.prevent="setPlace(place.name)"
                  :class="[
                    'button',
                    'is-large',
                    {
                      'is-primary': place.name !== selectedPlace,
                      'is-success': place.name === selectedPlace
                    }
                  ]"
                  style="width: 100%;"
                >
                    {{ place.name }} <img alt="A emporter" title="A emporter" src="../assets/takeaway.svg" class="picto" />
                </a>
              </div>
              </template>
              <div class="column is-4" v-if="selectedRestaurant.on_the_spot">
                <a
                  v-on:click.prevent="setPlace('Sur place')"
                  :class="[
                    'button',
                    'is-large',
                    {
                      'is-primary': 'Sur place' !== selectedPlace,
                      'is-success': 'Sur place' === selectedPlace
                    }
                  ]"
                  style="width: 100%;"
                >
                  Sur place <img alt="Sur place" title="Sur place" src="../assets/on-the-spot.svg" class="picto" />
                </a>
              </div>
            </div>
          </div>
        </div>
      <button
          class="button is-primary"@click.prevent="saveWish()"
          :disabled="selectedPlace == null"
      >Valider mon choix</button>
      </div>
    </div>
  </div>
</template>

<script>
import restaurantsList from './RestaurantsList.vue'
import restaurantSelected from './RestaurantSelected.vue'
import firebaseApi from '../api/firebase.js'

var moment = require('moment')
var anime = require('animejs')

let app = firebaseApi.app
let db = firebaseApi.db

export default {
  name: 'choice',
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
      userData: null
    }
  },
  created () {
    app.auth().onAuthStateChanged((userData) => {
      if (userData) {
        this.userData = userData
        return
      }
      this.$router.push('/')
    })
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
    signOut () {
      this.userData = null
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
        uid: this.userData.uid
      }
      user.displayName = this.userData.displayName || this.userData.email

      var wish = {
        date: moment().format(),
        place: this.selectedPlace,
        restaurant: selectedRestaurant,
        user: user
      }

      this.$firebaseRefs.wishes.push(wish)
      .then(() => {
        this.$root.$emit('addInfo', 'Choix sauvegardé !')
        this.unsetRestaurant()
      })
      .catch((error) => { this.$root.$emit('addError', error.message) })
    },
    setPlace (place) {
      this.selectedPlace = place
    },
    userChoice () {
      return this.wishes.filter(
        (wish) => {
          return this.userData && wish.user.uid === this.userData.uid
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
