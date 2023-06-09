<template>
  <GameControl></GameControl>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import GameControl from './components/GameBox.vue';
  export default defineComponent({
    name: 'App',
    components: {GameControl}
  });
</script>
