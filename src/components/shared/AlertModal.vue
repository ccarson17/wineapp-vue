<template>
    <div v-if="visible" class="modal fade" id="alertModal" tabindex="-1" aria-labelledby="alertModalLabel">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content"  style="border-radius: 15px">
                <div class="modal-header text-white header-bg-color">
                    <h5 class="modal-title">{{title}}</h5>
                    <button id="xclose" type="button" class="btn-close btn-close-white" aria-label="Close" @click="isVisible = false"></button>              
                </div>
                <div class="modal-body">
                    {{body}}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="isVisible = false">Close</button>
                </div>
            </div>
        </div>
    </div> 
</template>

<script>

export default {
    name: 'AlertModal',
    props: {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        visible: {
            type: Boolean,
            required: true,
        },
    },
    watch: { 
        visible: function() { 
            console.log("visible changed to " + this.visible);
            this.isVisible = this.visible;
        }
    },
    data() {
        return {
            isVisible: this.visible,
        }
    },
    methods: {
    },
}
</script>

<style scoped>
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
    border-color: #396485;
}
</style>
