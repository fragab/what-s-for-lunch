<template>
  <div class="block">
    <transition-group name="fade" mode="out-in">
    <div class="notification is-danger" v-for="(errorMessage, index) in errorMessages" key="errors">
      <button class="delete" v-on:click.prevent="errorMessages.splice(index, 1)"></button>
      {{ errorMessage }}
    </div>
    </transition-group>
    <transition-group name="fade" mode="out-in">
    <div class="notification is-success" v-for="infoMessage in infoMessages" key="infos">
      <button class="delete" v-on:click.prevent="infoMessages = []"></button>
      {{ infoMessage }}
    </div>
    </transition-group>
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
