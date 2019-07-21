<template>
  <div>
    <div>
      <input type="range" v-model="x1" />
      <input type="range" v-model="y1" />
      <input type="range" v-model="x2" />
      <input type="range" v-model="y2" />
    </div>
    <svg ref="canv" width="400" height="400" viewBox="0 0 400 400">
      <!-- objectは％単位 -->
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="g0" :x1="x1" :y1="y1" :x2="x2" :y2="y2">
          <stop offset="0" stop-color="black" />
          <stop offset="1" stop-color="white" />
        </linearGradient>
      </defs>
      <text x="100" y="50" fill="black">{{msg}}</text>
      <rect x="0" y="0" width="100" height="100" fill="url(#g0)" />
      <rect x="50" y="50" width="100" height="100" fill="url(#g0)" />
      <rect ref="p1" x="0" y="0" width="10" height="10" fill="white" stroke="black" />
    </svg>
  </div>
</template>
<script>
import Draggable from "gsap/Draggable";
export default {
  data() {
    return {
      msg: "123",
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100
    };
  },
  mounted() {
    Draggable.create(this.$refs.p1, {
      type: "x,y",
      edgeResistance: 0.65,
      bounds: this.$refs.canv,
      throwProps: true
    });
  }
};
</script>