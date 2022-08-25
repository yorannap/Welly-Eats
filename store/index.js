import Vuex from 'vuex';
import moduleFilters from './modules/filters.js'
import moduleInit from './modules/init.js'
//import { google } from 'googleapis';

const createStore = () => {
  return new Vuex.Store({
    modules: {
      moduleInit,
      moduleFilters
    }
  })
}

export default createStore