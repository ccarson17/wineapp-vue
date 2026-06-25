<template>
    <div id="home" class="content-centered-absolute">
        <div v-if="!isAuthenticated">
            <h4>Welcome to OenoFile! Please log in.</h4><br />
            <button class="btn btn-primary btn-lg" @click="login">
                <div class="d-flex justify-content-center">
                    <span class="material-icons" style="margin-right: 10px; font-size: 36px">login</span>
                    <span style="font-size: 22px; margin-right: 10px;">Log In</span>
                </div>
            </button>
        </div>
        <div v-else>
            <h2>Welcome, {{ userName }}!</h2>
            <p>To get started, click on bottles or racks to the left.</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'HomeView',
        inject: ['msalInstance'],
        data() {
            return {
                claims: '',
            };
        },
        computed: {
            isAuthenticated() {
                return this.msalInstance.getAllAccounts().length > 0;
            },
            user() {
                return this.isAuthenticated ? this.msalInstance.getAllAccounts()[0] : null;
            },
            userName() {
                return this.user ? (this.user.name || this.user.username) : '';
            }
        },
        watch: {
            isAuthenticated: {
                immediate: true,
                handler(newVal) {
                    if (newVal) {
                        this.fetchApiKeyIfNeeded();
                    }
                }
            }
        },
        methods: {
            login() {
                this.msalInstance.loginRedirect();
            },
            async fetchApiKeyIfNeeded() {
                if (this.isAuthenticated && this.claims === '' && this.user) {
                    if (this.$store.state.wineApiKey && this.$store.state.wineApiKey !== this.user.localAccountId) {
                        this.$store.commit('clearUserData');
                    }
                    this.claims = this.user.localAccountId;
                    this.$store.commit('updateUserProfile', {
                        apiUserId: this.user.localAccountId,
                        name: this.user.name || this.user.username || '',
                        email: this.user.username || '',
                        given_name: this.user.name || ''
                    });
                }
            }
        }
    };
</script>

<style scoped>
    .header-bg-color {
        background-color: #396485;
    }

    .btn-primary {
        color: #fff;
        background-color: #5599CC;
        border-color: #5599CC;
    }

        .btn-primary:hover, .btn-primary:focus, .btn-primary:active, .btn-primary.active, .open > .dropdown-toggle.btn-primary {
            color: #fff;
            background-color: #396485;
            border-color: #396485; /*set the color you want here*/
        }
</style>