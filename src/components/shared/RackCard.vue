<template>
    <div class="rack-content">
        <div class="d-flex justify-content-center">
            <h2>{{rack.rack_name}}</h2>
            <div>
                <button type="button" class="btn btn-primary mb-2 mx-3" modalTitle='Edit Rack' data-bs-toggle="modal" data-bs-target="#rackEditorModal">
                    <div class="justify-content-center"><span class="material-icons mt-auto" style="margin-right: 5px; font-size: 24px">edit</span><span class="mt-auto" style="font-size: 18px; margin-right: 10px;">Edit</span></div>
                </button>
            </div>
        </div>
        <table class="rack-table">
            <tr class="rack-row" v-for="(r, idxr) in rack.rows" :key="idxr">
               <td class="rack-cell" v-for="(c, idxc) in rack.cols" :key="idxc" data-bs-toggle="modal" @click="function() {setCurrentBottle(r,c); modalTitle='Edit Bottle';}" :data-bs-target="currentBottle(r,c).category ? '#bottleDetailsModal' + index : '#unassignedBottlesModal' + index">
                   <img class="rack-img" v-if="currentBottle(r,c).category == 'Red'" width="50px" height="50px" src="@/assets/rack-bottle-red.png">
                   <img class="rack-img" v-if="currentBottle(r,c).category == 'White'" width="50px" height="50px" src="@/assets/rack-bottle-white.png">
                   <img class="rack-img" v-if="currentBottle(r,c).category == 'Sparkling / Champagne'" width="50px" height="50px" src="@/assets/rack-bottle-sparkling.png">
                   <img class="rack-img" v-if="currentBottle(r,c).category == 'Dessert / Port / Sherry'" width="50px" height="50px" src="@/assets/rack-bottle-dessert.png">
                   <img class="rack-img" v-if="currentBottle(r,c).category == 'Rosé'" width="50px" height="50px" src="@/assets/rack-bottle-rose.png">
                   <img class="rack-img" v-if="!currentBottle(r,c).category" @mouseenter="forceRerender()" width="50px" height="50px" src="@/assets/rack-bottle-empty.png">
                </td>
            </tr>
        </table>
        <!-- Bottle Details Modal -->
        <BottleModal :index="index" :selectedBottle="selectedBottle" modalType="racks" />
        <!-- Bottle Edit/Create Modal -->
        <BottleEditor :index="index" :bottle="selectedBottle" :title="modalTitle" modalType="current" />
         <!-- Unassigned Bottle Modal -->
        <UnassignedBottleModal :index="index" :rack_name="this.rack.rack_name" :row="row" :col="col" :bottles="unassigned" :key="componentKey" />
    </div>  
</template>

<script>
import BottleModal from '@/components/shared/BottleModal';
import BottleEditor from '@/components/shared/BottleEditor';
import UnassignedBottleModal from '@/components/shared/UnassignedBottleModal';

export default {
    name: 'RackCard',
    props: {
        rack: {
        },
        bottles: {
        },
        unassigned: {
        },
        index: {
        },
    },
    components: {
        BottleModal,
        BottleEditor,
        UnassignedBottleModal,
    },
    data() {
        return {
            selectedBottle: {
                vintner: {},
                wineName: {},
                region: {},
            },
            modalTitle: 'Edit Bottle',
            row: {},
            col: {},
            componentKey: 0,
        }
    },
    methods: {
        forceRerender() {
            this.componentKey += 1;
        },
        currentBottle(r,c) {
            var thisBottle = this.bottles.find(x => x.row == r && x.col == c);
            if(thisBottle) {
                return thisBottle;
            }
            else return {
                wineName: null,
                category: null,
            };
        },
        setCurrentBottle(r,c) {
            var thisBottle = this.bottles.find(x => x.row == r && x.col == c);
            if(thisBottle) {
                var bots = this.$store.getters['pullCurrentBottles'];
                this.selectedBottle = bots[bots.findIndex(item => item.guid === thisBottle.guid)];
            }
            else {
                this.row = r;
                this.col = c;
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
    },
}
</script>

<style scoped>
    .rack-table {
        border-collapse: separate; 
        border-spacing:0;
        border: 3px solid black;
        border-radius: 15px;
        background-color: black;
        margin: 0 auto;
    }
    .rack-row {
        height: 50px;
        padding: 5px;
    }
    .rack-cell {
        border: 3px solid black;
        border-radius: 15px;
        width: 50px;
        height: 50px;
        overflow:hidden;
    }
    .rack-img {
        cursor: pointer;
    }
    .rack-content {
        padding: 20px;
    } 
</style>
