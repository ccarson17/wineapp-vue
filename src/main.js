import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import JQuery from 'jquery'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import moment from 'moment';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Vuelidate from 'vuelidate'
import VuePapaParse from 'vue-papa-parse'

Vue.use(VuePapaParse);
Vue.use(Vuelidate);
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
};
Vue.use(VueSweetalert2, options);
Vue.config.productionTip = false;
Vue.filter('dateFormat', function(value) {
  if (value) {
    var utcDateTime = moment.utc(String(value));
    return moment(utcDateTime).local().format('MM/DD/YYYY');
  }
});
Vue.filter('dateTimeFormat', function(value) {
  if (value) {
    var utcDateTime = moment.utc(String(value));
    return moment(utcDateTime).local().format('MM/DD/YYYY h:mm A');
  }
});
Vue.filter('currencyFilter', function(value, symbol) {
  if (!isNaN(parseFloat(value))) {
    return symbol + parseFloat(value);
  }
  else return value;
});
Vue.filter('percentFilter', function(value) {
  if(value) {
    if(value === "%") {
      return "";
    }
    else {
      return value;
    }
  }
});
Vue.filter('locationFilter', function(city, state, region, country) {
  if(region && state && country) {
    if(country.toUpperCase() == "USA")
      return region + ", " + state;
    else return region + ", " + state + ", " + country;
  }
  if(region && !state && country) {
    if(country.toUpperCase() == "USA")
      return region + ", " + country.toUpperCase();
    else return region + ", " + country;
  }
  if(region && state && !country) return region + ", " + state;
  if(city && state && country) return city + ", " + state + ", " + country;
  if(city && !state && country) return city + ", " + country;
  if(city && state && !country) return city + ", " + state;
  if(!city && !region && !state && country) return country;
  if(!city && !region && state && !country) return state;
  if(!city && region && !state && !country) return region;
  if(city && !region && !state && !country) return city;
  if(!city && !region && state && country) return state + ", " + country;
  if(!country) return country;
  if(!region) return region;
  if(!state) return state;
  if(!city) return city;
  return "";
});

window.$ = JQuery;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
