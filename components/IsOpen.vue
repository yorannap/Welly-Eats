<template>
  <div class="isopen">
    <p v-if="IsOpen" class="open">Open now</p>
    <p v-else class="closed">Closed</p>
  </div>
</template>

<script>
export default {
  props: {
    IsOpen: Boolean
  },
};
</script>

<style>
.details .isopen {
  margin-right: 4px;
}

.details .isopen p::before {
  content: '';
  width: 8px;
  height: 8px;
  margin-right: 4px;
  vertical-align: baseline;
  display: inline-block;
  border-radius: 5px;
}

.details .isopen .open::before {
  background-color: #59BC72;
}

.details .isopen .closed::before {
  background-color: #ED6B19;
}
</style>
