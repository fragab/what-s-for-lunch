<template>
  <div class="block">
    <transition-group
      v-on:enter="enter"
      v-on:leave="leave"
    >
    <div class="notification is-danger" v-for="(errorMessage, index) in errorMessages" key="errors">
      <button class="delete" v-on:click.prevent="errorMessages.splice(index, 1)"></button>
      {{ errorMessage }}
    </div>
    </transition-group>
    <transition-group
      name="fade"
      mode="out-in"
      v-on:enter="enter"
      v-on:leave="leave"
    >
    <div class="notification is-success" v-for="(infoMessage, index) in infoMessages" key="infos">
      <button class="delete" v-on:click.prevent="infoMessages.splice(index, 1)"></button>
      {{ infoMessage }}
    </div>
    </transition-group>
  </div>
</template>

<script>

var anime = require('animejs')

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
    this.$root.$on('addInfo', (message) => this.addInfo(message))
  },
  beforeDestroy: function () {
    this.$root.$off('addError', this.addError)
    this.$root.$off('addInfo', this.addInfo)
  },
  methods: {
    addError (message) {
      this.errorMessages.push(message)
    },
    addInfo (message) {
      this.infoMessages.push(message)
    },
    enter (el, done) {
      var animation = anime({
        targets: [el],
        translateY: -250,
        easing: 'easeInOutBack',
        direction: 'reverse',
        duration: 600
      })
      animation.complete = () => { done() }
    },
    leave (el, done) {
      var animation = anime({
        targets: [el],
        translateY: -250,
        easing: 'easeInOutBack',
        duration: 400
      })
      animation.complete = () => { done() }
    }
  }
}
</script>
