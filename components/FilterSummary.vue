<template>
  <div class="summary">
    <p>Showing {{ getFilteredPlaces.length }}
      <span v-if="getFilteredPlaces.length === 1">
        place.
      </span>
      <span v-else-if="getFilteredPlaces.length > 1">
        places by
        <select id="order" name="order" @change="handleOrder($event.target.value)">
          <option value="Random">Random</option>
          <option value="Rating">Rating</option>
          <option value="Name">Name</option>
        </select>
      </span>
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
    ...mapGetters(["getCanClear", "getFilteredPlaces", "getFilterOrder"]),
  },
  methods: {
    clearFilters() {
      this.$store.dispatch('clearFilters')
    },
    handleOrder(order) {
      this.$store.dispatch('filterOrder', order)
    }
  },
};
</script>

<style>
.summary {
  margin-top: 10px;
}

#order, .clear-filters {
  cursor: pointer;
  font-size: 1em;
  background: none;
  padding: 0;
  border: none;
  text-transform: lowercase;
  border-bottom: 1px solid var(--color-primary);
  width: auto;
}

.clear-filters {
  margin-left: 5px;
  padding: 1px 2px;
}
</style>
