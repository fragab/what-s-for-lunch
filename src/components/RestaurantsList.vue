<template>
  <div class="container is-fluid">
    <div class="columns is-multiline">
      <div class="column is-4" v-for="restaurant in restaurants">
        <a v-on:click.prevent="setRestaurant(restaurant)" :class="['button', 'is-large', 'is-light']" style="width: 100%;">
        {{restaurant.name}} <img alt="A emporter" title="A emporter" src="../assets/takeaway.svg" v-if="restaurant.takeaway == 'yes'" class="picto" /> <img alt="Sur place" title="Sur place" src="../assets/on-the-spot.svg" v-if="restaurant.on_the_spot == 'yes'" class="picto" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'restaurants-list',
  props: ['restaurants', 'selectedRestaurant'],
  methods: {
    setRestaurant (restaurant) {
      this.$parent.$emit('setRestaurant', restaurant)
    }
  }
}
</script>
