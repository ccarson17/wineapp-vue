<template>
  <div class="login login-container">
    <div id="okta-signin-container"></div>
  </div>
</template>

<script>
import OktaSignIn from '@okta/okta-signin-widget'
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css'

export default {
  name: 'Login',
  mounted: function () {
    this.$nextTick(function () {
      this.widget = new OktaSignIn({
        baseUrl: 'https://dev-364313.okta.com',
        clientId: '0oa3e2hnb2jqsNipY4x7',
        redirectUri: 'https://master.d2e0r6wdrmawu9.amplifyapp.com/login/callback',
        logo: require('../assets/app_logo4.png'),
        features: { registration:true },
        authParams: {
          pkce: true,
          issuer: 'https://dev-364313.okta.com/oauth2/default',
          display: 'page',
          scopes: ['openid', 'profile', 'email']
        }
      })
      this.widget.showSignInAndRedirect(
        { el: '#okta-signin-container' }
      )
/*       this.widget.showSignInToGetTokens({
        el: '#okta-signin-container',
        scopes: ['openid', 'profile', 'email'],
      }).then(tokens => {
        this.$auth.handleLoginRedirect(tokens)
      }).catch(err => {
        throw err
      }) */
    })
  },
  destroyed () {
    // Remove the widget from the DOM on path change
    this.widget.remove()
  }
}
</script>

<style scoped>
    .login-container {
        vertical-align: center;
        position: absolute;
        width: calc(100% - 290px);
    }
</style>
