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
     <Transition @enter="animateCardEnter">
      <div class="results">
        <place-card  v-for="(place, id) in getFilteredPlaces" :key="id" :place="place"></place-card>
      </div>
    </Transition>
  </div>
</template>

<script>
import gsap from "gsap";
import { mapGetters } from "vuex";
import PlaceCard from '../components/PlaceCard.vue'
import FilterTag from '../components/FilterTag.vue'
import FilterSummary from '../components/FilterSummary.vue'

export default {
  data() {
    return {
      initAnimationComplete: false
    }
  },
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
  watch: {
    getFilteredPlaces(newPlaces, oldPlaces) {
      this.animateCardEnter()
    }
  },
  methods: {
    handleSearch(e) {
      this.$store.dispatch('filterSearch', e.target.value)
    },
    rollDice() {
      this.$store.dispatch('rollDice')
    },
    animateCardEnter(el, done) {
      el = document.querySelector('.results')
      gsap.fromTo(el, {
        scale: 0.8,
        y: "50px",
        opacity: 0,
      },
      {
        scale: 1,
        y: "0px",
        opacity: 1,
        ease: "expo.out",
        duration: 0.75,
        onComplete: done
      });
    }
  },
  transition: {
    name: "home",
    css: false,
    appear: true,
    enter(el, done) {
      el = document.querySelectorAll('#page .heading > *')
      gsap.fromTo(el, {
        scale: 0.8,
        y: "50px",
        opacity: 0,
      },
      {
        scale: 1,
        y: "0px",
        opacity: 1,
        ease: "expo.out",
        duration: 0.75,
        stagger: 0.1,
        onComplete: done
      });
    },
    afterEnter() {
      this.animateCardEnter()
      this.initAnimationComplete = true
      console.log(this.initAnimationComplete)
    }
  },
}
</script>

<style>
.results {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>