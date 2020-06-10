<template>
  <b-container class="mt-5">
    <b-row align-h="end">
      <b-col md="7" sm="12" lg="5">
        <!--<b-form>-->
          <b-card header-tag="header" footer-tag="footer" footer-class="my_class">
            <template v-slot:header>
              <h5 align="start" class="mb-0">Login</h5>
            </template>
            <b-card-text align="start">
              <label for="username" style="margin-bottom: 0px; font-size: 14px;">
                User Name:
              </label>
              <b-form-input id="username" v-model="login_data.username" size="sm" name="username"
                            type="text" required v-validate="'required'"
                            :state="validateState('username')" data-vv-name="username">
              </b-form-input>
              <br>
              <label for="username" style="margin-bottom: 0px; font-size: 14px;">
                Password:
              </label>
              <b-form-input name="password" v-model="login_data.password" size="sm"
                            type="password" required v-validate="'required'"
                            data-vv-name="password" :state="validateState('password')"
                            @keyup.enter="login">
              </b-form-input>
            </b-card-text>

            <template v-slot:footer>
              <b-row align-h="end">
                <b-overlay
                  :show="loading"
                  rounded
                  opacity="0.6"
                  spinner-small
                  spinner-variant="primary"
                  class="d-inline-block"
                >
                  <b-button variant="primary" size="sm" @click="login">Login</b-button>
                </b-overlay>
              </b-row>
            </template>
          </b-card>
        <!--</b-form>-->
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  export default {
    name: "login",
    data() {
      return {
        login_data: {
          username: null,
          password: null,
        },
        loading: false,
      }
    },
    methods: {
      validateState(ref) {
        if (
          this.veeFields[ref] &&
          (this.veeFields[ref].dirty || this.veeFields[ref].validated)
        ) {
          return !this.veeErrors.has(ref);
        }
        return null;
      },
      login() {
        this.loading=true;
        this.$validator.validateAll().then(isValid => {
          if (isValid) {
            this.$auth.login({
              data: this.login_data,
              rememberMe: false,
              redirect: '/',
              fetchUser: true,
            }).then(() => {
              this.loading = false;
              this.$bvToast.toast("Login Successfully", {
                title: 'Success',
                variant: 'success',
                autoHideDelay: 4000,
              });
            }).catch((error) => {
              this.loading = false;
              this.$bvToast.toast(error.toString(), {
                title: 'Failed',
                variant: 'danger',
                autoHideDelay: 4000,
              });
            });
          }
          else{
            this.loading = false;
            this.$bvToast.toast('Please fill a Required fields', {
              title: 'Failed',
              variant: 'danger',
              autoHideDelay: 4000,
            });
          }
        })
      }
    }
  }
</script>

<style scoped>
  .my_class {
    background: none;
    border: none;
  }
</style>
