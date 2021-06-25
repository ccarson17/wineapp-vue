<template>
    <div class="modal fade" id="rackEditorModal" tabindex="-1" aria-labelledby="rackEditorModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content"  style="border-radius: 15px">
                <div class="modal-header text-default-alt header-bg-color">
                    <div class="modal-title" id="rackEditorModalLabel" style="width: 100%">
                        <h5 style="margin: 0px; text-align: left">{{title}}</h5>
                    </div>
                    <button id="xRackEditClose" type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body bg-default text-default">
                    <div class="d-flex justify-content-center px-4 py-2" style="position: relative">
                        <div class="col d-flex" style="position: relative">
                            <label for="rackFormName" class="form-label my-auto fw-bold px-3 form-label text-nowrap p-2 w-20">Rack Name</label>
                            <input id="rackFormName" type="text" class="form-control input-color" v-model="rack.rack_name" :class="{ 'is-invalid': submitted && $v.rack.rack_name.$error }">
                            <div v-if="submitted && $v.rack.rack_name.$error" class="error-text-sm">
                                <span v-if="!$v.rack.rack_name.required">Required</span>
                                <span v-if="!$v.rack.rack_name.found">Rack Name must be unique!</span>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center px-4 py-2">
                        <div class="col d-flex" style="position: relative">
                            <label for="rackFormRow" class="form-label my-auto fw-bold px-3 form-label text-nowrap">Rows</label>
                            <input id="rackFormRow" type="number" min="1" class="form-control input-color" v-model.number="rack.rows" :class="{ 'is-invalid': submitted && $v.rack.rows.$error }">
                            <div v-if="submitted && $v.rack.rows.$error" class="error-text-sm">
                                <span v-if="!$v.rack.rows.required">Required</span>
                                <span v-if="!$v.rack.rows.numeric && $v.rack.rows.required">Numeric</span>
                            </div>
                        </div>
                        <div class="col d-flex" style="position: relative">
                            <label for="rackFormCol" class="form-label my-auto fw-bold px-3 form-label text-nowrap">Columns</label>
                            <input id="rackFormCol" type="number" min="1" class="form-control input-color" v-model.number="rack.cols" :class="{ 'is-invalid': submitted && $v.rack.cols.$error }">
                            <div v-if="submitted && $v.rack.cols.$error" class="error-text-sm">
                                <span v-if="!$v.rack.cols.required">Required</span>
                                <span v-if="!$v.rack.cols.numeric && $v.rack.cols.required">Numeric</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer bg-default text-default" style="position: relative">
                    <button v-if="saving != true" type="button" class="btn btn-danger" style="width: 150px; position: absolute; top 0px; left: 12px" @click="deleteRack()" >
                        <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">delete_forever</span><span style="font-size: 22px; margin-right: 10px;">Delete</span></div>
                    </button>
                    <button v-if="saving != true" type="submit" class="btn btn-primary" style="width: 150px" @click="saveAndClose()" >
                        <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">save</span><span style="font-size: 22px; margin-right: 10px;">Save</span></div>
                    </button>
                    <button v-if="saving == true" type="button" class="btn btn-primary" style="width: 150px">
                        <div class="d-flex justify-content-center"><span class="spinner-border spinner-border" style="margin-right: 10px;" role="status" aria-hidden="true"></span><span style="font-size: 22px; margin-right: 10px;">Saving...</span></div>
                    </button>
                    <button type="button" class="btn btn-secondary" style="width: 150px; color: #fff;" @click="cancel()">
                        <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">close</span><span style="font-size: 22px; margin-right: 10px;">Cancel</span></div>
                    </button>
                </div>
            </div>
        </div>
    </div> 
</template>

<script>
import { required, between } from "vuelidate/lib/validators";

