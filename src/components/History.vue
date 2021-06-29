<template>
  <div class="content-centered-horizontal overflow-auto" style="padding: 0 50px 50px 50px; height: 100%;">
    <h1>History ({{bottles.length}})</h1>
    <div class="row row-cols-3">
        <div v-for="(bottle, idx) in bottles" :key="idx" class="col" style="display: flex" data-bs-toggle="modal" @click="setCurrentBottle(bottle.guid)" data-bs-target="#bottleDetailsModal0">
          <BottleCard :bottle="bottle" />
        </div>
      </div>
      <!-- Bottle Details Modal -->
      <BottleModal index="0" :selectedBottle="selectedBottle" modalType="history" />
      <!-- Bottle Edit/Create Modal -->
      <BottleEditor index="0" :bottle="selectedBottle" title="Edit Bottle" modalType="history" />
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
      return this.$store.state.historyBottles;
    },
  },
  components: {
    BottleModal,
    BottleCard,
    BottleEditor,
  },
  created() {
    if(!this.$store.state.wineApiKey) window.location.href = "/";
    this.$emit('view_event', 'disable_nav');
    this.$store.dispatch('getHistoryBottles').then(this.$emit('view_event', 'enable_nav'));
  },
  data() {
    return {
      selectedBottle: {
        vintner: {},
        wineName: {},
        region: {},
      },
    }
  },
  methods: {
    setCurrentBottle(bottleId) {
      var bots = this.$store.getters['pullHistoryBottles'];
      this.selectedBottle = bots[bots.findIndex(item => item.guid === bottleId)];
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
.bottle-background {
  background-color: #FFFFFF;
  margin: 5px 5px 5px 0px;
  padding: 10px;
  min-width: 200px;
  width: 100%;
  border-radius: 0 15px 15px 0;
}
.bottle-color {
  background-color: lightgrey;
  margin: 5px 0px 5px 5px;
  padding: 0px;
  border-radius: 15px 0 0 15px;
  min-width: 20px;
  display: inline-block;
}
.bottle-red {
  background-color: #4d0000;
}
.bottle-white {
  background-color: #ffedab;
}
.bottle-sparkling {
  background-color: #004501;
}
.bottle-dessert {
  background-color: #4e3b57;
}
.bottle-rose {
  background-color: #f5dada;
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
.btn-primary {
    color: #fff;
    background-color: #5599CC;
    border-color: #5599CC; 
    width: 90%;
}
.btn-primary:hover, .btn-primary:focus, .btn-primary:active, .btn-primary.active, .open>.dropdown-toggle.btn-primary {
    color: #fff;
    background-color: #396485;
    border-color: #396485; /*set the color you want here*/
}
.header-bg-color {
  background-color: #396485;
}
</style>
