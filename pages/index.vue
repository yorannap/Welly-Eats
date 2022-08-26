<template>
  <div id="page">
    <div class="heading">
      <p class="subtitle">Wellington Eats</p>
      <h1 class="title">What's the mood?</h1>
      <div class="search">
        <input 
          type="Search" 
          aria-label="Search place name or location..." 
          placeholder="Search place name or location..."
          :value="getFilterSearchTerm"
          @input="handleSearch"
        >
        <div class="dice" @click="rollDice">
          <img src="/icons/dice.svg" alt="Roll dice">
        </div>
      </div>
      <div class="tags main-tags">
        <filter-tag 
          v-for="(tag, id) in getAllTags" :key="id"
          :PlaceTag="tag"
        ></filter-tag>
      </div>
      <filter-summary></filter-summary>
    </div>
    <div class="results">
      <place-card  v-for="(place, id) in getFilteredPlaces" :key="id" :place="place"></place-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PlaceCard from '../components/PlaceCard.vue'
import FilterTag from '../components/FilterTag.vue'
import FilterSummary from '../components/FilterSummary.vue'

export default {
  components: {
    PlaceCard,
    FilterTag,
    FilterSummary
  },
  computed: {
    ...mapGetters([
      "getFilteredPlaces", "getFilterSearchTerm", "getAllTags", "getActiveTags"
    ])
  },
  methods: {
    handleSearch(e) {
      this.$store.dispatch('filterSearch', e.target.value)
    },
    rollDice() {
      this.$store.dispatch('rollDice')
    }
  }
}
</script>