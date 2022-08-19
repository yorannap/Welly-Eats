import Vuex from 'vuex';
//import { google } from 'googleapis';

const createStore = () => {
  return new Vuex.Store({
    state() {
      return {
        rotation: null,
      }
    },
    mutations: {
      definingClickedProject(state, projectValues) {
        state.clickedProject = projectValues;
      }
    },
    actions: {
      async nuxtServerInit() {
        /* const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });
        const sheets = google.sheets({ version: 'v4', auth });
        console.log(sheets, 'blah') */
        //const range = 'Places';

        /* const response = await sheets.spreadsheets.values.get({
          spreadsheetId: process.env.SHEET_ID,
          range,
        }); */

        await fetch(
          "https://apis.google.com/js/api.js",
          {
            headers: {
              "Content-Type": "application/json",
              //"x-api-key": process.env.GOOGLE_APPLICATION_CREDENTIALS
            }
          }
          )
          .then(response => response.json())
          .then(data => {
            console.log(data)
          });
      },
      init(context) {
        context.dispatch('mobileAndTabletCheck');
      }
    },
    getters: {
      clickedProject(state) {
        return state.clickedProject;
      }
    }
  })
}

export default createStore