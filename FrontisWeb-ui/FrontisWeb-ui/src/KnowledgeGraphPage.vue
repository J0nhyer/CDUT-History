<template>
  <div class="knowledge-graph-page">
    <SimplePersonGraph />
  </div>
</template>

<script>
import SimplePersonGraph from '@/components/SimplePersonGraph.vue'

export default {
  name: 'KnowledgeGraphPage',
  components: {
    SimplePersonGraph
  }
}
</script>

<style scoped>
.knowledge-graph-page {
  min-height: 100vh;
  background: #000000;
}
</style>

