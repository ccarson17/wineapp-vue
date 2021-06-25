<template>
    <div class="modal fade" :id="'bottleEditorModal' + index" tabindex="-1" aria-labelledby="bottleEditorModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content"  style="border-radius: 15px">
                <div class="modal-header text-default-alt header-bg-color">
                    <div class="modal-title" id="bottleEditorModalLabel" style="width: 100%">
                        <h5 style="margin: 0px; text-align: left">{{title}}</h5>
                    </div>
                    <button :id="'xEditClose' + index" type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body bg-default text-default">
                    <div class="header-bg-color divider">Bottle Info</div>

                    <div class="row row-cols-2 px-3">
                        <div class="col d-flex justify-content-center px-4 py-2" style="position: relative">
                            <label :for="'formVintner' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Vintner</label>
                            <input :id="'formVintner' + index" type="text" class="form-control input-color" v-model="bottle.vintner" :class="{ 'is-invalid': submitted && $v.bottle.vintner.$error }">
                            <div v-if="submitted && $v.bottle.vintner.$error" class="error-text">
                                <span v-if="!$v.bottle.vintner.required">Required</span>
                            </div>
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2" style="position: relative">
                            <label :for="'formVarietal' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Varietal</label>
                            <input :id="'formVarietal' + index" type="text" class="form-control input-color" v-model="bottle.varietal" :class="{ 'is-invalid': submitted && $v.bottle.varietal.$error }">
                            <div v-if="submitted && $v.bottle.varietal.$error" class="error-text">
                                <span v-if="!$v.bottle.varietal.required">Required</span>
                            </div>
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2" style="position: relative">
                            <label :for="'formWineName' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Wine Name</label>
                            <input :id="'formWineName' + index" type="text" class="form-control input-color" v-model="bottle.wineName" :class="{ 'is-invalid': submitted && $v.bottle.wineName.$error }">
                            <div v-if="submitted && $v.bottle.wineName.$error" class="error-text">
                                <span v-if="!$v.bottle.wineName.required">Required</span>
                            </div>
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2" style="position: relative">
                            <label :for="'formCategory' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Category</label>
                            <select :id="'formCategory' + index" class="form-select input-color" aria-label="Category selector" v-model="bottle.category" :class="{ 'is-invalid': submitted && $v.bottle.category.$error }">
                                <option selected disabled>Select an Option</option>
                                <option value="Red">Red</option>
                                <option value="White">White</option>
                                <option value="Rosé">Rosé</option>
                                <option value="Sparkling / Champagne">Sparkling / Champagne</option>
                                <option value="Dessert / Port / Sherry">Dessert / Port / Sherry</option>
                            </select>
                            <div v-if="submitted && $v.bottle.category.$error" class="error-text-dd">
                                <span v-if="!$v.bottle.category.required">Required</span>
                                <span v-if="!$v.bottle.category.validCategory">Invalid</span>
                            </div>
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2" style="position: relative">
                            <label :for="'formYear' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Year</label>
                            <select :id="'formYear' + index" class="form-select input-color" aria-label="Default select example" v-model="bottle.year" :class="{ 'is-invalid': submitted && $v.bottle.year.$error }">
                                <option selected disabled>Select an Option</option>
                                <option v-for="(year, idx) in years" :key="idx">{{year}}</option>
                            </select>
                            <div v-if="submitted && $v.bottle.year.$error" class="error-text-dd">
                                <span v-if="!$v.bottle.year.required">Required</span>
                                <span v-if="!$v.bottle.year.validYear">Invalid</span>
                            </div>
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formSize' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Size</label>
                            <input :id="'formSize' + index" type="text" class="form-control input-color" v-model="bottle.size">
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formABV' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">ABV</label>
                            <input :id="'formABV' + index" type="text" class="form-control input-color" v-model="bottle.abv">
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formWinemakerNotes' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Winemaker Notes</label>
                            <input :id="'formWinemakerNotes' + index" type="text" class="form-control input-color" v-model="bottle.winemakerNotes">
                        </div>
                    </div>

                    <div class="header-bg-color divider">Winery Location</div>

                    <div class="row row-cols-2 px-3">
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formRegion' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Region</label>
                            <input :id="'formRegion' + index" type="text" class="form-control input-color" v-model="bottle.region">
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formCity' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">City/Town</label>
                            <input :id="'formCity' + index" type="text" class="form-control input-color" v-model="bottle.city_Town">
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formState' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">State/Province</label>
                            <input :id="'formState' + index" type="text" class="form-control input-color" v-model="bottle.state_Province">
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formCountry' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Country</label>
                            <input :id="'formCountry' + index" type="text" class="form-control input-color" v-model="bottle.country">
                        </div>
                    </div>

                    <div class="header-bg-color divider">Your Details</div>

                    <div class="row row-cols-2 px-3">
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formRacks' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Wine Rack</label>
                            <select :id="'formRacks' + index" class="form-select input-color" aria-label="Rack selector" v-model="bottle.rack_name" @change="clearRowCol()">
                                <option>Unassigned</option>
                                <option v-for="(rack, idx) in racks" :key="idx">{{rack.rack_name}}</option>
                            </select>                      
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <div class="col d-flex" style="position: relative">
                                <label :for="'formRow' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap">Row</label>
                                <input :id="'formRow' + index" type="text" class="form-control input-color" v-model="bottle.row" :class="{ 'is-invalid': submitted && $v.bottle.row.$error }">
                                <div v-if="submitted && $v.bottle.row.$error" class="error-text-sm">
                                    <span v-if="!$v.bottle.row.required">Required</span>
                                    <span v-if="!$v.bottle.row.numeric">Numeric</span>
                                </div>
                            </div>
                            <div class="col d-flex" style="position: relative">
                                <label :for="'formCol' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap">Column</label>
                                <input :id="'formCol' + index" type="text" class="form-control input-color" v-model="bottle.col" :class="{ 'is-invalid': submitted && $v.bottle.col.$error }">
                                <div v-if="submitted && $v.bottle.col.$error" class="error-text-sm">
                                    <span v-if="!$v.bottle.col.required">Required</span>
                                    <span v-if="!$v.bottle.col.numeric">Numeric</span>
                                </div>
                            </div>
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formWhereBought' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Where Bought</label>
                            <input :id="'formWhereBought' + index" type="text" class="form-control input-color" v-model="bottle.where_bought">
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formPricePaid' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Price Paid</label>
                            <input :id="'formPricePaid' + index" type="text" class="form-control input-color" v-model="bottle.price_paid">
                        </div>                                         
                    </div>
                </div>
                <div class="modal-footer justify-content-between bg-default text-default">
                    <button v-if="modalType == 'import'" type="submit" class="btn btn-danger mr-auto" style="width: 250px" @click="importRemove()">
                        <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">delete</span><span style="font-size: 22px; margin-right: 10px;">Remove</span></div>
                    </button>                    
                    <button v-if="modalType == 'import'" type="submit" class="btn btn-primary" style="width: 250px" @click="importUpdate()" >
                        <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">save</span><span style="font-size: 22px; margin-right: 10px;">Update</span></div>
                    </button>
                    <button v-if="modalType == 'import'" type="button" class="btn btn-secondary" style="width: 250px; color: #fff;" @click="importCancel()">
                        <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">close</span><span style="font-size: 22px; margin-right: 10px;">Cancel</span></div>
                    </button>
                    <button v-if="saving != true && modalType != 'import'" type="submit" class="btn btn-primary" style="width: 250px" @click="saveAndClose()" >
                        <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">save</span><span style="font-size: 22px; margin-right: 10px;">Save & Close</span></div>
                    </button>
                    <button v-if="saving == true && modalType != 'import'" type="button" class="btn btn-primary" style="width: 250px">
                        <div class="d-flex justify-content-center"><span class="spinner-border spinner-border" style="margin-right: 10px;" role="status" aria-hidden="true"></span><span style="font-size: 22px; margin-right: 10px;">Saving...</span></div>
                    </button>                    
                    <button v-if="modalType != 'import'" type="button" class="btn btn-secondary" style="width: 250px; color: #fff;" @click="cancel()">
                        <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">close</span><span style="font-size: 22px; margin-right: 10px;">Cancel</span></div>
                    </button>
                </div>
            </div>
        </div>
    </div> 
