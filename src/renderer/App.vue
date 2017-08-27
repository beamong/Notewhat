<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'notewhat',
}
</script>

<style>
/* CSS */

#app {
  position: fixed;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}
</style>
