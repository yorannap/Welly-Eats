<template>
  <div class="rating">
    <p>{{ Rating }} stars</p>
  </div>
</template>

<script>
export default {
  props: {
    Rating: Number
  },
};
</script>

<style>
.details .rating p::before {
  content: '';
  background-image: url('/icons/star.svg');
  background-size: 14px 14px;
  width: 14px;
  height: 14px;
  margin-right: 4px;
  vertical-align: middle;
  display: inline-block;
}
</style>
