<template>
  <div id="profile" class="content-centered-horizontal text-default">
    <h1>My User Profile (ID Token Claims)</h1>
    <p>
      Below is the information from your ID token.
    </p>
    <table class="content-centered-absolute">
      <thead>
        <tr>
          <th style="text-align: right; padding-right:10px">Claim</th>
          <th style="text-align: left; padding-left:10px">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(claim, index) in claims" :key="index">
          <td style="text-align: right; padding-right:10px">{{claim.claim}}</td>
          <td style="text-align: left; padding-left:10px" :id="'claim-' + claim.claim">{{claim.value}}</td>
        </tr>
        <tr>
          <td style="text-align: right; padding-right:10px">
            Theme
          </td>
          <td>
            <select @change="changeTheme()" id="themeSelector" class="form-select input-color" aria-label="Theme selector" v-model="currentThemeName">
                <option v-for="(theme, idx) in themes" :key="idx" :value='theme.name'>{{theme.name}}</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
export default {
  name: 'Profile',
  data () {
    return {
      claims: [],
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
  methods: {
    changeTheme() {
      document.getElementsByTagName("BODY")[0].style.display = "none";
      if(this.currentThemeName) {
        this.currentTheme = this.themes.find(x => x.name === this.currentThemeName);
        if(!this.currentTheme) this.currentTheme = this.themes[0]; // set to default if not found
      }
      this.$store.dispatch('changeTheme', this.currentTheme).then(this.currentThemeName = this.currentTheme.name);

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
  },
  async created () {
    this.currentTheme = this.$store.state.theme;
    this.changeTheme();
    this.claims = await Object.entries(await this.$auth.getUser()).map(entry => ({ claim: entry[0], value: entry[1] }))
  }
}
</script>
