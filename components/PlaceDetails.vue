<template>
  <div class="details">
    <div v-if="!place.GoogleFetched" class="skeleton">
    </div>
    <div v-else>
      <is-open :IsOpen="place.IsOpen"></is-open>
      <place-rating :Rating="place.Rating"></place-rating>
    </div>
  </div>
</template>

<script>
import IsOpen from '../components/IsOpen.vue'
import PlaceRating from '../components/PlaceRating.vue'

export default {
  props: {
    place: Object
  },
  components: {
    IsOpen,
    PlaceRating,
  }
};
</script>

<style>
.details {
  padding-top: 3px;
  padding-bottom: 10px;
}

.details p,
.details div {
  display: inline;
  color: var(--color-grey);
}
</style>
