import Vuex from 'vuex';
//import { google } from 'googleapis';

const createStore = () => {
  return new Vuex.Store({
    state() {
      return {
        places: [],
        filteredPlaces: [],
        filter: {
          search: '',
          tags: [],
          order: 'Highest rating',
          canClear: false
        },
        lastDiceRoll: 0
      }
    },
    mutations: {
      setPlaces(state, places) {
        state.places = places;
      },
      setFilteredPlaces(state, places) { 
        state.filteredPlaces = places 
      },
      setFilterTags(state, tag) {
        let tags = state.filter.tags
        let index = tags.indexOf(tag);
        // If tag is already included, remove it from filters
        if (index > -1) {
          tags.splice(index, 1);
        }
        // If tag isn't already included, add it to filters
        else {
          tags.push(tag)
        }
        state.filter.tags = tags
      },
      setFilterSearch(state, search) { 
        state.filter.search = search 
      },
      setOrder(state, order) {
        state.filter.order = order 
      },
      filterPlaces(state) {
        let places = [...state.places]
        let filter = state.filter
        let filteredPlaces = places

        // SEARCH
        if(filter.search !== '') {
          let searchResults = []
          let searchTerm = filter.search.toLowerCase()
          for (let i = 0; i < places.length; i++) {
            // Search place fields
            let placeName = places[i].Name.toLowerCase();
            let placeAddress = places[i].Address.toLowerCase();
            // Check if place fields includes search term
            if (
            (placeName.includes(searchTerm)) ||
            (placeAddress.includes(searchTerm))
            ) {
              searchResults.push(places[i])
            }
          }
          // Set searchResults
          filteredPlaces = searchResults
        }

        // TAGS
        if(filter.tags.length > 0) {
          let filterTags = filter.tags
          let tagResults = filteredPlaces.filter(place =>
            place.Tags.some(tag => filterTags.indexOf(tag) >= 0)
          );
          filteredPlaces = tagResults
        }
        state.filteredPlaces = filteredPlaces
        state.filter.canClear = true
      },
      orderPlaces(state) {
        let order = state.filter.order
        let orderedList = state.filteredPlaces

        if (order === 'Highest rating') {
          orderedList.sort(function (a, b) {
            return b.Rating - a.Rating
          })
        }
        else if (order === 'Name') {
          orderedList.sort(function (a, b) {
            return a.Name.localeCompare(b.Name)
          })
        }
        state.filteredPlaces = orderedList
      },
      rollDice(state) {
        let places = state.places
        let random
        // roll until it's differnt from last roll
        while (true) {
          random = Math.floor(Math.random() * places.length);
          if (random !== state.lastDiceRoll) {            
            break;
          } 
        }
        state.lastDiceRoll = random
        state.filter.search = places[random].Name
      },
      clearFilters(state) {
        state.filter.search = ''
        state.filter.tags = []
      },
      defineCanClear(state) {
        if(state.places.length === state.filteredPlaces.length) {
          state.filter.canClear = false
        }
        else {
          state.filter.canClear = true
        }
      }
    },
    actions: {
      async nuxtServerInit() {

      },
      init(context) {
        let places = require('../static/places.json');
        context.commit('setPlaces', places);
        context.dispatch('filterPlaces')
      },
      async filterOrder({ commit }, order) {
        await commit('setOrder', order)
        await commit('orderPlaces')
      },
      async filterTags({ commit, dispatch }, tag) {
        await commit('setFilterTags', tag)
        dispatch('filterPlaces')
      },
      async filterSearch({ commit, dispatch }, search) {
        await commit('setFilterSearch', search)
        dispatch('filterPlaces')
      },
      async filterPlaces({ commit }) {
        await commit('filterPlaces')
        await commit('orderPlaces')
        await commit('defineCanClear')
      },
      async rollDice({ commit, dispatch }) {
        await commit('clearFilters')
        await commit('rollDice')
        dispatch('filterPlaces')
      },
      async clearFilters({ commit, dispatch }) {
        await commit('clearFilters')
        dispatch('filterPlaces')
      }
    },
    getters: {
      getFilteredPlaces(state) {
        return state.filteredPlaces;
      },
      getFilterSearchTerm(state) {
        return state.filter.search;
      },
      getAllTags(state) {
        let places = state.filteredPlaces
        let tags = []
        places.forEach(place => {
          place.Tags.forEach(tag => {
            if(tags.includes(tag)) {
              return
            }
            else {
              tags.push(tag)
            }
          });
        });
        return tags;
      },
      getActiveTags(state) {
        return state.filter.tags;
      },
      getCanClear(state) {
        return state.filter.canClear;
      }
    }
  })
}

export default createStore