export default {
    name: 'RackEditor',
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
        }
    },
    created() {
        this.$store.dispatch('getRacks');
    },
    data() {
      return {
        saving: false,
        submitted: false,
      }
    },
    validations: {
        rack: {
            rack_name: { required, 
                         found() {
                            try {
                                const rackMatch = this.racks.filter(x => x.rack_name == this.rack.rack_name && x.guid != this.rack.guid);
                                if(!this.rack.rack_name) return true;
                                return rackMatch == 0;
                            }
                            catch(e) {
                                return false;
                            }
                        },
            },
            rows: { between: between(1, 9999), required },
            cols: { between: between(1, 9999), required },
        }
    },
    props: {
        rack: {
        },
        title: {
        },
    },
    methods: {
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
            if(this.rack.guid) {
                // existing rack code
                this.$store.dispatch('updateRack', this.rack)
                    .then(function(){
                        context.$swal({
                            title: "<h3 style='color: white'>Rack Updated.</h3>",
                            background: context.$store.state.theme.swalColor,
                        });
                        context.$store.dispatch('getRacks');
                        context.saving = false;
                        document.getElementById('xRackEditClose').click();
                    }, error => {      
                        var responseDetail = error.response.status == "400" ? error.response.data : error.response.status + " (" + error.response.statusText + ")"       
                        context.$swal({
                            icon: 'error',
                            title: "<h3 style='color: white'>Update Rack Error: Response - " + responseDetail + "</h3>",
                            background: context.$store.state.theme.swalColor,
                        });
                        context.saving = false;
                    });
            }
            else {
                // new rack code
                this.$store.dispatch('createRack', this.rack)
                    .then(function(){
                        context.$swal({
                            title: "<h3 style='color: white'>Success! A new rack has been added.</h3>",
                            background: context.$store.state.theme.swalColor,
                        });
                        context.$store.dispatch('getRacks');
                        context.saving = false;
                        document.getElementById('xRackEditClose').click();
                    }, error => {      
                        var responseDetail = error.response.status == "400" ? error.response.data : error.response.status + " (" + error.response.statusText + ")"       
                        context.$swal({
                            icon: 'error',
                            title: "<h3 style='color: white'>Create Rack Error: Response - " + responseDetail + "</h3>",
                            background: context.$store.state.theme.swalColor,
                        });
                        context.saving = false;
                    }); 
            }
        },
        deleteRack() {
            var context = this;
            this.submitted = false;
            context.$swal({
                toast: false,
                position: 'center',
                icon: 'warning',
                timer: 0,
                timerProgressBar: false,
                title: 'Are you sure?',
                html: "<span style='font-weight: bold'>Deleting a rack is permanent!</span><br/>Any bottles contained in the rack will be unassigned from it, but will not be deleted.",
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonColor: '#dc3545',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                background: context.$store.state.theme.swalColor,
            }).then((result) => {
                if (result.isConfirmed) {
                    this.$store.dispatch('deleteRack', this.rack)
                        .then(function(){
                            context.$swal({
                                title: "<h3 style='color: white'>Rack Deleted</h3>",
                                background: context.$store.state.theme.swalColor,
                            });
                            context.$store.dispatch('getRacks');
                            context.saving = false;
                            document.getElementById('xRackEditClose').click();
                        }, error => {      
                            var responseDetail = error.response.status == "400" ? error.response.data : error.response.status + " (" + error.response.statusText + ")"       
                            context.$swal({
                                icon: 'error',
                                title: "<h3 style='color: white'>Delete Rack Error: Response - " + responseDetail + "</h3>",
                                background: context.$store.state.theme.swalColor,
                            });
                            context.saving = false;
                        })
                }
            });
        },
        cancel() {
            this.submitted = false;
            document.getElementById('xRackEditClose').click();
            this.$store.dispatch('getRacks');
        }
    }
}
</script>

<style scoped>
.form-label {
     min-width: 125px;
     text-align: right;
}
.divider {
    color: #fff;
    border-radius: 10px;
    text-align: left;
    padding: 4px 0px 4px 15px;
    margin: 20px 20px 0px 20px;
    font-weight: bold;
}
.error-text {
    color: #dc3545;
    font-size: 14px;
    position: absolute;
    top: 17px;
    right: 60px;
}
.error-text-sm {
    color: #dc3545;
    font-size: 14px;
    position: absolute;
    top: 8px;
    right: 35px;
}
</style>
