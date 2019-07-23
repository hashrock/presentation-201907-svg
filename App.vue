<template>
  <div>
    <div contenteditable>
      <svg width="300" height="300" ref="canv" viewBox="0 0 300 300">
        <defs>
          <filter id='noise' x='0%' y='0%' width='100%' height='100%'>
            <feTurbulence type="turbulence" baseFrequency="0.01 0.1" numOctaves="1" result="NOISE" />
            <feDisplacementMap in="SourceGraphic" in2="NOISE" scale="20" xChannelSelector="R" yChannelSelector="R"></feDisplacementMap>
          </filter>
        </defs>
        <path :d="os" id="path1" />
        <text class="output-text" :filter="svgFilter">
          <textPath font-weight="900" font-size="30" href="#path1">TESTTESTTEST</textPath>
        </text>
        <g v-for="(item, idx) in o" :key="idx">
          <line
            :x1="item.p[0].x"
            :y1="item.p[0].y"
            :x2="item.p[1].x"
            :y2="item.p[1].y"
            stroke="black"
          />
          <line
            :x1="item.p[2].x"
            :y1="item.p[2].y"
            :x2="item.p[3].x"
            :y2="item.p[3].y"
            stroke="black"
          />
        </g>
        <g v-for="(item, idx) in o" :key="idx">
          <g
            @pointerdown="onPointerDown($event, point)"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            v-for="(point, pidx) in item.p"
            :key="pidx"
            :transform="translate(point.x,point.y)"
          >
            <circle class="handle" r="10" x="0" y="0" fill="rgba(0,255,0,0.0)" />
            <circle style="pointer-events: none;" r="5" x="0" y="0" fill="rgba(0,0,0,0.5)" />
          </g>
        </g>
      </svg>
    </div>
    <color></color>
    <div>
      <label>
        <input type="checkbox" v-model="enableFilter">
        Apply Filter 
      </label>

    </div>
  </div>
</template>

<script>
function screenToSvg(point, el, svg) {
  const pt = svg.createSVGPoint();
  pt.x = point.x;
  pt.y = point.y;
  return pt.matrixTransform(el.getScreenCTM().inverse());
}
import Color from "./Color.vue";

export default {
  components: {
    Color
  },
  props: {
    msg: String
  },
  data() {
    return {
      enableFilter: false,
      o: [
        {
          type: "C",
          p: [
            { x: 200, y: 200 },
            { x: 240, y: 200 },
            { x: 210, y: 250 },
            { x: 250, y: 250 }
          ]
        }
      ],
      offset: null,
      selection: null
    };
  },
  methods: {
    translate(x, y) {
      return `translate(${x},${y})`;
    },

    onPointerUp(e) {
      this.offset = null;
    },
    onPointerDown(e, item) {
      const rect = e.target;
      const bbox = rect.getBBox();
      this.offset = screenToSvg(
        { x: e.clientX, y: e.clientY },
        rect,
        this.$refs.canv
      );
      rect.setPointerCapture(e.pointerId);
      this.selection = item;
    },
    onPointerMove(e) {
      if (this.offset) {
        let p = screenToSvg(
          { x: e.clientX, y: e.clientY },
          this.$refs.canv,
          this.$refs.canv
        );
        this.selection.x = p.x - this.offset.x;
        this.selection.y = p.y - this.offset.y;
      }
    }
  },
  computed: {
    os() {
      return this.o
        .map(i => {
          if (i.type === "C") {
            return `M ${i.p[0].x},${i.p[0].y} C ${i.p[1].x},${i.p[1].y} ${i.p[2].x},${i.p[2].y} ${i.p[3].x},${i.p[3].y}`;
          }
        })
        .join(" ");
    },
    svgFilter(){
      return this.enableFilter ? `url(#noise)` : null
    }
  }
};
</script>

<style>
path {
  fill: none;
  stroke: blue;
  stroke-width: 3;
}

.output-text {
  font-size: 30rem;
}

.handle {
  cursor: pointer;
}
</style>
