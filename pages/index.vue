<template>
  <div id="page">
    <div class="heading">
      <div class="title">
        <p class="subtitle">Wellington Eats</p>
        <h1 class="title">What's the mood?</h1>
      </div>
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
    <div id="result-container">
      <div class="results">
        <place-card  v-for="(place, id) in getFilteredPlaces" :key="id" :place="place" :index="id"></place-card>
      </div>
    </div>
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
      "getFilteredPlaces", "getFilterSearchTerm", "getAllTags", "getActiveTags", "getInitAnimationComplete"
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
      if(this.getInitAnimationComplete) {
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
    }
  },
  transition: {
    name: "home",
    css: false,
    appear: true,
    enter(el, done) {
      let heading = document.querySelectorAll('#page .heading > *')
      let cards = document.querySelectorAll('#result-container')
      let body = [...heading]
      gsap.from(body, {
        scale: 0.8,
        y: "50px",
        opacity: 0,
        ease: "power4.out",
        duration: 0.75,
        stagger: 0.1,
        delay: 2,
      });
      gsap.from(cards, {
        scale: 0.9,
        opacity: 0,
        ease: "power4.out",
        duration: 1,
        delay: 2.75,
        onComplete: done
      });
    },
    afterEnter() {
      this.$store.state.moduleInit.initAnimationComplete = true
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