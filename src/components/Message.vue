<template>
  <div class="block">
    <div class="notification is-danger" v-for="errorMessage in errorMessages">
      <button class="delete" v-on:click.prevent="errorMessages = []"></button>
      {{ errorMessage }}
    </div>
    <div class="notification is-success" v-for="infoMessage in infoMessages">
      <button class="delete" v-on:click.prevent="infoMessages = []"></button>
      {{ infoMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'message',
  data () {
    return {
      errorMessages: [],
      infoMessages: []
    }
  },
  created: function () {
    this.$root.$on('addError', (message) => this.addError(message))
  },
  beforeDestroy: function () {
    this.$root.$off('addError', this.addError)
  },
  methods: {
    addError (message) {
      this.errorMessages.push(message)
    }
  }
}
</script>
