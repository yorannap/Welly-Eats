<template>
  <a class="pin" :href="`https://maps.google.com/?q=${PlaceName}`" target="_blank">
    <img src="/icons/pin.svg" alt="Get directions">
  </a>
</template>

<script>
export default {
  props: {
    PlaceName: String
  },
};
</script>

<style>
.pin {
  width: 30px;
  height: 50px;
  margin: auto;
  margin-top: -25px;
  margin-bottom: 10px;
  display: block;
  border-radius: var(--border-radius-m);
  background-color: var(--color-highlight);
  transition: var(--transition);
}

.pin:hover {
  opacity: 0.8;
}

.pin img {
  width: 100%;
  height: 100%;
  padding: 9px;
}
</style>
