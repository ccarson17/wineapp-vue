<template>
    <div class="modal fade" id="rackEditorModal" tabindex="-1" aria-labelledby="rackEditorModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content" style="border-radius: 15px">
                <div class="modal-header text-default-alt header-bg-color">
                    <div class="modal-title" id="rackEditorModalLabel" style="width: 100%">
                        <h5 style="margin: 0px; text-align: left">{{ title }}</h5>
                    </div>
                    <button id="xRackEditClose" type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body bg-default text-default">
                    <div class="d-flex justify-content-center px-4 py-2" style="position: relative">
                        <div class="col d-flex" style="position: relative">
                            <label for="rackFormName" class="form-label my-auto fw-bold px-3 form-label text-nowrap p-2 w-20">Rack Name</label>
                            <input id="rackFormName" type="text" class="form-control input-color" v-model="localRack.rack_name" :class="{ 'is-invalid': submitted && v$.localRack.rack_name.$error }">
                            <div v-if="submitted && v$.localRack.rack_name.$error" class="error-text-sm">
                                <span v-if="!v$.localRack.rack_name.required">Required</span>
                                <span v-if="!v$.localRack.rack_name.found">Rack Name must be unique!</span>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center px-4 py-2">
                        <div class="col d-flex" style="position: relative">
                            <label for="rackFormRow" class="form-label my-auto fw-bold px-3 form-label text-nowrap">Rows</label>
                            <input id="rackFormRow" type="number" min="1" class="form-control input-color" v-model.number="localRack.rows" :class="{ 'is-invalid': submitted && v$.localRack.rows.$error }">
                            <div v-if="submitted && v$.localRack.rows.$error" class="error-text-sm">
                                <span v-if="!v$.localRack.rows.required">Required</span>
                                <span v-if="!v$.localRack.rows.between">Must be 1-9999</span>
                            </div>
                        </div>
                        <div class="col d-flex" style="position: relative">
                            <label for="rackFormCol" class="form-label my-auto fw-bold px-3 form-label text-nowrap">Columns</label>
                            <input id="rackFormCol" type="number" min="1" class="form-control input-color" v-model.number="localRack.cols" :class="{ 'is-invalid': submitted && v$.localRack.cols.$error }">
                            <div v-if="submitted && v$.localRack.cols.$error" class="error-text-sm">
                                <span v-if="!v$.localRack.cols.required">Required</span>
                                <span v-if="!v$.localRack.cols.between">Must be 1-9999</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer bg-default text-default" style="position: relative">
                    <button v-if="!saving" type="button" class="btn btn-danger" style="width: 150px; position: absolute; top: 0px; left: 12px" @click="emitDeleteRack">
                        <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">delete_forever</span><span style="font-size: 22px; margin-right: 10px;">Delete</span></div>
                    </button>
                    <button v-if="!saving" type="submit" class="btn btn-primary" style="width: 150px" @click="saveAndClose">
                        <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">save</span><span style="font-size: 22px; margin-right: 10px;">Save</span></div>
                    </button>
                    <button v-if="saving" type="button" class="btn btn-primary" style="width: 150px">
                        <div class="d-flex justify-content-center"><span class="spinner-border spinner-border" style="margin-right: 10px;" role="status" aria-hidden="true"></span><span style="font-size: 22px; margin-right: 10px;">Saving...</span></div>
                    </button>
                    <button type="button" class="btn btn-secondary" style="width: 150px; color: #fff;" @click="cancel">
                        <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 5px; font-size: 36px">close</span><span style="font-size: 22px; margin-right: 10px;">Cancel</span></div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, watch, computed, getCurrentInstance } from 'vue'
    import useVuelidate from '@vuelidate/core'
    import { required, between } from '@vuelidate/validators'

    const props = defineProps({
        rack: Object,
        title: {}
    })
    const emit = defineEmits(['update', 'delete'])

    const saving = ref(false)
    const submitted = ref(false)
    const localRack = ref({ ...props.rack })

    watch(() => props.rack, (newVal) => {
        localRack.value = { ...newVal }
    }, { deep: true })

    const instance = getCurrentInstance()

    const found = () => {
        try {
            // Use the store from the current instance's appContext
            const store = instance.appContext.config.globalProperties.$store
            const racks = store?.state?.racks || []
            const rackMatch = racks.filter(x => x.rack_name == localRack.value.rack_name && x.guid != localRack.value.guid)
            if (!localRack.value.rack_name) return true
            return rackMatch.length === 0
        } catch (e) {
            return false
        }
    }

    const rules = computed(() => ({
        localRack: {
            rack_name: { required, found },
            rows: { required, between: between(1, 9999) },
            cols: { required, between: between(1, 9999) }
        }
    }))

    const v$ = useVuelidate(rules, { localRack })

    function saveAndClose() {
        saving.value = true
        submitted.value = true
        v$.value.$touch()
        if (v$.value.$invalid) {
            saving.value = false
            return
        }
        submitted.value = false
        emit('update', { ...localRack.value })
        document.getElementById('xRackEditClose').click()
        saving.value = false
    }

    function emitDeleteRack() {
        emit('delete', { ...localRack.value })
        document.getElementById('xRackEditClose').click()
    }

    function cancel() {
        submitted.value = false
        document.getElementById('xRackEditClose').click()
    }
</script>

<style scoped>
    .form-label {
        min-width: 125px;
        text-align: right;
    }

    .divider {
        color: #fff;
        border-radius: 10px;
        text-align: left;
        padding: 4px 0px 4px 15px;
        margin: 20px 20px 0px 20px;
        font-weight: bold;
    }

    .error-text {
        color: #dc3545;
        font-size: 14px;
        position: absolute;
        top: 17px;
        right: 60px;
    }

    .error-text-sm {
        color: #dc3545;
        font-size: 14px;
        position: absolute;
        top: 8px;
        right: 35px;
    }
</style>