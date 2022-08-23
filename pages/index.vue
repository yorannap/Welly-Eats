<template>
  <div id="page">
    <div class="heading">
      <p class="subtitle">Wellington Eats</p>
      <h1 class="title">What's the mood?</h1>
      <div class="search">
        <input type="text" placeholder="Search...">
        <div class="dice">
          <img src="/icons/dice.svg" alt="Roll dice">
        </div>
      </div>
    </div>
    <div id="results">
      <place-card v-for="(place, id) in getPlaces" :key="id" :place="place"></place-card>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
//import { google } from 'googleapis';
import { mapGetters } from "vuex";
import PlaceCard from '../components/PlaceCard.vue'

export default {
  components: {
    PlaceCard
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
      "getPlaces"
    ])
  },
  methods: {
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