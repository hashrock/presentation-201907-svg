<template>
  <div>
    <svg ref="canv" width="400" height="400" viewBox="0 0 400 400">
      <!-- objectは％単位 -->
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="g0" :x1="x1" :y1="y1" :x2="x2" :y2="y2">
          <stop offset="0" stop-color="black" />
          <stop offset="1" stop-color="yellowgreen" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#g0)" />
      <rect x="50" y="50" width="100" height="100" fill="url(#g0)" />
      <rect ref="p1" x="0" y="0" width="10" height="10" fill="white" stroke="black" />
      <rect ref="p2" x="0" y="0" width="10" height="10" fill="white" stroke="black" />
    </svg>
  </div>
</template>
<style>
body {
  margin: 3rem;
}
</style>
<script>
import Draggable from "gsap/Draggable";
import TweenLite from "gsap/TweenLite";

export default {
  data() {
    return {
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100
    };
  },
  mounted() {
    const self = this;
    TweenLite.set(this.$refs.p1, {
      x: this.x1,
      y: this.y1
    });
    TweenLite.set(this.$refs.p2, {
      x: this.x2,
      y: this.y2
    });

    Draggable.create(this.$refs.p1, {
      type: "x,y",
      edgeResistance: 0.65,
      bounds: this.$refs.canv,
      throwProps: true,
      onDrag: function() {
        self.x1 = this.x;
        self.y1 = this.y;
      }
    });

    Draggable.create(this.$refs.p2, {
      type: "x,y",
      edgeResistance: 0.65,
      bounds: this.$refs.canv,
      throwProps: true,
      onDrag: function() {
        self.x2 = this.x;
        self.y2 = this.y;
      }
    });
  }
};
</script>