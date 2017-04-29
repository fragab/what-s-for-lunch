<template>
  <div class="notification is-success">
    <button v-on:click.prevent="unsetRestaurant" class="delete is-medium"></button>
    <div class="container">
      <h1 class="title">
        {{ selectedRestaurant.name }}
      </h1>
    </div>
</div>
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
