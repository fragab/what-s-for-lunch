<template>
  <section class="hero is-success">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          {{ selectedRestaurant.name }} <button v-on:click.prevent="unsetRestaurant" class="delete is-medium"></button>
        </h1>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'restaurant-selected',
  props: ['selectedRestaurant'],
  methods: {
    unsetRestaurant () {
      this.$parent.$emit('unsetRestaurant')
    }
  }
}
</script>
