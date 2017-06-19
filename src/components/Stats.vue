<template>
  <div class="section">
    <div class="columns">
      <div class="column is-10 is-offset-1">
        <div class="box">
          <div class="content">
            <h1 class="has-text-centered">Stats</h1>
          </div>
          <restaurants-chart
            :data="result"
            :options="{responsive: true, maintainAspectRatio: true}"
            :width="1280"
            :height="500"
            >
           </restaurants-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebaseApi from '../api/firebase.js'
import RestaurantsChart from './RestaurantsChart.vue'

var moment = require('moment')

let db = firebaseApi.db
let app = firebaseApi.app

export default {
  name: 'stats',
  data () {
    return {
      loading: true,
      userData: null
    }
  },
  components: {
    RestaurantsChart
  },
  firebase () {
    return {
      wishes: {
        source: db.ref('wishes'),
        readyCallback () { this.loading = false }
      }
    }
  },
  created () {
    app.auth().onAuthStateChanged((userData) => {
      if (userData) {
        this.userData = userData
      }
    })
    this.$root.$on('signOut', () => { this.userData = null })
  },
  computed: {
    result () {
      var datas = this.wishes.reduce(
        (acc, day) => {
          for (var key in day) {
            if (key !== '.key') {
              if (!acc.hasOwnProperty(day[key].restaurant.name)) {
                acc[day[key].restaurant.name] = 1
              }
              acc[day[key].restaurant.name] += 1
            }
          }
          return acc
        }, {}
      )
      var sortable = []
      for (var restaurantName in datas) {
        sortable.push([restaurantName, datas[restaurantName]])
      }
      sortable.sort(function (a, b) {
        return b[1] - a[1]
      })

      return sortable.reduce(
        (acc, data) => {
          acc['labels'].push(data[0])
          acc['datasets'][0]['data'].push(data[1])
          return acc
        }, {
          labels: [],
          datasets: [
            {
              label: 'Votes',
              backgroundColor: '#aeca39',
              data: []
            }
          ]
        }
      )
    }
  },
  filters: {
    moment: function (date) {
      return moment(date).locale('fr').format('ddd LL')
    }
  }
}
</script>
