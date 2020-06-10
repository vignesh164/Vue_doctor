<template>
  <div id="app">
      <my_nav></my_nav>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
<script>
  import my_nav from "./components/nav_bar";
  export default {
    components: {my_nav}
  }
</script>
