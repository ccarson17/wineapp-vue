import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';
import { VueCsvImport } from 'vue-csv-import';

Vue.use(Vuex);

export default new Vuex.Store({
    components: { VueCsvImport },
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],
    state: {
        wineApiKey: null,
        userName: null,
        userEmail: null,
        given_name: null,
        bottles: [],
        racks: [],
        currentBottles: [],
        historyBottles: [],
        unassignedBottles: [],
        lastApiRequestStatus: null,
        theme: null,
    },
    mutations: {
        updateUserProfile(state, oktaProfile) {
            // console.log(oktaProfile);
            state.wineApiKey = oktaProfile.apiUserId;
            state.userName = oktaProfile.name;
            state.userEmail = oktaProfile.email;
            state.given_name = oktaProfile.given_name;
        },
        updateBottlesFromApi(state, bottles) {
            state.bottles = bottles;
        },
        updateRacksFromApi(state, racks) {
            state.racks = racks;
        },
        updateCurrentBottlesFromApi(state, bottles) {
            state.currentBottles = bottles;
        },
        updateHistoryBottlesFromApi(state, bottles) {
            state.historyBottles = bottles;
        },
        updateUnassignedBottlesFromApi(state, bottles) {
            state.unassignedBottles = bottles;
        },
        updateLastApiResponse(state, code) {
            state.lastApiRequestStatus = code;
        },
        changeTheme(state, theme) {
            state.theme = theme;
        },
    },
    actions: {
        getWineApiKey({ commit }, claims) {
          console.log("in getWineApiKey");
          axios.get('/api/users/' + claims.sub)
            .then(result => commit('updateUserProfile', result.data))
            .catch(console.error);
            return new Promise((resolve, reject) => {
                axios.get('/api/users/' + claims.sub)
                    .then((result) => {
                            console.log("in getWineApiKey then...");
                            commit('updateUserProfile', result.data);
                            resolve(result);
                        }, error => {
                            console.log("in getWineApiKey error...");
                            reject(error);
                    });
            }) 
        },
        changeTheme({ commit }, theme) {
/*             if(state.oktaProfile && theme.name) {
                console.log("theme name " + theme.name);
                state.oktaProfile.siteTheme = theme.name;
                return new Promise((resolve, reject) => {
                    axios.post('/api/users/' + state.oktaProfile.sub, state.oktaProfile)
                        .then((result) => { */
                            commit('changeTheme', theme);
 /*                            resolve(result);
                        }, error => {
                            reject(error);
                        });
                }) 
            }  */           
        },
        getBottles({ commit, state }) {
            console.log("getting bottles...");
            const headers = { 'Cache-Control' : 'no-cache' };
            return new Promise((resolve, reject) => {
                axios.get('/api/userbottles?owner_guid=' + state.wineApiKey, { headers })
                    .then((result) => {
                            console.log("in then...");
                            commit('updateBottlesFromApi', result.data);
                            resolve(result);
                        }, error => {
                            console.log("in error...");
                            reject(error);
                    });
            }) 
        },
        getCurrentBottles({ commit, state }) {
            const headers = { 'Cache-Control' : 'no-cache' };           
            return new Promise((resolve, reject) => {
                axios.get('/api/userbottles?getCurrentOrHistory=current&orderBy=created_date desc&owner_guid=' + state.wineApiKey, { headers })
                    .then((result) => {
                        commit('updateCurrentBottlesFromApi', result.data);
                        resolve(result);
                    }, error => {
                        reject(error);
                    });
            }) 
        },
        getHistoryBottles({ commit, state }) {
            const headers = { 'Cache-Control' : 'no-cache' };
            return new Promise((resolve, reject) => {
                axios.get('/api/userbottles?getCurrentOrHistory=history&orderBy=drink_date desc&owner_guid=' + state.wineApiKey, { headers })
                    .then((result) => {
                        commit('updateHistoryBottlesFromApi', result.data);
                        resolve(result);
                    }, error => {
                        reject(error);
                    });
            }) 
        },
        getUnassignedBottles({ commit, state }) {
            const headers = { 'Cache-Control' : 'no-cache' };           
            return new Promise((resolve, reject) => {
                axios.get('/api/userbottles?getCurrentOrHistory=current&assigned=no&orderBy=created_date desc&owner_guid=' + state.wineApiKey, { headers })
                    .then((result) => {
                        commit('updateUnassignedBottlesFromApi', result.data);
                        resolve(result);
                    }, error => {
                        if(error.response.status == 404) {
                            commit('updateUnassignedBottlesFromApi', []);
                            console.clear()
                        }
                        else reject(error);
                    });
            }) 
        },
        copyBottle({ state }, bottle) {
            var bottleSize = Number(bottle.size .replace(/[^0-9.]+/g,""));
            if(bottleSize <= 30) {
                bottleSize *= 1000 // bottle size is in liters, correct to ml.
            }
            var abvNumber = Number(bottle.abv .replace(/[^0-9.]+/g,""));

            const thisBottle = {
                bottle_guid: bottle.bottle_guid,
                vintner: bottle.vintner,
                varietal: bottle.varietal,
                wineName: bottle.wineName,
                category: bottle.category,
                year: bottle.year,
                sizeinml: bottleSize ? bottleSize : 750,
                owner_guid: state.wineApiKey,
                rack_guid: null,
                rack_name: null,
                rack_col: 0,
                rack_row: 0,
                where_bought: bottle.where_bought,
                price_paid: bottle.price_paid,
                user_rating: bottle.user_rating,
                user_notes: bottle.user_notes,               
                city_Town: bottle.city_Town,
                region: bottle.region,
                state_Province: bottle.state_Province,
                country: bottle.country,
                expertRatings: bottle.expertRatings,
                abv: abvNumber,
                winemakerNotes: bottle.winemakerNotes,
                drink_date: null,
                created_date: null,
            };

            if(state.wineApiKey) {
                return new Promise((resolve, reject) => {
                    axios.post('/api/userbottlesez', thisBottle)
                        .then((result) => {
                            resolve(result);
                        }, error => {
                            reject(error);
                        });
                }) 
            }     
        },
        drinkBottle({ state }, bottle) {
            var data = JSON.stringify([
                    {"op":"replace","path":"/drink_date","value":new Date},
                    {"op":"replace","path":"/rack_name","value":null},
                    {"op":"replace","path":"/rack_guid","value":null},
                    {"op":"replace","path":"/rack_col","value":0},
                    {"op":"replace","path":"/rack_row","value":0}
                ]);
            const headers = { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json-patch+json'
            };
            if(state.wineApiKey) {
                return new Promise((resolve, reject) => {
                    axios.patch('/api/userbottles/' + bottle.guid + '?ownerId=' + state.wineApiKey, data, { headers })
                        .then((result) => {
                            resolve(result);
                        }, error => {
                            reject(error);
                        });
                })
            }
        },
        addBottleToRack({ state }, [ bottle, rackName, rackRow, rackCol ]) {
            var data = JSON.stringify([
                    {"op":"replace","path":"/rack_name","value":rackName},
                    {"op":"replace","path":"/rack_col","value":rackCol},
                    {"op":"replace","path":"/rack_row","value":rackRow}
                ]);
                console.log(rackName + "," + rackCol + "," + rackRow);
            const headers = { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json-patch+json'
            };
            if(state.wineApiKey) {
                return new Promise((resolve, reject) => {
                    axios.patch('/api/userbottles/' + bottle.guid + '?ownerId=' + state.wineApiKey, data, { headers })
                        .then((result) => {
                            resolve(result);
                        }, error => {
                            reject(error);
                        });
                })
            }
        },
        deleteBottle({ state }, bottle) {
            if(state.wineApiKey) {
                return new Promise((resolve, reject) => {
                    axios.delete('/api/userbottles/' + bottle.guid + '?ownerId=' + state.wineApiKey)
                        .then((result) => {
                            resolve(result);
                        }, error => {
                            reject(error);
                        });
                })
            }
        },
        createBottle({ state }, bottle) {
            var bottleSize = Number(bottle.size .replace(/[^0-9.]+/g,""));
            if(bottleSize <= 30) {
                bottleSize *= 1000 // bottle size is in liters, correct to ml.
            }
            var abvNumber = Number(bottle.abv .replace(/[^0-9.]+/g,""));

            const thisBottle = {
                vintner: bottle.vintner,
                varietal: bottle.varietal,
                wineName: bottle.wineName,
                category: bottle.category,
                year: bottle.year,
                sizeinml: bottleSize ? bottleSize : 750,
                owner_guid: state.wineApiKey,
                rack_guid: bottle.rack_guid,
                rack_name: bottle.rack_name,
                rack_col: bottle.col ? bottle.col : 0,
                rack_row: bottle.row ? bottle.row : 0,
                where_bought: bottle.where_bought,
                price_paid: bottle.price_paid,
                user_rating: bottle.user_rating,
                user_notes: bottle.user_notes,               
                city_Town: bottle.city_Town,
                region: bottle.region,
                state_Province: bottle.state_Province,
                country: bottle.country,
                expertRatings: bottle.expertRatings,
                abv: abvNumber,
                winemakerNotes: bottle.winemakerNotes,
            };
            if(state.wineApiKey) {
                return new Promise((resolve, reject) => {
                    axios.post('/api/userbottlesez/', thisBottle)
                        .then((result) => {
                            resolve(result);
                        }, error => {
                            reject(error);
                        });
                })
            }
        },
        updateBottle({ state }, bottle) {
            bottle.owner_guid = state.wineApiKey;

            var bottleSize = Number(bottle.size .replace(/[^0-9.]+/g,""));
            if(bottleSize <= 30) {
                bottleSize *= 1000 // bottle size is in liters, correct to ml.
            }
            var abvNumber = Number(bottle.abv .replace(/[^0-9.]+/g,""));
            if(bottle.rack_name == "Unassigned") {
                bottle.rack_name = null;
                bottle.rack_guid = null;
                bottle.rack_row = 0;
                bottle.rack_col = 0;
            }
            var data = JSON.stringify([
                {"op":"replace","path":"/vintner","value": bottle.vintner},
                {"op":"replace","path":"/varietal","value": bottle.varietal},
                {"op":"replace","path":"/wineName","value": bottle.wineName},
                {"op":"replace","path":"/category","value": bottle.category},
                {"op":"replace","path":"/year","value": bottle.year},
                {"op":"replace","path":"/sizeinml","value": bottleSize ? bottleSize : 750},
                {"op":"replace","path":"/rack_guid","value": bottle.rack_guid},
                {"op":"replace","path":"/rack_name","value": bottle.rack_name},
                {"op":"replace","path":"/rack_col","value": bottle.col ? bottle.col : 0},
                {"op":"replace","path":"/rack_row","value": bottle.row ? bottle.row : 0},
                {"op":"replace","path":"/where_bought","value": bottle.where_bought},
                {"op":"replace","path":"/price_paid","value": bottle.price_paid},
                {"op":"replace","path":"/user_rating","value": bottle.user_rating},
                {"op":"replace","path":"/user_notes","value": bottle.user_notes},
                {"op":"replace","path":"/city_Town","value": bottle.city_Town},
                {"op":"replace","path":"/region","value": bottle.region},
                {"op":"replace","path":"/state_Province","value": bottle.state_Province},
                {"op":"replace","path":"/country","value": bottle.country},
                {"op":"replace","path":"/expertRatings","value": bottle.expertRatings},
                {"op":"replace","path":"/abv","value": abvNumber},
                {"op":"replace","path":"/winemakerNotes","value": bottle.winemakerNotes}
            ]);
            const headers = { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json-patch+json'
            };
            if(state.wineApiKey) {
                return new Promise((resolve, reject) => {
                    axios.patch('/api/userbottlesez/' + bottle.guid + '?ownerId=' + state.wineApiKey, data, { headers })
                        .then((result) => {
                            resolve(result);
                        }, error => {
                            reject(error);
                        });
                })
            }
        },
        getRacks({ commit, state }) {
            const headers = { 'Cache-Control' : 'no-cache' };
            return new Promise((resolve, reject) => {
                axios.get('/api/racks?owner_guid=' + state.wineApiKey, { headers })
                    .then((result) => {
                            commit('updateRacksFromApi', result.data);
                            resolve(result);
                        }, error => {
                            reject(error);
                    });
            }) 
        },
        updateRack({ state }, rack) {
            console.log(rack);
            var data = JSON.stringify([
                {"op":"replace","path":"/rack_name","value": rack.rack_name},
                {"op":"replace","path":"/rows","value": rack.rows},
                {"op":"replace","path":"/cols","value": rack.cols}
            ]);
            const headers = { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json-patch+json'
            };
            if(state.wineApiKey) {
                return new Promise((resolve, reject) => {
                    axios.patch('/api/racks/' + rack.guid + '?ownerId=' + state.wineApiKey, data, { headers })
                        .then((result) => {
                            console.log(result.status);
                            resolve(result);
                        }, error => {
                            reject(error);
                        });
                })
            }
        },
        createRack({ state }, rack) {
            const thisRack = {
                rows: rack.rows,
                cols: rack.cols,
                owner_guid: state.wineApiKey,
                rack_name: rack.rack_name,
            };
            if(state.wineApiKey) {
                return new Promise((resolve, reject) => {
                    axios.post('/api/racks/', thisRack)
                        .then((result) => {
                            resolve(result);
                        }, error => {
                            reject(error);
                        });
                })
            }
        },
        deleteRack({ state }, rack) {
            if(state.wineApiKey) {
                return new Promise((resolve, reject) => {
                    axios.delete('/api/racks/' + rack.guid + '?ownerId=' + state.wineApiKey)
                        .then((result) => {
                            resolve(result);
                        }, error => {
                            reject(error);
                        });
                })
            }
        },
    },
    getters: {
        pullBottles(state) {
            return state.bottles;
        },
        pullCurrentBottles(state) {
            return state.currentBottles;
        },
        pullHistoryBottles(state) {
            return state.historyBottles;
        },
        getLastApiStatus(state) {
            return state.lastApiRequestStatus;
        },
    }
});