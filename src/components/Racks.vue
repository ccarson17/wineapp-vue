<template>
  <div class="content-centered-horizontal">
    <button type="button" class="btn btn-primary" style="width: 200px; position:absolute; top: 10px; right: 90px" modalTitle='Add New Rack' data-bs-toggle="modal" @click="setSelectedRack(null)" data-bs-target="#rackEditorModal">
      <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">add</span><span style="font-size: 22px; margin-right: 10px;">Add Rack</span></div>
    </button>
    <h1>Racks</h1>
    <div v-for="(rack, idx) in racks" :key="idx" class="justify-content-center" @click="setSelectedRack(rack)">
        <RackCard :index="idx"
                  :rack="rack"
                  :bottles="bottles.filter(x => x.rack_guid === rack.guid)"
                  :unassigned="bottles.filter(x => !x.rack_guid)"
                  @update="handleBottleUpdate" />
    </div>
    <RackEditor :rack="rack" :title="modalTitle" @update="handleRackUpdate" @delete="handleRackDelete"/>
  </div>
</template>

<script>
import RackCard from './shared/RackCard';
import RackEditor from './shared/RackEditor';

export default {
  name: 'RacksView',
  components: {
    RackCard,
    RackEditor,
  },
  created() {
    this.$store.dispatch('getRacks');
    this.$store.dispatch('getCurrentBottles');
    this.$store.dispatch('getUnassignedBottles');
  },
  computed: {
      racks() {
          return this.$store.state.racks;
      },
      bottles() {
          return this.$store.state.currentBottles;
      },
      unassigned() {
          return this.$store.state.unassignedBottles;
      }      
  },
  methods: {
    setSelectedRack(thisRack) {
      if(!thisRack) {
        this.rack = {
          rack_name: null,
          rows: null,
          cols: null,
        }
      }
      else {
        this.rack = thisRack;
      }
    },
    async handleRackUpdate(updatedRack) {
        let action, successMsg, errorMsg;
        let isUpdate = !!updatedRack.guid;
        if (isUpdate) {
            action = this.$store.dispatch('updateRack', updatedRack);
            successMsg = "<h3 style='color: white'>Rack Updated.</h3>";
            errorMsg = "Update Rack Error: Response - ";
        } else {
            action = this.$store.dispatch('createRack', updatedRack);
            successMsg = "<h3 style='color: white'>Success! A new rack has been added.</h3>";
            errorMsg = "Create Rack Error: Response - ";
        }
        try {
            await action;
            this.$swal({
                title: successMsg,
                background: this.$store.state.theme.swalColor,
            });
            await this.$store.dispatch('getRacks');
            document.getElementById('xRackEditClose')?.click();
        } catch (error) {
            var responseDetail = error.response?.status == "400"
                ? error.response.data
                : error.response?.status + " (" + error.response?.statusText + ")";
            this.$swal({
                icon: 'error',
                title: `<h3 style='color: white'>${errorMsg}${responseDetail}</h3>`,
                background: this.$store.state.theme.swalColor,
            });
        }
        Object.assign(this.rack, updatedRack);
    },
    async handleBottleUpdate(updatedBottle) {
        let action, successMsg, errorMsg;
        let isUpdate = !!updatedBottle.guid;

        if (isUpdate) {
            action = this.$store.dispatch('updateBottle', updatedBottle);
            successMsg = "<h3 style='color: white'>Bottle Updated.</h3>";
            errorMsg = "Update Error: Response - ";
        } else {
            action = this.$store.dispatch('createBottle', updatedBottle);
            successMsg = "<h3 style='color: white'>Success! A new bottle has been added to your collection.</h3>";
            errorMsg = "Create Error: Response - ";
        }

        try {
            await action;
            this.$swal({
                title: successMsg,
                background: this.$store.state.theme.swalColor,
            });
            // Always refresh history bottles in this view
            await this.$store.dispatch('getCurrentBottles');
            // Optionally close the modal if needed
            document.getElementById('xEditClose0')?.click();
        } catch (error) {
            var responseDetail = error.response?.status == "400"
                ? error.response.data
                : error.response?.status + " (" + error.response?.statusText + ")";
            this.$swal({
                icon: 'error',
                title: `<h3 style='color: white'>${errorMsg}${responseDetail}</h3>`,
                background: this.$store.state.theme.swalColor,
            });
        }
    },
    async handleRackDelete(rackToDelete) {
        this.$swal({
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
            background: this.$store.state.theme.swalColor,
        }).then((result) => {
            if (result.isConfirmed) {
                this.$store.dispatch('deleteRack', rackToDelete)
                    .then(() => {
                        this.$swal({
                            title: "<h3 style='color: white'>Rack Deleted</h3>",
                            background: this.$store.state.theme.swalColor,
                        });
                        this.selectedRack = null;
                        this.rack = {};
                        this.$store.dispatch('getRacks');
                        document.getElementById('xRackEditClose').click();
                    }, error => {
                        var responseDetail = error.response.status == "400" ? error.response.data : error.response.status + " (" + error.response.statusText + ")"
                        this.$swal({
                            icon: 'error',
                            title: "<h3 style='color: white'>Delete Rack Error: Response - " + responseDetail + "</h3>",
                            background: this.$store.state.theme.swalColor,
                        });
                    })
            }
        });
    }
  },
  data() {
    return { 
      modalTitle: "Add Rack",
      rack: {
        rack_name: null,
        rows: null,
        cols: null,
      },
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
