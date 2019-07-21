Vue.component("grad", {
  template: `
  <svg viewBox="0 0 200 100" width="200" height="100" ref="canv">
    <defs>
      <linearGradient id="hsv1"  x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse" spreadMethod="repeat">
        <stop  offset="0%" stop-color="#ff0000" />
        <stop  offset="16.7%" stop-color="#ffff00"/>
        <stop  offset="33.3%" stop-color="#00ff00"/>
        <stop  offset="50.0%" stop-color="#00ffff"/>
        <stop  offset="66.7%" stop-color="#0000ff"/>
        <stop  offset="83.3%" stop-color="#ff00ff"/>
        <stop  offset="100%" stop-color="#ff0000"/>
      </linearGradient>
    </defs>
    <rect fill="url(#hsv1)" x=0 y=0 height=100 width=200 @pointermove="onmove" @pointerup="onup"></rect>
    <rect :x="x" y=0 height=100 width=5 fill="none" stroke="white" stroke-width="1" />
  </svg>
  `,
  data() {
    return {
      x: 0
    };
  },
  methods: {
    onmove(ev) {
      const el = this.$refs.canv;
      const pt = el.createSVGPoint();
      pt.x = ev.clientX;
      pt.y = ev.clientY;
      const svgP = pt.matrixTransform(el.getScreenCTM().inverse());
      this.x = svgP.x;
    },
    onup(ev) {}
  }
});

new Vue({
  el: "#app"
});
