<template>
  <div class="summary">
    <p>Showing {{ getFilteredPlaces.length }} results.
      <span 
        class="clear-filters"
        @click="clearFilters"
        v-if="getCanClear"
      >Clear filters
      </span>
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getCanClear", "getFilteredPlaces"]),
  },
  methods: {
    clearFilters() {
      this.$store.dispatch('clearFilters')
    },
  },
};
</script>

<style>
.summary {
  margin-top: 10px;
}

.clear-filters {
  text-decoration: underline;
  cursor: pointer;
} 
</style>
