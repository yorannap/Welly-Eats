export default {
  state() {
    return {
      filteredPlaces: [],
      filter: {
        search: '',
        tags: [],
        order: 'Random',
        canClear: false
      },
      lastDiceRoll: 0
    }
  },
  mutations: {
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
    filterPlaces(state, initState) {
      let places = [...initState.places]
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

      if (order === 'Random') {
        orderedList.sort(function (a, b) {
          let random1 = Math.random()
          let random2 = Math.random()
          return random1 - random2
        })
      }
      else if (order === 'Rating') {
        orderedList.sort(function (a, b) {
          if(a.Rating !== undefined) {
            return b.Rating - a.Rating
          }
        })
      }
      else if (order === 'Name') {
        orderedList.sort(function (a, b) {
          return a.Name.localeCompare(b.Name)
        })
      }
      state.filteredPlaces = orderedList
    },
    rollDice(state, initState) {
      let places = initState.places
      let random
      // roll until it's differnt from last roll
      while (true) {
        random = Math.floor(Math.random() * places.length)
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
    defineCanClear(state, initState) {
      if((initState.places.length === state.filteredPlaces.length) && 
         (state.filter.tags.length === 0)) {
        state.filter.canClear = false
      }
      else {
        state.filter.canClear = true
      }
    }
  },
  actions: {
    filterOrder({ commit }, order) {
      commit('setOrder', order)
      commit('orderPlaces')
    },
    filterTags({ commit, dispatch }, tag) {
      commit('setFilterTags', tag)
      dispatch('filterPlaces')
    },
    filterSearch({ commit, dispatch }, search) {
      commit('setFilterSearch', search)
      dispatch('filterPlaces')
    },
    filterPlaces(context) {
      context.commit('filterPlaces', context.rootState.moduleInit)
      context.commit('orderPlaces')
      context.commit('defineCanClear', context.rootState.moduleInit)
    },
    rollDice(context) {
      context.commit('clearFilters')
      context.commit('rollDice', context.rootState.moduleInit)
      context.dispatch('filterPlaces')
    },
    clearFilters({ commit, dispatch }) {
      commit('clearFilters')
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
    },
    getFilterOrder(state) {
      return state.filter.order;
    }
  }
}