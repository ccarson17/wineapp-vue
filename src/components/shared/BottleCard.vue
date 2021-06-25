<template>
    <div class="bottle-card" style="display: flex">
        <div class="bottle-color shadow-sm" 
            :class="{'bottle-red': bottle.category == 'Red',
            'bottle-white': bottle.category == 'White',
            'bottle-sparkling': bottle.category == 'Sparkling / Champagne',
            'bottle-dessert': bottle.category == 'Dessert / Port / Sherry',
            'bottle-rose': bottle.category == 'Rosé'}" style="width: 5%">
        </div>
        <div class="bottle-background shadow-sm text-default" :class="{'card-blackout': cardDarken }" style="width: 95%">
            <table style="width: 100%; table-layout:fixed;">
              <tr>
                  <td class="left-col vintner-text">
                    {{bottle.vintner}}
                    <span v-if="!$v.bottle.vintner.required" class="material-icons error-text" :class="{'error-text-darken': cardDarken }">cancel</span>
                    <!-- <span v-if="!$v.bottle.vintner.required" class="error-text">Required</span> -->
                  </td>
                  <td class="right-col">
                    {{bottle.wineName}}
                    <span v-if="!$v.bottle.wineName.required" class="material-icons error-text" :class="{'error-text-darken': cardDarken }">cancel</span>
                  </td>
              <tr>
                  <td class="left-col">{{bottle.city_Town | locationFilter(bottle.state_Province, bottle.region, bottle.country)}}</td>
                  <td class="right-col">
                    {{bottle.year}}
                    <span v-if="!$v.bottle.year.required" class="material-icons error-text" :class="{'error-text-darken': cardDarken }">cancel</span>
                    <span v-if="!$v.bottle.year.validYear" class="material-icons error-text" :class="{'error-text-darken': cardDarken }">cancel</span>
                  </td>
              </tr>
              <tr>
                  <td class="left-col">
                    {{bottle.category}}
                    <span v-if="!$v.bottle.category.required" class="material-icons error-text" :class="{'error-text-darken': cardDarken }">cancel</span>
                    <span v-if="!$v.bottle.category.validCategory" class="material-icons error-text" :class="{'error-text-darken': cardDarken }">cancel</span>
                  </td>
                  <td class="right-col">
                  <img src="@/assets/baseline_star_border_black_48dp_empty.png" width="24" height="24" v-if="parseInt(bottle.user_rating) < 1">
                  <img src="@/assets/baseline_star_border_black_48dp_half.png" width="24" height="24" v-if="parseInt(bottle.user_rating) == 1">
                  <img src="@/assets/baseline_star_border_black_48dp_full.png" width="24" height="24" v-if="parseInt(bottle.user_rating) >= 2">

                  <img src="@/assets/baseline_star_border_black_48dp_empty.png" width="24" height="24" v-if="parseInt(bottle.user_rating) < 3">
                  <img src="@/assets/baseline_star_border_black_48dp_half.png" width="24" height="24" v-if="parseInt(bottle.user_rating) == 3">
                  <img src="@/assets/baseline_star_border_black_48dp_full.png" width="24" height="24" v-if="parseInt(bottle.user_rating) >= 4">

                  <img src="@/assets/baseline_star_border_black_48dp_empty.png" width="24" height="24" v-if="parseInt(bottle.user_rating) < 5">
                  <img src="@/assets/baseline_star_border_black_48dp_half.png" width="24" height="24" v-if="parseInt(bottle.user_rating) == 5">
                  <img src="@/assets/baseline_star_border_black_48dp_full.png" width="24" height="24" v-if="parseInt(bottle.user_rating) >= 6">
                  
                  <img src="@/assets/baseline_star_border_black_48dp_empty.png" width="24" height="24" v-if="parseInt(bottle.user_rating) < 7">
                  <img src="@/assets/baseline_star_border_black_48dp_half.png" width="24" height="24" v-if="parseInt(bottle.user_rating) == 7">
                  <img src="@/assets/baseline_star_border_black_48dp_full.png" width="24" height="24" v-if="parseInt(bottle.user_rating) >= 8">

                  <img src="@/assets/baseline_star_border_black_48dp_empty.png" width="24" height="24" v-if="parseInt(bottle.user_rating) < 9">
                  <img src="@/assets/baseline_star_border_black_48dp_half.png" width="24" height="24" v-if="parseInt(bottle.user_rating) == 9">
                  <img src="@/assets/baseline_star_border_black_48dp_full.png" width="24" height="24" v-if="parseInt(bottle.user_rating) == 10">
                  </td>
              </tr>
            </table>
        </div>
    </div>
</template>

<script>
import { required, helpers } from "vuelidate/lib/validators";

const validYear = (value) => !helpers.req(value) || (parseInt(value) >= (new Date().getFullYear() - 100) && parseInt(value) <= new Date().getFullYear());
const validCategory = (value) => !helpers.req(value) || 
        (value === "Red" || 
        value === "White" || 
        value === "Rosé" || 
        value === "Sparkling / Champagne" || 
        value === "Dessert / Port / Sherry");

export default {
    name: 'BottleCard',
    props: {
        bottle: {
        },
        cardDarken: {
        },
    },
    validations: {
        bottle: {
            vintner: { required },
            varietal: { required },
            wineName: { required },
            category: { required, validCategory },
            year: { required, validYear },
        }
    },
}
</script>

<style scoped>
/* .bottle-background {
  background-color: #FFFFFF;
  margin: 5px 5px 5px 0px;
  padding: 10px;
  min-width: 200px;
  width: 100%;
  border-radius: 0 15px 15px 0;
}
.bottle-card :hover {
  background-color: #DDDDDD;
} */
.bottle-color {
  background-color: lightgrey;
  margin: 5px 0px 5px 5px;
  padding: 0px;
  border-radius: 15px 0 0 15px;
  min-width: 20px;
  display: inline-block;
} 
 
.bottle-red {
  background-color: #4d0000 !important;
}
.bottle-white {
  background-color: #ffedab !important;
}
.bottle-sparkling {
  background-color: #004501 !important;
}
.bottle-dessert {
  background-color: #4e3b57 !important;
}
.bottle-rose {
  background-color: #f5dada !important;
}
.left-col {
  width: 50%;
  text-align: left;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  padding-right: 5px;
}
.right-col {
  width: 50%;
  text-align: right;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  padding-left: 5px;
}
.vintner-text {
  font-size: 18px;
  font-weight: bold;
}
.bottle-card {
  cursor: pointer;
}
a { 
  text-decoration: none;
  color: black;
}
.error-text {
    color: #dc3545;
    font-size: 24px;
}
.card-blackout {
  background-color: rgba(0,0,0,0.7);
  color: rgba(0,0,0,0.7) !important;
}

.error-text-darken {
    opacity: 0.3;
}
</style>
