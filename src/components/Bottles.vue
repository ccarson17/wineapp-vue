<template>
  <div class="content-centered-horizontal overflow-auto" style="padding: 0 50px 50px 50px; height: 100%;">
    <h1>Bottles ({{bottles.length}})</h1>
    <button type="button" class="btn btn-primary" style="width: 200px; position:absolute; top: 10px; right: 90px" @click="function() {setCurrentBottle(null); modalTitle='Add New Bottle';}" data-bs-toggle="modal" data-bs-target="#bottleEditorModal0">
      <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">add</span><span style="font-size: 22px; margin-right: 10px;">Add Bottle</span></div>
    </button>
    <div class="row row-cols-3">
        <div v-for="(bottle, idx) in bottles" :key="idx" class="col" style="display: flex" data-bs-toggle="modal" @click="function() {setCurrentBottle(bottle.guid); modalTitle='Edit Bottle';}" data-bs-target="#bottleDetailsModal0">
          <BottleCard :bottle="bottle" />     
        </div>
      </div>
      <!-- Bottle Details Modal -->
      <BottleModal index="0" :selectedBottle="selectedBottle" modalType="current" />
      <!-- Bottle Edit/Create Modal -->
      <BottleEditor index="0" :bottle="selectedBottle" :title="modalTitle" modalType="current" />


  </div>
</template>

<script>
import BottleModal from './shared/BottleModal';
import BottleCard from './shared/BottleCard';
import BottleEditor from './shared/BottleEditor';

export default {
  name: 'Bottles',
  computed: {
    bottles() {
      if(!this.$store.state.wineApiKey) window.location.href = "/";
      return this.$store.state.currentBottles;
    },
  },
  components: {
    BottleModal,
    BottleCard,
    BottleEditor,
  },
  created() {
    this.$emit('view_event', 'disable_nav');
    this.$store.dispatch('getCurrentBottles').then(this.$emit('view_event', 'enable_nav'));
  },
  data() {
    return {
      selectedBottle: {
        vintner: {},
        wineName: {},
        region: {},
      },
      modalTitle: 'Edit Bottle',
    }
  },
  methods: {
    setCurrentBottle(bottleId) {
      if(bottleId) {
        var bots = this.$store.getters['pullCurrentBottles'];
        this.selectedBottle = bots[bots.findIndex(item => item.guid === bottleId)];
        /* console.log(this.selectedBottle); */
      }
      else {
        this.selectedBottle = {
                vintner: null,
                varietal: null,
                wineName: null,
                category: null,
                year: null,
                sizeinml: null,
                owner_guid: null,
                rack_guid: null,
                rack_name: null,
                bottle_guid: null,
                rack_col: null,
                rack_row: null,
                where_bought: null,
                price_paid: null,
                user_rating: null,
                drink_date: null,
                created_date: null,
                user_notes: null,
            };
            /* console.log(this.selectedBottle); */
      }
    },
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
