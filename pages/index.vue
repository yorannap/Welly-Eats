<template>
  <div id="page">
    <div class="heading">
      <p class="subtitle">Wellington Eats</p>
      <h1 class="title">What's the mood?</h1>
      <div class="search">
        <input 
          type="Search" 
          aria-label="Search place name or address..." 
          placeholder="Search place name or address..."
          :value="getFilterSearchTerm"
          @input="handleSearch"
        >
        <div class="dice" @click="rollDice">
          <img src="/icons/dice.svg" alt="Roll dice">
        </div>
      </div>
      <div class="tags">
        <filter-tag 
          v-for="(tag, id) in getAllTags" :key="id"
          :PlaceTag="tag"
        ></filter-tag>
      </div>
      <div class="order">
        <label for="order">Order by</label>
        <select name="order" id="order" @change="handleOrder($event.target.value)">
          <option value="Highest rating">Highest rating</option>
          <option value="Name">Name</option>
        </select>
      </div>
      <filter-summary></filter-summary>
    </div>
    <div class="results">
      <place-card  v-for="(place, id) in getFilteredPlaces" :key="id" :place="place"></place-card>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
//import { google } from 'googleapis';
import { mapGetters } from "vuex";
import PlaceCard from '../components/PlaceCard.vue'
import FilterTag from '../components/FilterTag.vue'
import FilterSummary from '../components/FilterSummary.vue'

export default {
  components: {
    PlaceCard,
    FilterTag,
    FilterSummary
  },
  data() {
    return {
      places: null,
      Places: [
        {
          name: 'Dragonfly Wellington',
          address: null,
          rating: null,
          phone: null,
          isOpen: null
        },
        {
          name: 'Night and Day Cuba Street',
          address: null,
          rating: null,
          phone: null,
          isOpen: null
        },
        {
          name: 'Soulshack Wellington',
          address: null,
          rating: null,
          phone: null,
          isOpen: null
        }
      ],
      service: null,
      serviceLoaded: false,
      PlaceDetailFields: ['name', 'rating', 'formatted_phone_number', 'formatted_address', 'opening_hours', 'utc_offset_minutes'],
      PlaceSearchFields: ['name', 'place_id'],
      PlaceRequest: { 
        query: 'Wellington Trawling Company Cuba',
        fields: ['name', 'place_id'],
      }
    }
  },
  computed: {
    ...mapGetters([
      "getFilteredPlaces", "getFilterSearchTerm", "getAllTags", "getActiveTags"
    ])
  },
  methods: {
    handleSearch(e) {
      this.$store.dispatch('filterSearch', e.target.value)
    },
    handleOrder(order) {
      this.$store.dispatch('filterOrder', order)
    },
    rollDice() {
      this.$store.dispatch('rollDice')
    },
    initMap() {
      this.service = new google.maps.places.PlacesService(map);
      this.serviceLoaded = true;
      this.findPlaces();
    },
    findPlaces() {
      this.Places.forEach((place, index) => {
        this.service.findPlaceFromQuery({ query: place.name, fields: this.PlaceSearchFields }, (results, status) => {
          this.queryPlace(results, status, index)
        });
      });
    },
    queryPlace(results, status, index) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.service.getDetails({
          placeId: results[0].place_id,
          fields: this.PlaceDetailFields
        }, (results, status) => {
          this.getPlaceDetails(results, status, index)
        });
      }
    },
    getPlaceDetails(place, status, index) {
      if (status == google.maps.places.PlacesServiceStatus.OK && this.serviceLoaded === true) {
        console.log(place)
        this.Places[index].name = place.name
        this.Places[index].address = place.formatted_address
        this.Places[index].rating = place.rating
        this.Places[index].phone = place.formatted_phone_number
        this.Places[index].isOpen = place.opening_hours.isOpen()
      }
    }
  },
  head () {
    return {
      script: [
        {
          src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCGrczT9eisWiib5az-aMpzJDwg5MBimBE&libraries=places',
          defer: true,
          async: true,
          callback: () => { /* this.initMap() */ } 
        }
      ]
    }
  }
}
</script>

<style>
</style>