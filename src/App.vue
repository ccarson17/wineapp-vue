<template>
  <div id="app" class="d-flex flex-row" style="height: 100%">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
    <div class="d-flex flex-column flex-shrink-0 p-3 sidebar-bg" style="width: 280px; height: 100%">
    <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto sidebar-text text-decoration-none">
      <div><img src="./assets/app_logo4.png" width="72" height="80" style="margin-right: 10px"></div>
      <div><span class="fs-2">OenoFile</span><span class="fs-8" style="display: block; margin-top: -12px">Track Your Wine</span></div>
    </a>
    <hr>
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item">
        <router-link to="/home" class="nav-link sidebar-link" active-class="active active-bg" :class="{'active active-bg': this.$route.path == '/'}">
          <div class="d-flex"><span class="material-icons" style="margin-right: 10px">home</span><span>Home</span></div>
        </router-link>
      </li>
      <li>
        <router-link to="/bottles" class="nav-link sidebar-link" active-class="active active-bg" v-if="authenticated">      
          <div class="d-flex">
            <img src="./assets/bottle_144px.png" style="margin-right: 10px" width="24px" height="24px" class="filtered" v-if="this.$route.path != '/bottles' && this.$store.state.theme.name != 'Noir (Dark)'">
            <img src="./assets/bottle_144px_light.png" style="margin-right: 10px" width="24px" height="24px" class="filtered" v-if="this.$route.path == '/bottles' || this.$store.state.theme.name == 'Noir (Dark)'">
            <span>Bottles</span>
          </div>
        </router-link>
      </li>
      <li>
        <router-link to="/racks" class="nav-link sidebar-link" active-class="active active-bg" v-if="authenticated">
          <div class="d-flex"><span class="material-icons" style="margin-right: 10px">grid_on</span><span>Racks</span></div>
        </router-link>
      </li>
      <li>
        <router-link to="/history" class="nav-link sidebar-link" active-class="active active-bg" v-if="authenticated">
          <div class="d-flex"><span class="material-icons" style="margin-right: 10px">history</span><span>History</span></div>
        </router-link>
      </li>      <li>
        <router-link to="/login" v-if="!authenticated" class="nav-link sidebar-link" active-class="active active-bg">
          <div class="d-flex"><span class="material-icons" style="margin-right: 10px">login</span><span>Log In</span></div>
        </router-link>
      </li>
