<template>
    <div class="modal fade" :id="'locateModal' + index" tabindex="-1" aria-labelledby="locateModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content" style="border-radius: 15px">
                <div class="modal-header text-default-alt header-bg-color">
                    <div class="modal-title" id="locateModalLabel" style="width: 100%">
                        <h5 style="margin: 0px; text-align: left">Bottle Location</h5>
                    </div>
                    <button :id="'xLocatedClose' + index" type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>                </div>
                <div class="modal-body bg-default text-default">
                    <template v-if="bottle && rack && bottle.row && bottle.col">
                        <RackDisplayCard :rack="rack"
                                         :bottles="bottles"
                                         :row="bottle.row"
                                         :col="bottle.col"
                                         :key="rack.guid" />
                    </template>
                    <template v-else>
                        <span>This bottle is not assigned to a rack</span>
                    </template>
                </div>
                <div class="modal-footer bg-default text-default" style="position: relative">
                    <button type="button" class="btn btn-secondary" style="width: 150px; color: #fff;" @click="cancel()">
                        <div class="d-flex justify-content-center">
                            <span class="material-icons" style="margin-right: 5px; font-size: 36px">close</span>
                            <span style="font-size: 22px; margin-right: 10px;">Close</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import RackDisplayCard from '@/components/shared/RackDisplayCard';

    export default {
        name: 'LocateModal',
        components: {
            RackDisplayCard,
        },
        props: {
            bottle: {},
            index: {},
        },
        computed: {
            bottles() {
                if (this.bottle && this.bottle.rack_guid) {
                    return this.$store.state.currentBottles.filter(x => x.rack_guid === this.bottle.rack_guid);
                }
                else
                    return null;
            },
            rack() {
                if (this.bottle && this.bottle.rack_guid) {
                    return this.$store.state.racks.find(x => x.guid == this.bottle.rack_guid);
                }
                else
                    return null;
            },
        },
        methods: {
            cancel() {
                document.getElementById('xLocatedClose' + this.index).click();
            }
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