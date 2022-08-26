<template>
  <div 
    class="tag"
    :class="{ active: isActive }" 
    :data="PlaceTag"
    @click="handleTags"
    >
    <div class="tag-wrap">
      <img 
        class="icon"
        :src="defineTagIcon" 
        :alt="PlaceTag" 
      >
      <p>{{ PlaceTag }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    PlaceTag: String
  },
  methods: {
    handleTags(e) {
      let tag = e.currentTarget.attributes.data.value
      this.$store.dispatch('filterTags', tag)
    },
  },
  computed: {
    ...mapGetters(["getActiveTags", "getTags"]),
    defineTagIcon() {
      let tagIcon = this.getTags.filter(tag => tag.Name === this.PlaceTag)[0]
      if(tagIcon !== undefined) {
        return tagIcon.Icon
      }
      else {
        console.log(this.getTags)
        let serveIcon = this.getTags.find(tag => tag.Name === 'Serve')
        return serveIcon.Icon
      }
    },
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
/** CARD TAGS **/
.tag {
  background-color: white;
  border: 2px solid var(--color-grey-light);
  display: inline-block;
  padding: 5px 12px 5px 8px;
  margin: 3px;
  border-radius: var(--border-radius-s);
  cursor: pointer;
  min-height: 30px;
}

.tag p {
  color: var(--color-grey);
  font-size: 0.8em;
}

.tag:hover p {
  color: var(--color-primary);
}

.tag:hover {
  background-color: var(--color-grey-light);
}


.tag.active {
  background-color: var(--color-grey-light);
}

.tag.active p {
  color: var(--color-primary);
}

.tag-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  height: 100%;
}

img.icon {
  display: inline;
  max-width: 20px;
}

/** MAIN TAGS **/

.main-tags .tag {
  padding: 5px 15px 5px 11px;
  background-color: white;
}

.main-tags .tag:hover {
  border-color: var(--color-primary);
}

.main-tags .tag.active {
  border-color: var(--color-primary);
}

.main-tags img.icon {
  max-width: 30px;
}

.main-tags .tag p {
  font-size: 1em;
}
</style>
