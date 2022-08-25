<template>
  <div class="card">
    <place-image :PlaceImage="place.FeaturedImage"></place-image>
    <place-pin :PlaceName="place.Name + ' Wellington'"></place-pin>
    <h3 class="title">{{ place.Name }}</h3>
    <div class="details">
      <is-open :IsOpen="place.IsOpen"></is-open>
      <place-rating :Rating="place.Rating"></place-rating>
    </div>
    <p class="description" :title="place.Description">{{ place.Description }}</p>
    <div class="tags">
      <filter-tag v-for="(tag, id) in place.Tags" :key="id" :PlaceTag="tag"></filter-tag>
    </div>
    <a :href="place.Website" class="button" target="_blank">More details</a>
  </div>
</template>

<script>
import IsOpen from '../components/IsOpen.vue'
import PlaceRating from '../components/PlaceRating.vue'
import PlaceImage from '../components/PlaceImage.vue'
import PlacePin from '../components/PlacePin.vue'
import FilterTag from '../components/FilterTag.vue'

export default {
  props: {
    place: Object
  },
  components: {
    IsOpen,
    PlaceRating,
    PlaceImage,
    PlacePin,
    FilterTag
  }
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

.card h3 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.details {
  padding-top: 3px;
  padding-bottom: 10px;
}

.details p,
.details div {
  display: inline;
  color: var(--color-grey);
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
  margin-top: 10px;
}
</style>
