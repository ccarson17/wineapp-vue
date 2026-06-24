<template>
    <div class="modal fade" :id="'bottleEditorModal' + index" tabindex="-1" aria-labelledby="bottleEditorModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content" style="border-radius: 15px">
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
                            <input :id="'formVintner' + index" type="text" class="form-control input-color" v-model="localBottle.vintner" :class="{ 'is-invalid': submitted && v$.localBottle.vintner.$error }">
                            <div v-if="submitted && v$.localBottle.vintner.$error" class="error-text">
                                <span v-if="!v$.localBottle.vintner.required">Required</span>
                            </div>
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2" style="position: relative">
                            <label :for="'formVarietal' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Varietal</label>
                            <input :id="'formVarietal' + index" type="text" class="form-control input-color" v-model="localBottle.varietal" :class="{ 'is-invalid': submitted && v$.localBottle.varietal.$error }">
                            <div v-if="submitted && v$.localBottle.varietal.$error" class="error-text">
                                <span v-if="!v$.localBottle.varietal.required">Required</span>
                            </div>
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2" style="position: relative">
                            <label :for="'formWineName' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Wine Name</label>
                            <input :id="'formWineName' + index" type="text" class="form-control input-color" v-model="localBottle.wineName" :class="{ 'is-invalid': submitted && v$.localBottle.wineName.$error }">
                            <div v-if="submitted && v$.localBottle.wineName.$error" class="error-text">
                                <span v-if="!v$.localBottle.wineName.required">Required</span>
                            </div>
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2" style="position: relative">
                            <label :for="'formCategory' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Category</label>
                            <select :id="'formCategory' + index" class="form-select input-color" aria-label="Category selector" v-model="localBottle.category" :class="{ 'is-invalid': submitted && v$.localBottle.category.$error }">
                                <option selected disabled>Select an Option</option>
                                <option value="Red">Red</option>
                                <option value="White">White</option>
                                <option value="Rosé">Rosé</option>
                                <option value="Sparkling / Champagne">Sparkling / Champagne</option>
                                <option value="Dessert / Port / Sherry">Dessert / Port / Sherry</option>
                            </select>
                            <div v-if="submitted && v$.localBottle.category.$error" class="error-text-dd">
                                <span v-if="!v$.localBottle.category.required">Required</span>
                                <span v-if="!v$.localBottle.category.validCategory">Invalid</span>
                            </div>
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2" style="position: relative">
                            <label :for="'formYear' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Year</label>
                            <select :id="'formYear' + index" class="form-select input-color" aria-label="Default select example" v-model="localBottle.year" :class="{ 'is-invalid': submitted && v$.localBottle.year.$error }">
                                <option selected disabled>Select an Option</option>
                                <option v-for="(year, idx) in years" :key="idx">{{year}}</option>
                            </select>
                            <div v-if="submitted && v$.localBottle.year.$error" class="error-text-dd">
                                <span v-if="!v$.localBottle.year.required">Required</span>
                                <span v-if="!v$.localBottle.year.validYear">Invalid</span>
                            </div>
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formSize' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Size</label>
                            <input :id="'formSize' + index" type="text" class="form-control input-color" v-model="localBottle.size">
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formABV' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">ABV</label>
                            <input :id="'formABV' + index" type="text" class="form-control input-color" v-model="localBottle.abv">
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formWinemakerNotes' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Winemaker Notes</label>
                            <input :id="'formWinemakerNotes' + index" type="text" class="form-control input-color" v-model="localBottle.winemakerNotes">
                        </div>
                    </div>
                    <div class="header-bg-color divider">Winery Location</div>
                    <div class="row row-cols-2 px-3">
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formRegion' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Region</label>
                            <input :id="'formRegion' + index" type="text" class="form-control input-color" v-model="localBottle.region">
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formCity' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">City/Town</label>
                            <input :id="'formCity' + index" type="text" class="form-control input-color" v-model="localBottle.city_Town">
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formState' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">State/Province</label>
                            <input :id="'formState' + index" type="text" class="form-control input-color" v-model="localBottle.state_Province">
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formCountry' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Country</label>
                            <input :id="'formCountry' + index" type="text" class="form-control input-color" v-model="localBottle.country">
                        </div>
                    </div>
                    <div class="header-bg-color divider">Your Details</div>
                    <div class="row row-cols-2 px-3">
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formRacks' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Wine Rack</label>
                            <select :id="'formRacks' + index" class="form-select input-color" aria-label="Rack selector" v-model="localBottle.rack_name" @change="clearRowCol()">
                                <option>Unassigned</option>
                                <option v-for="(rack, idx) in racks" :key="idx">{{rack.rack_name}}</option>
                            </select>
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <div class="col d-flex" style="position: relative">
                                <label :for="'formRow' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap">Row</label>
                                <input :id="'formRow' + index" type="text" class="form-control input-color" v-model="localBottle.row" :class="{ 'is-invalid': submitted && v$.localBottle.row.$error }">
                                <div v-if="submitted && v$.localBottle.row.$error" class="error-text-sm">
                                    <span v-if="!v$.localBottle.row.required">Required</span>
                                    <span v-if="!v$.localBottle.row.numeric">Numeric</span>
                                </div>
                            </div>
                            <div class="col d-flex" style="position: relative">
                                <label :for="'formCol' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap">Column</label>
                                <input :id="'formCol' + index" type="text" class="form-control input-color" v-model="localBottle.col" :class="{ 'is-invalid': submitted && v$.localBottle.col.$error }">
                                <div v-if="submitted && v$.localBottle.col.$error" class="error-text-sm">
                                    <span v-if="!v$.localBottle.col.required">Required</span>
                                    <span v-if="!v$.localBottle.col.numeric">Numeric</span>
                                </div>
                            </div>
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formWhereBought' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Where Bought</label>
                            <input :id="'formWhereBought' + index" type="text" class="form-control input-color" v-model="localBottle.where_bought">
                        </div>
                        <div class="col d-flex justify-content-center px-4 py-2">
                            <label :for="'formPricePaid' + index" class="form-label my-auto fw-bold px-3 form-label text-nowrap w-50">Price Paid</label>
                            <input :id="'formPricePaid' + index" type="text" class="form-control input-color" v-model="localBottle.price_paid">
                        </div>
                    </div>
                </div>
                <div class="modal-footer justify-content-between bg-default text-default">
                    <button v-if="modalType == 'import'" type="submit" class="btn btn-danger mr-auto" style="width: 250px" @click="importRemove()">
                        <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">delete</span><span style="font-size: 22px; margin-right: 10px;">Remove</span></div>
                    </button>
                    <button v-if="modalType == 'import'" type="submit" class="btn btn-primary" style="width: 250px" @click="importUpdate()">
                        <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">save</span><span style="font-size: 22px; margin-right: 10px;">Update</span></div>
                    </button>
                    <button v-if="modalType == 'import'" type="button" class="btn btn-secondary" style="width: 250px; color: #fff;" @click="importCancel()">
                        <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">close</span><span style="font-size: 22px; margin-right: 10px;">Cancel</span></div>
                    </button>
                    <button v-if="saving != true && modalType != 'import'" type="submit" class="btn btn-primary" style="width: 250px" @click="saveAndClose()">
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

