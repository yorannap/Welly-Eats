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
      <div class="card" v-for="place in getPlaces" :key="place.Name">
        <div class="featured-image">
          <svg width="241" height="123" viewBox="0 0 241 123" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
          <pattern :id="place.FeaturedImage" patternUnits="userSpaceOnUse" width="500" height="500">
              <image :xlink:href="place.FeaturedImage" x="0" y="0" />
          </pattern>
          </defs>
          <path d="M221.788 122.064C232.833 122.064 241.956 113.049 240.145 102.153C236.019 77.3255 224.244 54.2121 206.215 36.1832C183.438 13.4062 152.546 0.610232 120.334 0.610229C88.1228 0.610227 57.2306 13.4062 34.4536 36.1831C16.4247 54.212 4.64931 77.3254 0.523372 102.153C-1.28741 113.049 7.83503 122.064 18.8807 122.064L77.1789 122.064C87.6634 122.064 95.8288 112.386 103.242 104.972C107.775 100.439 113.924 97.8922 120.334 97.8923C126.745 97.8923 132.893 100.439 137.426 104.972C144.84 112.386 153.005 122.064 163.49 122.064H221.788Z" :fill="'url(#' + place.FeaturedImage + ')'"/>
          </svg>
        </div>
        <a class="pin" :href="`https://maps.google.com/?q=${place.Name}`" target="_blank">
          <img src="/icons/pin.svg" alt="Get directions">
        </a>
        <h3>{{ place.Name }}</h3>
        <div class="details">
          <div class="isopen">
            <p v-if="place.IsOpen" class="open">Open now</p>
            <p v-else class="closed">Closed</p>
          </div>
          <div class="rating">
            <p>{{ place.Rating }} stars</p>
          </div>
        </div>
        <p>{{ place.Description }}</p>
        <a :href="place.Website" class="button" target="_blank">More details</a>
      </div>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
//import { google } from 'googleapis';
import { mapGetters } from "vuex";

export default {
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
  },
  mounted() {
    this.$store.dispatch("init");
  }
}
</script>

<style>
</style>