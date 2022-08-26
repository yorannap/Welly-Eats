export default {
  state() {
    return {
      places: [],
      tags: [],
      google: {
        init: false,
        service: null,
        placesFound: [],
        placesDetails: [],
        placeSearchFields: ['name', 'place_id'],
        placeDetailFields: ['opening_hours', 'rating', 'website', 'formatted_address', 'utc_offset_minutes', 'place_id'],
      },
      initComplete: false,
      iconsFoodFolder: '/icons-food/',
      requestLimiter: 500,
      loadDelay: 1
    }
  },
  mutations: {
    definePlaces(state, places) {
      state.places = places;
    },
    defineTags(state, tags) {
      tags.forEach(tag => {
        tag.Icon = state.iconsFoodFolder + tag.Icon
      });
      state.tags = tags;
    },
    initComplete(state, status) {
      state.initComplete = status;
    }
  },
  actions: {
    async init(context) {
      await context.dispatch('googleInit')
      await context.dispatch('initPlaces')
      await context.dispatch('initTags')
      context.dispatch('googleFindPlaces')
      context.dispatch('googleQueryPlaces')
      //context.dispatch('reDefinePlaces')
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
    async initTags(context) {
      return new Promise(resolve => {
        let tags = require('../../static/tags.json');
        context.commit('defineTags', tags);
        resolve();
      });
    },
    async googleFindPlaces(context) {
      return new Promise(resolve => {
        let service = context.state.google.service
        let places = context.state.places
        let placesfound = []
        let requestLimiter = () => new Promise(resolve => setTimeout(resolve, context.state.requestLimiter))
        
        // find place IDs
        let loop = async () => {
          for (let index = 0; index < places.length; index++) {
            await requestLimiter()
            let place = places[index];
            service.findPlaceFromQuery({ query: place.Name + ' Wellington', fields: context.state.google.placeSearchFields }, (results, status) => {
              console.log('Request sent')
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                placesfound.push({results, status, index})
                if(index === (places.length - 1)) {
                  context.state.google.placesFound = placesfound
                  resolve();
                }
              }
              else {
                console.log('Google fetch status:', status)
              }
            });
          }
        }
        loop()
      });
    },
    async googleQueryPlaces(context) {
      return new Promise(resolve => {
        let service = context.state.google.service
        let placeDetailFields = context.state.google.placeDetailFields
        let placesFound = context.state.google.placesFound
        let placesDetails = []
        let requestLimiter = () => new Promise(resolve => setTimeout(resolve, context.state.requestLimiter))

        // find place details
        let loop = async () => {
          for (let index = 0; index < placesFound.length; index++) {
            await requestLimiter()
            let place = placesFound[index];
            service.getDetails({
              placeId: place.results[0].place_id,
              fields: placeDetailFields
            }, (results, status) => {
              console.log('Request sent')
              // check request was successful
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                placesDetails.push(results)
                if(index === (placesFound.length - 1)) {
                  context.state.google.placesDetails = placesDetails
                  resolve();
                }
              }
              else {
                console.log('Google fetch status:', status)
              }
            })
          }
        }
        loop()
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
          let foundPlace = googlePlaces.filter(googlePlace => {
            // check if place was fetched by Google
            if(googlePlace !== null) {
              if(googlePlace.place_id === place.PlaceId) {
                return true
              }
              else {
                return false
              }
            }
          }
          )[0]
          // place not found and therefore not indexed
          if(foundPlace === undefined) {
            console.log("Google place match not found for", place.Name, "check place_id to index. Or load time was insufficient")
          }
          // place found - set values and index
          else {
            place.Rating = foundPlace.rating
            place.IsOpen = foundPlace.opening_hours.isOpen()
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
          }
          // check if all places have been checked
          if(index === (places.length - 1)) {
            context.commit('definePlaces', foundPlaces);
            resolve();
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
    },
    getTags(state) {
      return state.tags
    }
  }
}