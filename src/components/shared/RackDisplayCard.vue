<template>
    <div class="rack-content">
        <div class="d-flex justify-content-center">
            <h2>{{rack.rack_name}}</h2>
        </div>
        <table class="rack-table">
            <tr class="rack-row" v-for="(r, idxr) in rack.rows" :key="idxr">
               <td class="rack-cell" v-for="(c, idxc) in rack.cols" :key="idxc" data-bs-toggle="modal" :class="{ 'glowing': r == row && c == col}">
                   <img class="rack-img" v-if="currentBottle(r,c).category == 'Red'" width="50px" height="50px" src="@/assets/rack-bottle-red.png">
                   <img class="rack-img" v-if="currentBottle(r,c).category == 'White'" width="50px" height="50px" src="@/assets/rack-bottle-white.png">
                   <img class="rack-img" v-if="currentBottle(r,c).category == 'Sparkling / Champagne'" width="50px" height="50px" src="@/assets/rack-bottle-sparkling.png">
                   <img class="rack-img" v-if="currentBottle(r,c).category == 'Dessert / Port / Sherry'" width="50px" height="50px" src="@/assets/rack-bottle-dessert.png">
                   <img class="rack-img" v-if="currentBottle(r,c).category == 'Rosé'" width="50px" height="50px" src="@/assets/rack-bottle-rose.png">
                   <img class="rack-img" v-if="!currentBottle(r,c).category" width="50px" height="50px" src="@/assets/rack-bottle-empty.png">
                </td>
            </tr>
        </table>
    </div>  
</template>

<script>
export default {
    name: 'RackDisplayCard',
    props: {
        rack: {
        },
        bottles: {
        },
        row: {
        },
        col: {
        },
    },
    methods: {
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
    .btn-primary {
        color: #fff;
        background-color: #5599CC;
        border-color: #5599CC; 
    }
    .btn-primary:hover, .btn-primary:focus, .btn-primary:active, .btn-primary.active, .open>.dropdown-toggle.btn-primary {
        color: #fff;
        background-color: #396485;
        border-color: #396485; /*set the color you want here*/
    }    
    .glowing {
        /* background-color: red; */
        position: relative;
        animation: animate 2s linear infinite
    }

    .glowing i {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: #fff;
        height: 100%;
        cursor: pointer
    }

    @keyframes animate {
        0% {
            box-shadow: 0 0 0 0 rgb(49, 114, 163, 1), 0 0 0 0 rgb(49, 114, 163, 1)
        }

        
        50% {
            box-shadow: 0 0 0 30px rgb(49, 114, 163, 0), 0 0 0 0 rgb(49, 114, 163, 1)
        }

/*         80% {
            box-shadow: 0 0 0 30px rgb(85, 153, 204, 0), 0 0 0 30px rgb(85, 153, 204, 0)
        } */

        100% {
            box-shadow: 0 0 0 0 rgb(49, 114, 163, 0), 0 0 0 30px rgb(49, 114, 163, 0)
        }
    }
</style>
