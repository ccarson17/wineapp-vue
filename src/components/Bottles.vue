<template>
    <div class="content-centered-horizontal overflow-auto" style="padding: 0 50px 50px 50px; height: 100%;">
        <h1>Bottles ({{ validBottles.length }})</h1>
        <button type="button" class="btn btn-primary" style="width: 200px; position:absolute; top: 10px; right: 90px" @click="setCurrentBottle(null); modalTitle='Add New Bottle';" data-bs-toggle="modal" data-bs-target="#bottleEditorModal0">
            <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">add</span><span style="font-size: 22px; margin-right: 10px;">Add Bottle</span></div>
        </button>
        <div class="row row-cols-3">
            <div v-for="(bottle, idx) in validBottles"
                 :key="bottle.guid || idx"
                 class="col"
                 style="display: flex"
                 @click="openBottleModal(bottle.guid)">
                <BottleCard :bottle="bottle" />
            </div>
        </div>
        <!-- Bottle Details Modal -->
        <BottleModal index="0"
                     :selectedBottle="selectedBottle"
                     modalType="current"
                     @update="handleBottleUpdate"
                     :key="selectedBottle && selectedBottle.guid ? selectedBottle.guid : 'empty-' + index"
                     @clear-selected-bottle="selectedBottle = null" />
        <!-- Bottle Edit/Create Modal -->
        <BottleEditor @update="handleBottleUpdate" index="0" :bottle="selectedBottle" :title="modalTitle" modalType="current" />
    </div>
</template>

<script>
    import BottleModal from './shared/BottleModal';
    import BottleCard from './shared/BottleCard';
    import BottleEditor from './shared/BottleEditor';

    export default {
        name: 'BottlesView',
        components: {
            BottleModal,
            BottleCard,
            BottleEditor,
        },
        computed: {
            bottles() {
                return this.$store.state.currentBottles;
            },
            validBottles() {
                // Filter out any null/undefined bottles
                return this.bottles.filter(b => b && typeof b === 'object');
            }
        },
        data() {
            return {
                selectedBottle: null,
                modalTitle: 'Edit Bottle',
            }
        },
        created() {
            this.$emit('view_event', 'disable_nav');
            try {
                this.$store.dispatch('getCurrentBottles');
            } catch (error) {
                this.$swal({
                    title: "Error: " + error,
                    background: this.$store.state.theme.swalColor,
                });
            } finally {
                this.$emit('view_event', 'enable_nav');
            }
        },
        methods: {
            openBottleModal(bottleId) {
                this.setCurrentBottle(bottleId);
                this.modalTitle = 'Edit Bottle';
                this.$nextTick(() => {
                    const modal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('bottleDetailsModal0'));
                    modal.show();
                });
            },
            setCurrentBottle(bottleId) {
                if (bottleId) {
                    const bots = this.validBottles;
                    this.selectedBottle = bots.find(item => item.guid === bottleId) || null;
                } else {
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
                Object.assign(this.selectedBottle, updatedBottle);
            }
        }
    }
</script>

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