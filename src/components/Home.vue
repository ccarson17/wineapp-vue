<template>
  <div id="home" class="content-centered-absolute">
    <!-- <h1>Custom Login Page with Sign In Widget</h1> -->
    <div v-if="!this.$parent.authenticated">
      <h4>Welcome to OenoFile! Please log in.</h4><br/>
      <router-link role="button" to="/login" class="btn btn-primary btn-lg">
        <div class="d-flex justify-content-center"><span class="material-icons" style="margin-right: 10px; font-size: 36px">login</span><span style="font-size: 22px; margin-right: 10px;">Log In</span></div>
      </router-link>
    </div>

    <div v-if="this.$parent.authenticated">
      <h2>Welcome, {{myName}}!</h2>
      <p>To get started, click on bottles or racks to the left.</p>
<!--       <p>Your Wine API Key is: {{myKey}}</p>
 -->    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  computed: {
    myKey() {
      return this.$store.state.wineApiKey;
    },
    myName() {
      return this.$store.state.given_name;
    },
  },
  data: function () {
    return {
      claims: ''
    }
  },
  async created () { },
  async updated () {
    await this.setup();
    if((this.$store.state.wineApiKey === null || typeof(this.$store.state.wineApiKey) == 'undefined')
      && (this.claims != '')) {
      this.$store.dispatch('getWineApiKey', this.claims);
    }
  },
  methods: {
    async setup () {
      if (this.$parent.authenticated && this.claims == '') {
        this.claims = await this.$auth.getUser();
      }
    }
  },
/*   watch: {
    watchApiKey() {
      this.myKey = this.$store.state.wineApiKey;
    }
  }, */
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
}
.btn-primary:hover, .btn-primary:focus, .btn-primary:active, .btn-primary.active, .open>.dropdown-toggle.btn-primary {
    color: #fff;
    background-color: #396485;
    border-color: #396485; /*set the color you want here*/
}
</style>
