<template>
  <div class="content-centered-horizontal">
    <button type="button" class="btn btn-primary" style="width: 200px; position:absolute; top: 10px; right: 90px" modalTitle='Add New Rack' data-bs-toggle="modal" @click="setSelectedRack(null)" data-bs-target="#rackEditorModal">
      <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">add</span><span style="font-size: 22px; margin-right: 10px;">Add Rack</span></div>
    </button>
    <h1>Racks</h1>
    <div v-for="(rack, idx) in racks" :key="idx" class="justify-content-center" @click="setSelectedRack(rack)">
      <RackCard :index=idx :rack=rack :bottles="bottles.filter(x => x.rack_guid === rack.guid)" :unassigned="bottles.filter(x => !x.rack_guid)"/>     
    </div>
    <RackEditor :rack="rack" :title="modalTitle" />
  </div>
</template>

<script>
import RackCard from './shared/RackCard';
import RackEditor from './shared/RackEditor';

export default {
  name: 'Racks',
  components: {
    RackCard,
    RackEditor,
  },
  created() {
    if(!this.$store.state.wineApiKey) window.location.href = "/";
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
  }
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
