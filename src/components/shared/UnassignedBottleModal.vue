<template>
    <div>
        <div class="modal fade" :id="'unassignedBottlesModal' + index" tabindex="-1" aria-labelledby="unassignedBottlesModalLabel" aria-hidden="true">
            <div id="unassignedBottlesModalBox" class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content"  style="border-radius: 15px">
                    <div class="modal-header text-default-alt header-bg-color">
                        <div class="modal-title" id="unassignedBottlesModalLabel" style="width: 100%">
                            <h5 class="modal-title">Add Bottle to Rack</h5>
                        </div>    
                        <button id="xUnassignedClose" type="button" class="btn-close btn-close-white" aria-label="Close" data-bs-dismiss="modal" @click="isVisible = false"></button>                       
                    </div>
                    <div class="modal-body bg-default text-default">
                        <h5>Add New Bottle</h5>
                        <button type="button" class="btn btn-primary" style="width: 200px; margin-bottom: 10px" @click="function() {setCurrentBottle(); modalTitle='Add New Bottle';}" data-bs-toggle="modal" :data-bs-target="'#bottleEditorModalUnassigned' + index">
                            <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">add</span><span style="font-size: 22px; margin-right: 10px;">Add Bottle</span></div>
                        </button>   
                        <h5>or</h5>                     
                        <h5>Assign an Existing Bottle</h5>
                        <div v-for="(bottle, idx) in bottles" :key="idx" class="col" style="display: flex" @click="addBottleToRack(bottle)">
                            <BottleCard :bottle="bottle" />     
                        </div>
                        <div v-if="bottles.length == 0" style="font-style: italic">No unassigned bottles</div>
                    </div>
                </div>
            </div>
        </div> 
        <!-- Bottle Edit/Create Modal -->
        <BottleEditor :index="'Unassigned' + index" :bottle="selectedBottle" title="Add New Bottle" modalType="current" />
    </div>
</template>

<script>
import BottleCard from '@/components/shared/BottleCard';
import BottleEditor from '@/components/shared/BottleEditor';

export default {
    name: 'UnassignedBottleModal',
    props: {
        index: {
        },
        rack_name: {},
        row: {},
        col: {},
        bottles: [],
    },
/*     computed: {
        bottles() {
            return this.$store.state.unassignedBottles;
        },
    },   */  
    components: {
        BottleCard,
        BottleEditor,
    },
/*     created() {
        this.$store.dispatch('getUnassignedBottles');
    }, */
    data() {
      return {
          showAlert: false,
          selectedBottle: [],
      }
    },
    methods: {
        addBottleToRack(bottle) {
            console.log("Add bottle to R: " + this.row + ", C: " + this.col + " on " + this.rack_name);
            console.log(bottle);
            var context = this;
            this.$store.dispatch('addBottleToRack', [ bottle, this.rack_name, this.row, this.col ])
                .then(function(){
                    context.$swal({
                        title: "<h3 style='color: white'>Bottle Added to Rack!</h3>",
                    });
                    context.$store.dispatch('getCurrentBottles');
                    context.$store.dispatch('getUnassignedBottles');
                    document.getElementById('xUnassignedClose').click();
                }, error => {        
                    var responseDetail = error.response.status == "400" ? error.response.data : error.response.status + " (" + error.response.statusText + ")"            
                    context.$swal({
                        icon: 'error',
                        title: "<h3 style='color: white'>Add Bottle to Rack Error: API response - " + responseDetail + "</h3>",
                    });
                });  
        },
        setCurrentBottle() {
            this.selectedBottle = {
                rack_name: this.rack_name,
                row: this.row,
                col: this.col,
            };
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