<script setup>
    import { ref, watch, computed } from 'vue'
    import useVuelidate from '@vuelidate/core'
    import { required, requiredIf, numeric, helpers } from "@vuelidate/validators"
    import { useStore } from 'vuex'

    const props = defineProps({
        bottle: Object,
        title: {},
        modalType: {
            type: String,
            required: true,
        },
        index: {},
    })

    const emit = defineEmits(['update', 'editor_event'])

    const saving = ref(false)
    const submitted = ref(false)
    const localBottle = ref({ ...props.bottle })

    watch(() => props.bottle, (newVal) => {
        localBottle.value = { ...newVal }
    }, { deep: true })

    const validYear = (value) => !helpers.req(value) || (parseInt(value) >= (new Date().getFullYear() - 100) && parseInt(value) <= new Date().getFullYear())
    const validCategory = (value) => !helpers.req(value) ||
        (value === "Red" ||
            value === "White" ||
            value === "Rosé" ||
            value === "Sparkling / Champagne" ||
            value === "Dessert / Port / Sherry")

    const rules = computed(() => ({
        localBottle: {
            vintner: { required },
            varietal: { required },
            wineName: { required },
            category: { required, validCategory },
            year: { required, validYear },
            row: { numeric, required: requiredIf(() => localBottle.value.rack_name != "Unassigned" && localBottle.value.rack_name) },
            col: { numeric, required: requiredIf(() => localBottle.value.rack_name != "Unassigned" && localBottle.value.rack_name) },
        }
    }))

    const v$ = useVuelidate(rules, { localBottle })

    const store = useStore()
    const racks = computed(() => store.state.racks)

    const years = computed(() => {
        var d = new Date()
        var currentYear = d.getFullYear()
        var returnYears = []
        for (var i = 0; i <= 100; i++) {
            returnYears.push(currentYear - i)
        }
        return returnYears
    })

    function clearRowCol() {
        localBottle.value.row = null
        localBottle.value.col = null
    }

    function saveAndClose() {
        saving.value = true
        submitted.value = true
        v$.value.$touch()
        if (v$.value.$invalid) {
            saving.value = false
            return
        }
        submitted.value = false
        emit('update', { ...localBottle.value })
        document.getElementById('xEditClose' + props.index).click()
        saving.value = false
    }

    function cancel() {
        document.getElementById('xEditClose' + props.index).click()
        // Optionally refresh bottles here if needed
    }

    function importUpdate() {
        submitted.value = true
        v$.value.$touch()
        if (v$.value.$invalid) {
            saving.value = false
            return
        }
        submitted.value = false
        emit('update', { ...localBottle.value })
        document.getElementById('xEditClose' + props.index).click()
    }

    function importCancel() {
        emit('editor_event', 'cancel')
        document.getElementById('xEditClose' + props.index).click()
    }

    function importRemove() {
        emit('editor_event', 'remove_' + localBottle.value.import_id)
        document.getElementById('xEditClose' + props.index).click()
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