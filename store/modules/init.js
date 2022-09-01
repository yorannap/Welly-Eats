export default {
  state() {
    return {
      places: [],
      tags: [],
      google: {
        service: null,
        placeDetailFields: ['opening_hours', 'rating', 'website', 'formatted_address', 'utc_offset_minutes', 'place_id', 'name'],
      },
      initComplete: false,
      iconsFoodFolder: '/icons-food/',
      requestLimiter: 500,
      loadDelay: 0
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
    initComplete(state) {
      state.initComplete = true;
    }
  },
  actions: {
    async init(context) {
      await context.dispatch('googleInit')
      await context.dispatch('initPlaces')
      await context.dispatch('initTags')
      await context.dispatch('initComplete')
      context.dispatch('googleQueryPlaces')
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
        // establish undefined values
        places.forEach(place => {
          place.GoogleFetched = false
          place.IsOpen = undefined
          place.Rating = undefined
          place.Address = ""
          place.Website = `https://www.google.com/search?q=${place.Name}`
        });
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
    async initComplete(context) {
      return new Promise(resolve => {
        setTimeout(() => {
          context.commit('initComplete')
          resolve();
        }, context.state.loadDelay);
      });
    },
    googleQueryPlaces(context) {
      let service = context.state.google.service
      let places = context.state.places
      let requestLimiter = () => new Promise(resolve => setTimeout(resolve, context.state.requestLimiter))
      
      // find place details
      let loop = async () => {
        // if filtered places are defined, use these instead of usual places
        if(context.rootState.moduleFilters.filteredPlaces.length > 0) {
          places = context.rootState.moduleFilters.filteredPlaces
        }
        for (let index = 0; index < places.length; index++) {
          await requestLimiter()
          let place = places[index];
          // check if place has already been fetched
          if(place.GoogleFetched !== true) {
            service.getDetails({placeId: place.PlaceId, fields: context.state.google.placeDetailFields}, (results, status) => {
              // check request was successful
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                context.dispatch('reDefinePlace', results)
              }
              else {
                console.log('Google could not fetch:', status)
              }
            })
          }
        }
      }
      loop()
    },
    reDefinePlace(context, googlePlace) {
        let places = context.state.places
        places.forEach(place => {
          // place found - set values
          if(place.PlaceId === googlePlace.place_id) {
            place.GoogleFetched = true
            place.Rating = googlePlace.rating
            place.IsOpen = googlePlace.opening_hours.isOpen()
            if(place.Website === undefined) {
              place.Website = googlePlace.website
            }
            if(place.FeaturedImage === undefined) {
              place.FeaturedImage = '/images/default.jpeg'
            }
            if(place.Address === undefined) {
              place.Address = googlePlace.formatted_address
            }
            context.commit('definePlaces', places);
          }
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