<!--       <li>
        <select @change="changeTheme()" id="themeSelector" class="form-select" aria-label="Theme selector" v-model="currentThemeName">
            <option value="Default" selected>Default</option>
            <option value="Cabernet">Cabernet</option>
            <option value="Chardonnay">Chardonnay</option>
            <option value="Noir (Dark)">Noir (Dark)</option>
        </select>
      </li> -->
    </ul>
    <hr v-if="authenticated">
    <div class="dropdown" v-if="authenticated" style="margin-bottom: 10px; margin-top: 10px">
      <a href="#" class="d-flex align-items-center sidebar-link text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
        <span class="material-icons rounded-circle me-2 sidebar-link" style="font-size: 36px; padding:0px">account_circle</span>
        <!-- <img src="./assets/app_logo4.png" alt="" width="36" height="40" class="rounded-circle me-2"> -->
        <strong>My Account</strong>
      </a>
      <ul class="dropdown-menu text-small shadow input-color" aria-labelledby="dropdownUser2">
        <li class="dropdown-name">{{this.$store.state.userName}}</li>
        <li class="dropdown-email">{{this.$store.state.userEmail}}</li>
        <li><hr class="dropdown-divider"></li>
        <li><router-link to="/settings" v-if="authenticated" class="dropdown-item dropdown-theme">Settings</router-link></li>
        <li><router-link to="/profile" v-if="authenticated" class="dropdown-item dropdown-theme">Profile</router-link></li>
        <li><router-link to="/import" v-if="authenticated" class="dropdown-item dropdown-theme">Import Data</router-link></li>
        <li><hr class="dropdown-divider"></li>
        <li><router-link to="/" v-on:click.native="logout()" class="dropdown-item dropdown-theme">Log Out</router-link></li>
      </ul>
    </div>
    </div>
    <div class="d-flex flex-column p-2 content-bg" style="width: 100%">
      <div id="content" style="height:100%">
        <router-view v-on:refresh_me="refreshPage" :key='keyVal' />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data: function () {
    return { 
        authenticated: false,
        keyVal: 0,
        themes: [{
          name: "Default",
          href: "/css/default.css",
          id: "default-theme-style",  
          swalColor: "#396485"       
        },
        {
          name: "Noir (Dark)",
          href: "/css/noirtheme.css",
          id: "noir-theme-style",
          swalColor: "#212529",     
        },
        {
          name: "Cabernet",
          href: "/css/cabernettheme.css",
          id: "cabernet-theme-style",  
          swalColor: "#540000",       
        },
        {
          name: "Chardonnay",
          href: "/css/chardonnaytheme.css",
          id: "chardonnay-theme-style",  
          swalColor: "#355c37",       
        }],
        currentThemeName: null,
        currentTheme: {},
      }
  },
  created () {
    document.getElementsByTagName("BODY")[0].style.display = "none";
    this.isAuthenticated();
    this.$auth.authStateManager.subscribe(this.isAuthenticated);
    this.currentTheme = this.$store.state.theme;
    this.changeTheme();
  },
  computed: {
    classObject: function () {
      return {
        'active': true,
        'link-dark': false,
      }
    }
  },
  watch: {
    // Everytime the route changes, check for auth status
    '$route': 'isAuthenticated'
  },
  methods: {
    popupTest() {
        this.$swal({
            title: "<h3 style='color: white'>Bottle Updated. Test.</h3>",
            background: this.$store.state.theme.swalColor,
        });
    },
    changeTheme() {
      if(this.currentThemeName) {
        this.currentTheme = this.themes.find(x => x.name === this.currentThemeName);
        if(!this.currentTheme) this.currentTheme = this.themes[0]; // set to default if not found
      }
      this.$store.dispatch('changeTheme', this.currentTheme);

      // add theme
      let themeLinkEl = document.createElement("link");
      themeLinkEl.setAttribute("rel", "stylesheet");
      themeLinkEl.setAttribute("href", this.currentTheme.href);
      themeLinkEl.setAttribute("id", this.currentTheme.id);
      let docHead = document.querySelector("head");
      docHead.append(themeLinkEl);

      // remove other themes
      this.themes.forEach(x => {
        if(x.name !== this.currentTheme.name) {
          let oldThemeLinkEl = document.querySelector("#" + x.id);
          if(oldThemeLinkEl) {
            let parentNode = oldThemeLinkEl.parentNode;
            parentNode.removeChild(oldThemeLinkEl); 
          }        
        }
      });
      document.getElementsByTagName("BODY")[0].style.display = "block";
    },
    async isAuthenticated () {
      this.authenticated = await this.$auth.isAuthenticated();
    },
    async logout () {
      sessionStorage.clear();
      await this.$auth.signOut();
      await this.isAuthenticated();
    },
    refreshPage() {
      this.keyVal++;
    },
  }
}
</script>

<style>
nav div a { margin-right: 10px }
html, body {
    height:100%;
}
body {
    margin: 0;
}
.dropdown-name {
  font-weight: bold;
  padding: 0px 15px 0px 15px;
}
.dropdown-email {
  font-style: italic;
  font-size: 14px;
  padding: 0px 15px 0px 15px;
}
.filtered img {
  -webkit-filter: filter(1);
  filter: filter(1);
}
.content-centered-absolute {
  text-align: center;
  margin: 0;
  position: absolute;
  top: 50%;
  left: calc(50% + 145px);
  transform: translate(-50%, -50%);
}
.content-centered-horizontal {
  text-align: center;
  margin: 0;
}
/* .active-bg {
  background-color: #5599CC !important;
} */
</style>