</template>

<script>
import { required, requiredIf, numeric, helpers } from "vuelidate/lib/validators";

const validYear = (value) => !helpers.req(value) || (parseInt(value) >= (new Date().getFullYear() - 100) && parseInt(value) <= new Date().getFullYear());
const validCategory = (value) => !helpers.req(value) || 
        (value === "Red" || 
        value === "White" || 
        value === "Rosé" || 
        value === "Sparkling / Champagne" || 
        value === "Dessert / Port / Sherry");

export default {
    name: 'BottleEditor',
    computed: {
        years() {
            var d = new Date();
            var currentYear = d.getFullYear();
            var returnYears = [];
            for (var i = 0; i <= 100; i++) {
                returnYears.push(currentYear - i);
            }
            return returnYears;
        },
        racks() {
            return this.$store.state.racks;
        },
        rackName() {
            return this.bottle.rack_name ? this.bottle.rack_name : 'Unassigned';
        },
        minYear() { 
            return (new Date()).getFullYear - 100;
        },
        maxYear() {
            return (new Date()).getFullYear;
        },
    },
    created() {       
        this.$store.dispatch('getRacks');
        if(this.modalType == 'import') {
            this.submitted = true;
            // stop here if form is invalid
            this.$v.$touch();
            if (this.$v.$invalid) {
                this.saving = false;
                return;
            }
            this.submitted = false;
        }
    },
    data() {
      return {
        saving: false,
        submitted: false,
        unalteredBottle: {},
      }
    },
    validations: {
        bottle: {
            vintner: { required },
            varietal: { required },
            wineName: { required },
            category: { required, validCategory, },
            year: { required, validYear, },
            row: { numeric, required: requiredIf(function() { return this.bottle.rack_name != "Unassigned" && this.bottle.rack_name }) },
            col: { numeric, required: requiredIf(function() { return this.bottle.rack_name != "Unassigned" && this.bottle.rack_name}) },
        }
    },
    props: {
        bottle: {},
        title: {},
        modalType: {
            type: String,
            required: true,
        },
        index: {},  
    },
    methods: {
        clearRowCol() {
            this.bottle.row = null;
            this.bottle.col = null;
        },
        importUpdate() {
            this.submitted = true;
            // stop here if form is invalid
            this.$v.$touch();
            if (this.$v.$invalid) {
                this.saving = false;
                return;
            }
            this.submitted = false;
            document.getElementById('xEditClose' + this.index).click();
        },
        importCancel() {
            this.$emit('editor_event', 'cancel');
            document.getElementById('xEditClose' + this.index).click();
        },   
        importRemove() {
            this.$emit('editor_event', 'remove_' + this.bottle.import_id);
            document.getElementById('xEditClose' + this.index).click();
        },  
        saveAndClose() {
            this.saving = true;
            var context = this;

            this.submitted = true;

            // stop here if form is invalid
            this.$v.$touch();
            if (this.$v.$invalid) {
                this.saving = false;
                return;
            }

            this.submitted = false;

            // do some work to save the entry via API and to collection
            if(this.bottle.guid) {
                // existing bottle code
                this.$store.dispatch('updateBottle', this.bottle)
                    .then(function(){
                        context.$swal({
                            title: "<h3 style='color: white'>Bottle Updated.</h3>",
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
                        context.saving = false;
                        document.getElementById('xEditClose' + context.index).click();
                    }, error => {      
                        var responseDetail = error.response.status == "400" ? error.response.data : error.response.status + " (" + error.response.statusText + ")"       
                        context.$swal({
                            icon: 'error',
                            title: "<h3 style='color: white'>Update Error: Response - " + responseDetail + "</h3>",
                            background: context.$store.state.theme.swalColor,
                        });
                        context.saving = false;
                    });  
            }
            else {
                // new bottle code
                this.$store.dispatch('createBottle', this.bottle)
                    .then(function(){
                        context.$swal({
                            title: "<h3 style='color: white'>Success! A new bottle has been added to your collection.</h3>",
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
                        context.saving = false;
                        document.getElementById('xEditClose' + context.index).click();
                    }, error => {      
                        var responseDetail = error.response.status == "400" ? error.response.data : error.response.status + " (" + error.response.statusText + ")"       
                        context.$swal({
                            icon: 'error',
                            title: "<h3 style='color: white'>Create Error: Response - " + responseDetail + "</h3>",
                            background: context.$store.state.theme.swalColor,
                        });
                        context.saving = false;
                    }); 
            }
        },
        cancel() {
            document.getElementById('xEditClose' + this.index).click();
            if(this.modalType == 'current')
                this.$store.dispatch('getCurrentBottles');
            else if(this.modalType == 'history') 
                this.$store.dispatch('getHistoryBottles');
            else {
                this.$store.dispatch('getCurrentBottles');
                this.$store.dispatch('getUnassignedBottles');
            }
        }
    }
}
</script>

<style scoped>
.form-label {
     min-width: 125px;
     text-align: right;
}

.error-text {
    color: #dc3545;
    font-size: 14px;
    position: absolute;
    top: 17px;
    right: 60px;
}
.error-text-dd {
    color: #dc3545;
    font-size: 14px;
    position: absolute;
    top: 17px;
    right: 90px;
}
.error-text-sm {
    color: #dc3545;
    font-size: 14px;
    position: absolute;
    top: 8px;
    right: 35px;
}
</style>
