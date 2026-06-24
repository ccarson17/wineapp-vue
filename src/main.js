import { createApp } from 'vue'
import App from './App.vue'
import { msalPlugin } from 'msal-vue'
import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from './authConfig'
import router from './router'
import store from './store'
import JQuery from 'jquery'

import "bootstrap/dist/css/bootstrap.min.css"
import * as bootstrap from 'bootstrap'
window.bootstrap = bootstrap
import moment from 'moment'

import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import Vuelidate from '@vuelidate/core'
import VuePapaParse from 'vue-papa-parse'

const options = {
    toast: true,
    position: 'bottom',
    confirmButtonColor: '#5599CC',
    timer: 4000,
    timerProgressBar: true,
    confirmButtonText: 'Dismiss',
    showConfirmButton: false,
    icon: 'success',
    padding: 25,
}

window.$ = JQuery

    ; (async () => {
        const app = createApp(App)

        const msalInstance = new PublicClientApplication(msalConfig)
        await msalInstance.initialize()

        // Handle the redirect response here!
        await msalInstance.handleRedirectPromise();

        app.use(msalPlugin, msalInstance)
        app.provide('msalInstance', msalInstance)

        app.use(router)
        app.use(store)
        app.use(VuePapaParse)
        app.use(Vuelidate)
        app.use(VueSweetalert2, options)

        app.config.globalProperties.$filters = {
            dateFormat(value) {
                if (value) {
                    var utcDateTime = moment.utc(String(value))
                    return moment(utcDateTime).local().format('MM/DD/YYYY')
                }
            },
            dateTimeFormat(value) {
                if (value) {
                    var utcDateTime = moment.utc(String(value))
                    return moment(utcDateTime).local().format('MM/DD/YYYY h:mm A')
                }
            },
            currencyFilter(value, symbol) {
                if (!isNaN(parseFloat(value))) {
                    return symbol + parseFloat(value)
                }
                else return value
            },
            percentFilter(value) {
                if (value) {
                    if (value === "%") {
                        return ""
                    }
                    else {
                        return value
                    }
                }
            },
            locationFilter(city, state, region, country) {
                if (region && state && country) {
                    if (country.toUpperCase() == "USA")
                        return region + ", " + state
                    else return region + ", " + state + ", " + country
                }
                if (region && !state && country) {
                    if (country.toUpperCase() == "USA")
                        return region + ", " + country.toUpperCase()
                    else return region + ", " + country
                }
                if (region && state && !country) return region + ", " + state
                if (city && state && country) return city + ", " + state + ", " + country
                if (city && !state && country) return city + ", " + country
                if (city && state && !country) return city + ", " + state
                if (!city && !region && !state && country) return country
                if (!city && !region && state && !country) return state
                if (!city && region && !state && !country) return region
                if (city && !region && !state && !country) return city
                if (!city && !region && state && country) return state + ", " + country
                if (!country) return country
                if (!region) return region
                if (!state) return state
                if (!city) return city
                return ""
            }
        }

        app.mount('#app')
    })()