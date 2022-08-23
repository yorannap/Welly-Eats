<template>
  <div class="featured-image">
    <svg width="241" height="123" viewBox="0 0 241 123" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern :id="PlaceImage" patternUnits="userSpaceOnUse" width="500" height="500">
          <image :xlink:href="PlaceImage" x="0" y="0" />
      </pattern>
    </defs>
    <path :fill="'url(#' + PlaceImage + ')'" d="M221.788 122.064C232.833 122.064 241.956 113.049 240.145 102.153C236.019 77.3255 224.244 54.2121 206.215 36.1832C183.438 13.4062 152.546 0.610232 120.334 0.610229C88.1228 0.610227 57.2306 13.4062 34.4536 36.1831C16.4247 54.212 4.64931 77.3254 0.523372 102.153C-1.28741 113.049 7.83503 122.064 18.8807 122.064L77.1789 122.064C87.6634 122.064 95.8288 112.386 103.242 104.972C107.775 100.439 113.924 97.8922 120.334 97.8923C126.745 97.8923 132.893 100.439 137.426 104.972C144.84 112.386 153.005 122.064 163.49 122.064H221.788Z" />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    PlaceImage: String
  },
};
</script>

<style>
.featured-image {
  margin-top: -60px;
}

.featured-image svg {
  width: 100%;
}

.featured-image svg image {
  width: 100%;
  min-height: 100%;
}

.featured-image svg path {
  width: 100%;
  min-height: 100%;
}
</style>
