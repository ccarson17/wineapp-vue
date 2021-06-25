<template>
  <div class="content-centered-horizontal">
    <h1>Import</h1>
    <a href="./oenofile-template.csv" class="my-4" download>Download Template</a>
    <div class="d-flex justify-content-center my-4">
      <input type="file" class="form-control" style="width: 50%; max-width: 400px; min-width: 200px" @change="onFileChange">
    </div>
    <div v-if="json" class="d-flex justify-content-center my-4">
        <div class="row row-cols-3">
          <div v-for="(bottle, idx) in bottles" :key="idx" class="col" style="display: flex; position: relative; cursor: pointer" data-bs-toggle="modal" @click="function() {setCurrentBottle(bottle.import_id); modalTitle='Edit Bottle';}" data-bs-target="#bottleEditorModal0">
            <BottleCard :bottle="bottle" :cardDarken="isError.find(x => x.key == bottle.import_id)" />   
            <div v-if="!isError.find(x => x.key == bottle.import_id) && !isUploaded.find(x => x.key == bottle.import_id) && saving" class="d-flex justify-content-center" style="flex-wrap: wrap; position: absolute; top: 35%; left: 0; bottom: 0; right: 0; height: 100%">
              <span class="spinner-border spinner-border text-primary" style="font-size: 24px" role="status" aria-hidden="true"></span>
            </div>
            <div v-if="isError.find(x => x.key == bottle.import_id)" class="d-flex justify-content-center" style="flex-wrap: wrap; position: absolute; top: 0; left: 0; bottom: 0; right: 0; height: 100%">
              <span class="material-icons text-danger" style="margin: auto; font-size: 60px; flex: 0 0 100%">highlight_off</span>
              <span class="text-danger fw-bold">{{isError.find(x => x.key == bottle.import_id).value}}</span>
            </div> 
            <div v-if="isUploaded.find(x => x.key == bottle.import_id)" class="d-flex justify-content-center" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto; height: 100%">
              <span class="material-icons text-success" style="margin: auto; font-size: 82px">check_circle_outline</span>
            </div> 
          </div>
        </div>
        <!-- Bottle Edit/Create Modal -->
        <BottleEditor index="0" :bottle="selectedBottle" title="Edit Bottle" modalType="import" v-on:editor_event="handleEditEvent" />
      <!-- {{json}} -->
    </div>
    <div v-if="json" class="row d-flex justify-content-center my-4">
      <h5 v-if="isError.length > 0" class="text-danger">One or more bottles were not uploaded. You can click on those bottles to correct the errors, then try again.</h5> 
      <button v-if="saving != true && !allUploaded" type="submit" class="btn btn-primary mx-2" style="width: 250px" @click="uploadBottles()" >
          <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">file_upload</span><span style="font-size: 22px; margin-right: 10px;">Upload Bottles</span></div>
      </button>
      <button v-if="saving == true && !allUploaded" type="button" class="btn btn-primary mx-2" style="width: 250px">
          <div class="d-flex justify-content-center"><span class="spinner-border spinner-border" style="margin-right: 10px;" role="status" aria-hidden="true"></span><span style="font-size: 22px; margin-right: 10px;">Uploading...</span></div>
      </button>                    
      <button v-if="!allUploaded" type="button" class="btn btn-secondary mx-2" style="width: 250px; color: #fff;" @click="cancelUpload()">
          <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">close</span><span style="font-size: 22px; margin-right: 10px;">Cancel</span></div>
      </button>  
      <div v-if="allUploaded" class="row d-flex justify-content-center my-4">
        <h4 class="text-success">All bottles uploaded!</h4>   
        <button type="button" class="btn btn-secondary mx-2" style="width: 250px; color: #fff;" @click="cancelUpload()">
            <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">close</span><span style="font-size: 22px; margin-right: 10px;">Close</span></div>
        </button>     
      </div>
    </div>
  </div>
