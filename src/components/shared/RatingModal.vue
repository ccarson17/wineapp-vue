<template>
    <div class="modal fade" id="reviewModal" tabindex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content"  style="border-radius: 15px">
                <div class="modal-header text-default-alt header-bg-color">
                    <div class="modal-title" id="bottleDetailsModalLabel" style="width: 100%">
                        <table style="text-align: left; width: 100%">
                            <tr>
                            <td><h5 style="margin: 0px">{{bottle.vintner}}</h5></td>
                            <td style="text-align: right"><button id="xReviewClose" type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button></td>
                            </tr>
                            <tr>
                            <td><h5 style="margin: 0px">{{bottle.wineName}}</h5></td>
                            </tr>
                            <tr>
                            <td><span style="margin: 0px">{{bottle.city_Town | locationFilter(bottle.state_Province, bottle.region, bottle.country)}}</span></td>
                            </tr>
                        </table>
                    </div>             
                </div>
                <div class="modal-body bg-default text-default">
                    <div class="col d-flex justify-content-center px-4 py-2">
                        <label for="formRating" class="form-label fw-bold form-label text-nowrap my-auto">Your Rating</label>
                        <input type="range" class="custom-range mx-4 input-color" min="1" max="10" id="formRating" v-model="bottle.user_rating">

                        <img src="@/assets/baseline_star_border_black_48dp_empty.png" style="opacity: 0.4" width="24" height="24" v-if="!bottle.user_rating">
                        <img src="@/assets/baseline_star_border_black_48dp_empty.png" style="opacity: 0.4" width="24" height="24" v-if="!bottle.user_rating">
                        <img src="@/assets/baseline_star_border_black_48dp_empty.png" style="opacity: 0.4" width="24" height="24" v-if="!bottle.user_rating">
                        <img src="@/assets/baseline_star_border_black_48dp_empty.png" style="opacity: 0.4" width="24" height="24" v-if="!bottle.user_rating">
                        <img src="@/assets/baseline_star_border_black_48dp_empty.png" style="opacity: 0.4" width="24" height="24" v-if="!bottle.user_rating">

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
                    </div>  
                    <div class="col d-flex justify-content-center px-4 py-2">
                        <label for="formReview" class="form-label fw-bold form-label text-nowrap my-auto mx-4">Your Review</label>
                        <textarea id="formReview" name="formReview" class="form-control input-color" style="width: 42%; max-width: 400px" v-model="bottle.user_notes" rows="4" cols="50" />
                    </div>                                               
                </div>
                <div class="modal-footer bg-default text-default" style="position: relative">
                    <button v-if="saving == true" type="button" class="btn btn-primary" style="width: 175px">
                        <div class="d-flex justify-content-center"><span class="spinner-border spinner-border" style="margin-right: 10px;" role="status" aria-hidden="true"></span><span style="font-size: 22px; margin-right: 10px;">Saving...</span></div>
                    </button>
                    <button v-if="saving != true" type="submit" class="btn btn-primary" style="width: 175px" @click="saveAndClose()">
                        <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">save</span><span style="font-size: 22px; margin-right: 10px;">Save</span></div>
                    </button>
                    <button type="button" class="btn btn-secondary" style="width: 175px; color: #fff;" @click="cancel()">
                        <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">close</span><span style="font-size: 22px; margin-right: 10px;">Cancel</span></div>
                    </button>
                </div>
            </div>
        </div>
    </div> 
</template>

<script>
export default {
    name: 'RatingModal',
    props: {
        bottle: {
        },
    },
    data() {
      return {
        saving: false,
        rating: null,
        review: null,
      }
    },
    created() {
        this.rating = this.bottle.user_rating;
        this.review = this.bottle.user_notes;
    },
    methods: {
        saveAndClose() {
            var context = this;
            this.saving = true;
            if(this.bottle.guid) {
                this.$store.dispatch('updateBottle', this.bottle)
                    .then(function(){
                        context.$swal({
                            title: "<h3 style='color: white'>Bottle Updated.</h3>",
                            background: context.$store.state.theme.swalColor,
                        });
                        context.$store.dispatch('getHistoryBottles');
                        context.saving = false;
                        document.getElementById('xReviewClose').click();
                    }, error => {      
                        var responseDetail = error.response.status == "400" ? error.response.data : error.response.status + " (" + error.response.statusText + ")"       
                        context.$swal({
                            icon: 'error',
                            title: "<h3 style='color: white'>Update (Review) Error: Response - " + responseDetail + "</h3>",
                            background: context.$store.state.theme.swalColor,
                        });
                        context.saving = false;
                    });  
            }
        },
        cancel() {
            this.bottle.user_rating = this.rating;
            this.bottle.user_notes = this.review;
            document.getElementById('xReviewClose').click();
            this.$store.dispatch('getHistoryBottles');
        },
    },
}
</script>

<style scoped>  
</style>


