<template>
  <div class="card" :data-place-id="place.PlaceId">
    <place-image :PlaceImage="place.FeaturedImage"></place-image>
    <place-pin :PlaceName="place.Name + ' Wellington'"></place-pin>
    <h3 class="title">{{ place.Name }}</h3>
    <place-details :place="place"></place-details>
    <p class="description" :title="place.Description">{{ place.Description }}</p>
    <div class="tags">
      <filter-tag v-for="(tag, id) in place.Tags" :key="id" :PlaceTag="tag"></filter-tag>
    </div>
    <a :href="place.Website" class="button" target="_blank">More details</a>
  </div>
</template>

<script>
import gsap from "gsap";
import { mapGetters } from "vuex";
import PlaceDetails from '../components/PlaceDetails.vue'
import PlaceImage from '../components/PlaceImage.vue'
import PlacePin from '../components/PlacePin.vue'
import FilterTag from '../components/FilterTag.vue'

export default {
  props: {
    place: Object
  },
  components: {
    PlaceDetails,
    PlaceImage,
    PlacePin,
    FilterTag
  },
  computed: {
    //...mapGetters([ "getFilteredPlaces"])
  },
  /* watch: {
    // whenever question changes, this function will run
    getFilteredPlaces(newPlaces, oldPlaces) {
      //this.animateCards(newPlaces, oldPlaces)
        console.log("TRIGGER")
      newPlaces.forEach(place => {
        let card = document.querySelectorAll(`.card[data-place-id='${place.PlaceId}']`);
        //console.log("CARD: ", place.Name, card)
        gsap.from(card, {
          scale: 0.8,
          y: "-50px",
          opacity: 0,
          ease: "power4.out",
          duration: 1
        });
      });
    }
  }, */
  /* methods: {
    animateCards(newPlaces, oldPlaces) {
      //console.log(newPlaces, oldPlaces)
      let oldPlacesIds = []

      /* gsap.from(cards, {
        scale: 1,
        y: "50px",
        opacity: 0,
        ease: "power4.out",
        duration: 1,
        delay: 1
      });
    }
  }, */
};
</script>

<style>
.card {
  width: 31%;
  margin: 1%;
  margin-bottom: 50px;
  text-align: center;
  background-color: white;
  box-shadow: var(--shadow-primary);
  border-radius: var(--border-radius-m);
  padding: 35px 25px;
}

@media screen and (max-width: 800px) {
  .card {
    width: 48%
  }
}

@media screen and (max-width: 500px) {
  .card {
    width: 100%
  }
}

.card h3 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description {
  -webkit-line-clamp: 2;
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
}

.description, .details, .title {
  cursor: default;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 600px;
  margin: auto;
  margin-top: 10px;
}
</style>
