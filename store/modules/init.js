export default {
  state() {
    return {
      places: [],
      google: {
        init: false,
        service: null,
        placesFound: [],
        placesDetails: [],
        placeSearchFields: ['name', 'place_id'],
        placeDetailFields: ['ALL'],
      },
      initComplete: false,
      loadDelay: 2000
    }
  },
  mutations: {
    definePlaces(state, places) {
      state.places = places;
    },
    definePlaces(state, places) {
      state.places = places;
    },
    initComplete(state, status) {
      state.initComplete = status;
    }
  },
  actions: {
    async init(context) {
      await context.dispatch('googleInit')
      await context.dispatch('initPlaces')
      await context.dispatch('googleFindPlaces')
      await context.dispatch('googleQueryPlaces')
      await context.dispatch('reDefinePlaces')
      context.commit('initComplete', true)
      context.dispatch('filterPlaces')
    },
    googleInit(context) {
      return new Promise(resolve => {
        let googleScript = document.createElement('script');
        googleScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCGrczT9eisWiib5az-aMpzJDwg5MBimBE&libraries=places';
        document.head.appendChild(googleScript);
        // once script is loaded
        googleScript.addEventListener('load', function() {
          let service = new google.maps.places.PlacesService(map);
          context.state.google.service = service
          resolve();
        });
      });
    },
    async initPlaces(context) {
      return new Promise(resolve => {
        let places = require('../../static/places.json');
        context.commit('definePlaces', places);
        resolve();
      });
    },
    async googleFindPlaces(context) {
      return new Promise(resolve => {
        let service = context.state.google.service
        let places = context.state.places
        let placesfound = []
        // find place IDs
        places.forEach((place, index) => {
          service.findPlaceFromQuery({ query: place.Name + ' Wellington', fields: context.state.google.placeSearchFields }, (results, status) => {
            placesfound.push({results, status, index})
            if(index === (places.length - 1)) {
              context.state.google.placesFound = placesfound
              setTimeout(() => {
                resolve();
              }, context.state.loadDelay / 2);
            }
          });
        });
      });
    },
    async googleQueryPlaces(context) {
      return new Promise(resolve => {
        let service = context.state.google.service
        let placeDetailFields = context.state.google.placeDetailFields
        let placesFound = context.state.google.placesFound
        let placesDetails = []

        // find place details
        placesFound.forEach((place, index) => {
          if (place.status === google.maps.places.PlacesServiceStatus.OK) {
            service.getDetails({
              placeId: place.results[0].place_id,
              fields: placeDetailFields
            }, (results, status) => {
              placesDetails.push(results)
              if(index === (placesFound.length - 1)) {
                context.state.google.placesDetails = placesDetails
                setTimeout(() => {
                  resolve();
                }, context.state.loadDelay / 2);
              }
            });
          }
        });
      });
    },
    async reDefinePlaces(context) {
      return new Promise(resolve => {
        let places = context.state.places
        let googlePlaces = context.state.google.placesDetails
        let foundPlaces = []
        // change metrics of each location to Google metrics
        places.forEach((place, index) => {
          // filter places so that only places found by Google are indexed
          let foundPlace = googlePlaces.filter(googlePlace => googlePlace.place_id === place.PlaceId)[0]
          // place not found and therefore not indexed
          if(foundPlace === undefined) {
            console.log("Google place match not found for", place.Name, "check place_id to index")
          }
          // place found - set values and index
          else {
            place.Rating = foundPlace.rating
            place.IsOpen = foundPlace.opening_hours.isOpen()
            place.Directions = foundPlace.url
            if(place.Website === undefined) {
              place.Website = foundPlace.website
            }
            if(place.FeaturedImage === undefined) {
              place.FeaturedImage = '/images/default.jpeg'
            }
            if(place.Address === undefined) {
              place.Address = foundPlace.formatted_address
            }
            // add indexed and edited place to found places
            foundPlaces.push(place)
            // once all places are indexed, push them to state
            if(index === (places.length - 1)) {
              context.commit('definePlaces', foundPlaces);
              resolve();
            }
          }
        });
      });
    }
  },
  getters: {
    getPlaces(state) {
      return state.places;
    },
    getInitComplete(state) {
      return state.initComplete
    }
  }
}