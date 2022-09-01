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
     <TransitionGroup class="results" name="cards" tag="div" appear>
      <place-card  v-for="(place, id) in getFilteredPlaces" :key="id" :place="place"></place-card>
    </TransitionGroup>
  </div>
</template>

<script>
import gsap from "gsap";
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
  /* watch: {
    // whenever question changes, this function will run
    getFilteredPlaces(newPlaces, oldPlaces) {
      this.animateCards(newPlaces, oldPlaces)
    }
  }, */
  methods: {
    handleSearch(e) {
      this.$store.dispatch('filterSearch', e.target.value)
    },
    rollDice() {
      this.$store.dispatch('rollDice')
    },
    /* animateCardEnter(el, done) {
      gsap.from(el, {
        scale: 0.8,
        y: "50px",
        opacity: 0,
        ease: "power4.out",
        duration: 0.5,
        onComplete: done
      });
    },
    animateCardLeave(el, done) {
      gsap.to(el, {
        scale: 0.8,
        y: "-50px",
        opacity: 0,
        ease: "power4.in",
        duration: 0.5,
        onComplete: done
      });
    } */
  }
}
</script>

<style>
.results {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>