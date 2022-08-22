import Vuex from 'vuex';
//import { google } from 'googleapis';

const createStore = () => {
  return new Vuex.Store({
    state() {
      return {
        places: null,
      }
    },
    mutations: {
      setPlaces(state, places) {
        state.places = places;
      }
    },
    actions: {
      async nuxtServerInit() {
      },
      init(context) {
        let places = require('../static/places.json');
        context.commit('setPlaces', places);
      }
    },
    getters: {
      getPlaces(state) {
        return state.places;
      }
    }
  })
}

export default createStore