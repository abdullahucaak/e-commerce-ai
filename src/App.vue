<script setup>
import { RouterView } from 'vue-router'
/* pinia */
import { useProductStore } from './stores/productStore';
const productStore = useProductStore()

/* getProducts */
productStore.getProducts() 

</script>

<template>

  <RouterView />
</template>
<style scoped>

</style>
