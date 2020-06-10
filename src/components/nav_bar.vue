<template>
  <b-navbar toggleable="sm" type="dark" sticky variant="info">
    <b-navbar-brand>Doctor App </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" small v-if="!['login', 'about'].includes($route.name)"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto" v-if="!['login','about'].includes($route.name)">

        <b-nav-item-dropdown right v-if="!['login','about'].includes($route.name)">
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <span class="h5 text-capitalize" v-if="$auth.user()">
              <b-icon icon="person-fill"></b-icon>
              {{$auth.user().username}}
            </span>
          </template>

          <b-dropdown-item @click="logout()">
            <b-icon icon="power" aria-hidden="true"></b-icon> Logout
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
  export default {
    name: "nav_bar",
    methods:{
      logout() {
        this.$auth.logout({
          makeRequest: true,
          redirect: { name: 'login' },
        }).then(() => {
          this.$bvToast.toast("Logout Successfully.", {
            title: 'Success',
            variant: 'success',
            autoHideDelay: 4000,
          });
        }).catch((error) => {
          this.$bvToast.toast(error.response.data, {
            title: 'Success',
            variant: 'danger',
            autoHideDelay: 4000,
          });
        });
      },
    }
  }
</script>

<style scoped>

</style>
