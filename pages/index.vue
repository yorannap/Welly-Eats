<template>
  <div id="map"></div>
</template>

<script>
//import { google } from 'googleapis';

export default {
  name: 'IndexPage',
  methods: {
    initMap() {
      var sydney = new google.maps.LatLng(-33.867, 151.195);
      var infowindow = new google.maps.InfoWindow();
      console.log(sydney) 
      console.log(infowindow) 

      let map = new google.maps.Map(
          document.getElementById('map'), {center: sydney, zoom: 15});

      var request = {
        query: 'Museum of Contemporary Art Australia',
        fields: ['name', 'geometry'],
      };

      var service = new google.maps.places.PlacesService(map);

      service.findPlaceFromQuery(request, function(results, status) {
        
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
          map.setCenter(results[0].geometry.location);
        }
      });
    }
  },
  head () {
    return {
      script: [
        {
          src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCGrczT9eisWiib5az-aMpzJDwg5MBimBE&libraries=places',
          defer: true,
          async: true,
          callback: () => { this.initMap() } 
        }
      ]
    }
  },
  mounted() {
    //const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });
        //const sheets = google.sheets({ version: 'v4', auth });
    console.log('blah')
  }
}
</script>

<style>
#map {
  height: 80vh;
}
</style>