</template>

  <script>   
    import BottleCard from './shared/BottleCard';
    import BottleEditor from './shared/BottleEditor';

    export default {
      name: "CSVUpload",
      components: {
        BottleCard,
        BottleEditor,
      },
      data() {
        return {
          csv: null,
          json: null,
          saving: false,
          allUploaded: false,
          bottles: [],
          unalteredBottle: {
            vintner: {},
            wineName: {},
            region: {},
          },
          selectedBottle: {
            vintner: {},
            wineName: {},
            region: {},
          },
          isUploaded: [],
          isError: [],
        }
      },
      methods: {
        validYear(value) {
          return (parseInt(value) >= (new Date().getFullYear() - 100) && parseInt(value) <= new Date().getFullYear());
        },
        validCategory(value) {
          return (value === "Red" || 
            value === "White" || 
            value === "Rosé" || 
            value === "Sparkling / Champagne" || 
            value === "Dessert / Port / Sherry");
        },
        uploadBottles() {
          var context = this;
          this.saving = true;
          this.bottles.forEach(bottle => {
            if(this.validYear(bottle.year) && this.validCategory(bottle.category) && bottle.vintner && bottle.wineName && bottle.varietal) {
              if(context.isUploaded.filter(x => x.key == bottle.import_id).length == 0) {
                this.$store.dispatch('createBottle', bottle)
                  .then(function(){
                      context.isUploaded.push({ key: bottle.import_id, value: "Success!" });
                      var key = bottle.import_id;
                      for(var i = 0; i < context.isError.length; i++) {
                          if(context.isError[i].key == key) {
                              context.isError.splice(i, 1);
                              break;
                          }                          
                      }
                      if(context.isError.length == 0 && context.isUploaded.length > 0) context.allUploaded = true;
                      context.saving = false;
                  }, error => {      
                      var responseDetail = error.response.status == "400" ? error.response.data : error.response.status + " (" + error.response.statusText + ")" 
                      responseDetail = error.response.status == "422" ? error.response.data.title : responseDetail
                      context.isError.push({ key: bottle.import_id, value: error.response.status == "422" ? responseDetail : "Create Error: Response - " + responseDetail });
                      context.saving = false;
                  }); 
              }
            }
            else {
              var invalidList = [];
              if(!this.validYear(bottle.year)) invalidList.push("Year");
              if(!this.validCategory(bottle.category)) invalidList.push("Category");
              if(!bottle.vintner) invalidList.push("Vintner");
              if(!bottle.varietal) invalidList.push("Varietal");
              if(!bottle.wineName) invalidList.push("Wine Name");
              if(invalidList.length == 1) {
                context.isError.push({ key: bottle.import_id, value: invalidList[0] + " is invalid." });
              }
              else {
                var errorText = "";
                var first = true;
                invalidList.forEach(x => { errorText += first ? x : ", " + x; first = false; });
                errorText += " are invalid."
                context.isError.push({ key: bottle.import_id, value: errorText });
              }
              context.saving = false;
            }
          });
        },
        cancelUpload() {
            this.$emit('refresh_me', 'import');
        },
        handleEditEvent(e) {
          var context = this;
          if(e === 'cancel')
            Object.assign(this.selectedBottle, this.unalteredBottle);
          else if(e.startsWith("remove_")) {
            var idToRemove = parseInt(e.replace("remove_", ""));
            for(var i = 0; i < context.bottles.length; i++) {
                if(context.bottles[i].import_id == idToRemove) {
                    context.bottles.splice(i, 1);
                    break;
                }                          
            }
            for(var j = 0; j < context.isError.length; j++) {
                if(context.isError[j].key == idToRemove) {
                    context.isError.splice(j, 1);
                    break;
                }                          
            }
            for(var k = 0; k < context.isUploaded.length; k++) {
                if(context.isUploaded[k].key == idToRemove) {
                    context.isUploaded.splice(k, 1);
                    break;
                }                          
            }
          }
        },
        onFileChange(e) {
          var files = e.target.files || e.dataTransfer.files;
          if (!files.length)
            return;
          this.parseFile(files[0]);
        },
        parseFile(file) {
          var context = this;
          const reader = new FileReader();
          reader.onload = function(evt) {
              context.csvJSON(evt.target.result);
            };
            reader.readAsText(file);
        },
        csvJSON(csv){
            //console.log(csv);
            var jsonOut = this.$papa.parse(csv, { header: true, });
            this.json = jsonOut.data;
            var i = 1;
            this.json.forEach(x => {
              if(x.Vintner || x.Varietal || x.Category || x.Year || x.wineName) {
                var thisBottle = {
                  vintner: x.Vintner,
                  varietal: x.Varietal,
                  category: x.Category,
                  year: x.Year,
                  wineName: x["Wine Name"],
                  region: x["Region"],
                  city_Town: x["City/Town"],
                  state_Province: x["State/Province"],
                  country: x["Country"],
                  rack_name: x["Wine Rack"],
                  row: x["Row"],
                  col: x["Column"],
                  where_bought: x["Where Bought"],
                  price_paid: x["Price Paid"],
                  size: x.Size,
                  abv: x["Alcohol by Volume (ABV)"],
                  winemakerNotes: x["Winemaker Notes"],
                  import_id: i,
                };		
                i++;
                this.bottles.push(thisBottle);
                //console.log(thisBottle);
              }
            })
        },
        setCurrentBottle(bottleId) {
          if(bottleId) {
            this.selectedBottle = this.bottles[this.bottles.findIndex(item => item.import_id === bottleId)];
            this.unalteredBottle = Object.assign({}, this.selectedBottle)
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
          }
        },
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
.header-bg-color {
    background-color: #396485;
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

.tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  border-radius: 16px;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity .15s, visibility .15s;
}

.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity .15s;
}
</style>
