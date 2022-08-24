<template>
    <p 
      class="tag"
      :class="{ active: isActive }" 
      :data="PlaceTag"
      @click="handleTags">
    {{ PlaceTag }}
    </p>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    PlaceTag: String
  },
  methods: {
    handleTags(e) {
      let tag = e.target.attributes.data.value
      this.$store.dispatch('filterTags', tag)
    },
  },
  computed: {
    ...mapGetters(["getActiveTags"]),
    isActive() {
      if(this.getActiveTags.includes(this.PlaceTag)) {
        return true
      }
      else {
        return false
      }
    }
  }
};
</script>

<style>
.tag {
  background-color: var(--color-grey-light);
  display: inline-block;
  padding: 5px 8px;
  margin: 3px;
  border-radius: var(--border-radius-s);
  color: var(--color-grey);
  cursor: pointer;
}

.tag:hover {
  opacity: 0.8;
}

.tag.active {
  background-color: var(--color-grey);
  color: var(--color-grey-light);
}
</style>
