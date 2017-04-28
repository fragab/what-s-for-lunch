<template>
  <div class="columns container">
    <div class="column is-10 is-offset-1">
      <div class="box content">
        <h1 class="has-text-centered">Proposer un restaurant</h1>
        <form @submit.prevent="save()">
          <div class="field is-horizontal">
            <div class="field-label is-medium">
              <label class="label">Nom</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input class="input is-medium" type="text" v-model="restaurant.name" />
                </div>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-medium">
              <label class="label">Sur place</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <label class="radio">
                    <input type="radio" v-model="restaurant.on_the_spot" :value="true" /> Oui
                  </label>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <label class="radio">
                    <input type="radio" v-model="restaurant.on_the_spot" :value="false" /> Non
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-medium">
              <label class="label">A emporter</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <label class="radio">
                    <input type="radio" v-model="restaurant.takeaway" :value="true" /> Oui
                  </label>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <label class="radio">
                    <input type="radio" v-model="restaurant.takeaway" :value="false" /> Non
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="field">
            <p class="control">
              <button class="button is-primary">Enregistrer</button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import firebaseApi from '../api/firebase.js'

let db = firebaseApi.db

export default {
  name: 'restaurant',
  data () {
    return {
      restaurant: this.emptyRestaurant()
    }
  },
  firebase () {
    return {
      // restaurants: db.ref('restaurants/toValidate')
      restaurants: db.ref('restaurants/validated')
    }
  },
  methods: {
    emptyRestaurant () {
      return {
        name: '',
        on_the_spot: false,
        takeaway: false
      }
    },
    save () {
      if (this.restaurant.name.trim() === '') {
        this.$root.$emit('addError', 'Un nom ?')
        return false
      }
      if (!this.restaurant.takeaway && !this.restaurant.on_the_spot) {
        this.$root.$emit('addError', 'Sur place ou a emporter ?')
        return false
      }
      this.$firebaseRefs.restaurants.push(this.restaurant)
      this.$root.$emit('addInfo', 'Restaurant proposé')
      this.restaurant = this.emptyRestaurant()
    }
  }
}
</script>
