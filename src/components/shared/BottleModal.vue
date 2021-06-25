<template>
    <div>
        <div class="modal fade" :id="'bottleDetailsModal' + index" tabindex="-1" aria-labelledby="bottleDetailsModalLabel" aria-hidden="true">
            <div id="bottleDetailsModalBox" class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content"  style="border-radius: 15px">
                <div class="modal-header text-default-alt header-bg-color">
                    <div class="modal-title" id="bottleDetailsModalLabel" style="width: 100%">
                        <table style="text-align: left; width: 100%">
                            <tr>
                            <td><h5 style="margin: 0px">{{selectedBottle.vintner}}</h5></td>
                            <td style="text-align: right"><button id="xclose" type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button></td>
                            </tr>
                            <tr>
                            <td><h5 style="margin: 0px">{{selectedBottle.wineName}}</h5></td>
                            </tr>
                            <tr>
                            <td><span style="margin: 0px">{{selectedBottle.city_Town | locationFilter(selectedBottle.state_Province, selectedBottle.region, selectedBottle.country)}}</span></td>
                            </tr>
                        </table>
                    </div>             
                </div>
                <div class="modal-body bg-default text-default">
                    <table style="text-align: left; width: 100%">
                    <tr>
                        <td>
                        <b>Year:</b> {{selectedBottle.year}}
                        </td>
                        <td v-if="selectedBottle.abv !== '%'">
                        <b>ABV:</b> {{selectedBottle.abv | percentFilter}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                        <b>Category:</b> {{selectedBottle.category}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                        <b>Bottle size:</b> {{selectedBottle.size}}
                        </td>
                    </tr>
                    <tr v-if="selectedBottle.row !== 0 && selectedBottle.col !== 0">
                        <td colspan="2">
                        <b>Location:</b> {{selectedBottle.rack_name}} (Row: {{selectedBottle.row}}, Column: {{selectedBottle.col}})
                        </td>
                    </tr>
                    <tr v-if="selectedBottle.row === 0 && selectedBottle.col === 0">
                        <td colspan="2">
                        <b>Location:</b> Unassigned
                        </td>
                    </tr>
                    <tr v-if="selectedBottle.price_paid">
                        <td>
                        <b>Price:</b> {{selectedBottle.price_paid | currencyFilter("$")}}
                        </td>
                    </tr>
                    <tr v-if="selectedBottle.where_bought">  
                        <td colspan="2">
                        <b>Purchased from:</b> {{selectedBottle.where_bought}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                        <b>Added date:</b> {{selectedBottle.created_date | dateFormat}}
                        </td>
                    </tr>
                    <tr v-if="modalType == 'history'">
                        <td colspan="2">
                        <b>Drink date:</b> {{selectedBottle.drink_date | dateFormat}}
                        </td>
                    </tr>
                    <tr v-if="selectedBottle.user_notes">
                        <td colspan="2">
                        <b>Your notes:</b> {{selectedBottle.user_notes}}
                        </td>
                    </tr>
<!--                     <tr>
                        <td colspan="2">
                        <b>Owner GUID:</b> {{selectedBottle.owner_guid}}
                        </td>
                    </tr> -->
                    <tr v-if="selectedBottle.user_rating">
                        <td colspan="2">
                        <b>Your rating:  </b>
                        <img src="@/assets/baseline_star_border_black_48dp_empty.png" width="24" height="24" v-if="parseInt(selectedBottle.user_rating) < 1">
                        <img src="@/assets/baseline_star_border_black_48dp_half.png" width="24" height="24" v-if="parseInt(selectedBottle.user_rating) == 1">
                        <img src="@/assets/baseline_star_border_black_48dp_full.png" width="24" height="24" v-if="parseInt(selectedBottle.user_rating) >= 2">

                        <img src="@/assets/baseline_star_border_black_48dp_empty.png" width="24" height="24" v-if="parseInt(selectedBottle.user_rating) < 3">
                        <img src="@/assets/baseline_star_border_black_48dp_half.png" width="24" height="24" v-if="parseInt(selectedBottle.user_rating) == 3">
                        <img src="@/assets/baseline_star_border_black_48dp_full.png" width="24" height="24" v-if="parseInt(selectedBottle.user_rating) >= 4">

                        <img src="@/assets/baseline_star_border_black_48dp_empty.png" width="24" height="24" v-if="parseInt(selectedBottle.user_rating) < 5">
                        <img src="@/assets/baseline_star_border_black_48dp_half.png" width="24" height="24" v-if="parseInt(selectedBottle.user_rating) == 5">
                        <img src="@/assets/baseline_star_border_black_48dp_full.png" width="24" height="24" v-if="parseInt(selectedBottle.user_rating) >= 6">
                        
                        <img src="@/assets/baseline_star_border_black_48dp_empty.png" width="24" height="24" v-if="parseInt(selectedBottle.user_rating) < 7">
                        <img src="@/assets/baseline_star_border_black_48dp_half.png" width="24" height="24" v-if="parseInt(selectedBottle.user_rating) == 7">
                        <img src="@/assets/baseline_star_border_black_48dp_full.png" width="24" height="24" v-if="parseInt(selectedBottle.user_rating) >= 8">

                        <img src="@/assets/baseline_star_border_black_48dp_empty.png" width="24" height="24" v-if="parseInt(selectedBottle.user_rating) < 9">
                        <img src="@/assets/baseline_star_border_black_48dp_half.png" width="24" height="24" v-if="parseInt(selectedBottle.user_rating) == 9">
                        <img src="@/assets/baseline_star_border_black_48dp_full.png" width="24" height="24" v-if="parseInt(selectedBottle.user_rating) == 10">                  </td>
                    </tr>
                    </table>
                </div>
                <div class="modal-footer bg-default" style="align-items: center">
                    <table style="width: 100%">
                    <tr>
                        <td style="padding-bottom: 15px; width: 50%">
                            <button type="button" class="btn btn-primary" style="width: 95%" v-if="modalType != 'history'" @click="drinkBottle()">
                                <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">wine_bar</span><span style="font-size: 22px; margin-right: 10px;">Drink!</span></div>
                            </button>
                            <button type="button" class="btn btn-primary" style="width: 95%" v-if="modalType == 'history'" data-bs-toggle="modal" data-bs-target="#reviewModal">
                            <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">stars</span><span style="font-size: 22px; margin-right: 10px;">Rate</span></div>
                            </button>
                        </td>
                        <td style="padding-bottom: 15px; width: 50%">
                            <button type="button" class="btn btn-primary" style="width: 95%" @click="copyBottle()">
                                <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">content_copy</span><span style="font-size: 22px; margin-right: 10px;">Copy</span></div>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 50%">
                            <button type="button" class="btn btn-primary" style="width: 95%" data-bs-toggle="modal" :data-bs-target="'#bottleEditorModal' + index">
                                <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">create</span><span style="font-size: 22px; margin-right: 10px;">Edit</span></div>
                            </button>
                        </td>
                        <td style="width: 50%">
                            <button type="button" class="btn btn-primary" style="width: 95%" v-if="modalType != 'history'" data-bs-toggle="modal" data-bs-target="#locateModal">
                                <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">place</span><span style="font-size: 22px; margin-right: 10px;">Locate</span></div>
                            </button>
                            <button type="button" class="btn btn-primary" style="width: 95%" v-if="modalType == 'history'" @click="deleteBottle()">
                            <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">delete</span><span style="font-size: 22px; margin-right: 10px;">Delete</span></div>
                            </button>
                        </td>
<!--                         <td style="width: 50%">
                            <button type="button" class="btn btn-primary" style="width: 95%" @click="showAlertFunc()">
                                <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">create</span><span style="font-size: 22px; margin-right: 10px;">Test Button</span></div>
                            </button>
                        </td> -->
                    </tr>
                    </table>
                </div>
                </div>
            </div>
        </div> 
        <LocateModal :bottle="selectedBottle" />
        <RatingModal :bottle="selectedBottle" />
    </div>
</template>

<script>
import LocateModal from '@/components/shared/LocateModal';
import RatingModal from '@/components/shared/RatingModal';

export default {
    name: 'BottleModal',
    components: {
        LocateModal,
        RatingModal,
    },
    props: {
        selectedBottle: {
            vintner: {},
            wineName: {},
            region: {},
        },
        modalType: {
            type: String,
            required: true,
        },
        index: {
        },
    },
    data() {
      return {
          showAlert: false,
      }
    },
    methods: {
        copyBottle() {
            var context = this;
            this.$store.dispatch('copyBottle', this.selectedBottle)
                .then(function(){
                    context.$swal({
                        title: "<h3 style='color: white'>Success! A new copy of this bottle has been added to your collection.</h3>",
                        background: context.$store.state.theme.swalColor,
                    });
                    if(context.modalType == 'current')
                        context.$store.dispatch('getCurrentBottles');
                    else if(context.modalType == 'history') 
                        context.$store.dispatch('getHistoryBottles');
                    else {
                        context.$store.dispatch('getCurrentBottles');
                        context.$store.dispatch('getUnassignedBottles');
                    }
                    document.getElementById('xclose').click();
                }, error => {        
                    var responseDetail = error.response.status == "400" ? error.response.data : error.response.status + " (" + error.response.statusText + ")"            
                    context.$swal({
                        icon: 'error',
                        title: "<h3 style='color: white'>Copy Error: API response - " + responseDetail + "</h3>",
                        background: context.$store.state.theme.swalColor,
                    });
                });  
        },
        drinkBottle() {
            var context = this;
            this.$store.dispatch('drinkBottle', this.selectedBottle)
                .then(function(){
                    context.$swal({
                        title: "<h3 style='color: white'>Cheers! You can use the History page to add a review and score for this bottle.</h3>",
                        background: context.$store.state.theme.swalColor,
                    });
                    if(context.modalType == 'current')
                        context.$store.dispatch('getCurrentBottles');
                    else if(context.modalType == 'history') 
                        context.$store.dispatch('getHistoryBottles');
                    else {
                        context.$store.dispatch('getCurrentBottles');
                        context.$store.dispatch('getUnassignedBottles');
                    }
                    document.getElementById('xclose').click();
                }, error => {   
                    var responseDetail = error.response.status == "400" ? error.response.data : error.response.status + " (" + error.response.statusText + ")"            
                    context.$swal({
                        icon: 'error',
                        title: "<h3 style='color: white'>Drink Error: API response - " + responseDetail + "</h3>",
                        background: context.$store.state.theme.swalColor,
                    });
                }); 
        },
        deleteBottle() {
            var context = this;
            this.$store.dispatch('deleteBottle', this.selectedBottle)
                .then(response => {
                        console.log(response);
                        context.$swal({
                            title: "<h3 style='color: white'>Bottle Deleted</h3>",
                            background: context.$store.state.theme.swalColor,
                        });
                        if(context.modalType == 'current')
                            context.$store.dispatch('getCurrentBottles');
                        else 
                            context.$store.dispatch('getHistoryBottles');
                        document.getElementById('xclose').click();
                }, error => {     
                    console.log(error.response);        
                    context.$swal({
                        icon: 'error',
                        title: "<h3 style='color: white'>Delete Error: API response - " + error.response.status + " (" + error.response.statusText + ")</h3>",
                        background: context.$store.state.theme.swalColor,
                    });
                });           
        },
    },
}
</script>

<style scoped>
.swal2-border-radius {
    -webkit-border-radius: 0 !important;
    -moz-border-radius: 0 !important;
    border-radius: 0 !important;
}
</style>
