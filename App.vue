<template>
  <div class="pane">
    <div contenteditable ref="wrapper" class="pane-l">
      <svg :width="width" :height="height" ref="canv" :viewBox="`0 0 ${width} ${height}`">
        <defs>
          <filter id="noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="turbulence" baseFrequency="0.01 0.1" numOctaves="1" result="NOISE" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="NOISE"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="R"
            />
          </filter>
          <filter id="dropshadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
            <feOffset dx="5" dy="5" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path :d="curvesStr" id="path1" />
        <text :fill="color" stroke="black" class="output-text" :filter="svgFilter">
          <textPath font-weight="900" font-size="60" href="#path1">TESTTESTTEST</textPath>
        </text>
        <g>
          <g v-for="(item, idx) in curves" :key="idx">
            <line
              :x1="item.points[0].x"
              :y1="item.points[0].y"
              :x2="item.points[1].x"
              :y2="item.points[1].y"
              stroke="black"
            />
            <line
              :x1="item.points[2].x"
              :y1="item.points[2].y"
              :x2="item.points[3].x"
              :y2="item.points[3].y"
              stroke="black"
            />
          </g>
        </g>
        <g>
          <g v-for="(item, idx) in curves" :key="idx">
            <g
              @pointerdown="onPointerDown($event, point)"
              @pointermove="onPointerMove"
              @pointerup="onPointerUp"
              v-for="(point, pidx) in item.points"
              :key="pidx"
              :transform="translate(point.x,point.y)"
            >
              <circle class="handle" r="10" x="0" y="0" fill="rgba(0,255,0,0.0)" />
              <circle style="pointer-events: none;" r="5" x="0" y="0" fill="rgba(0,0,0,0.5)" />
            </g>
          </g>
        </g>
      </svg>
    </div>
    <div class="pane-r">
      <div class="pane-r__block">
        <color @change="setColor"></color>
      </div>
      <div class="pane-r__block">
        <label>
          <input type="checkbox" v-model="enableFilter" />
          Apply Filter
        </label>
      </div>
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
      height: 300,
      width: 300,
      color: "white",
      curves: [
        {
          points: [
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

    setColor(payload) {
      this.color = payload;
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
    },
    onResize() {
      this.width = this.$refs.wrapper.clientWidth;
      this.height = this.$refs.wrapper.clientHeight;
    }
  },
  computed: {
    curvesStr() {
      return this.curves
        .map(i => {
          return `M ${i.points[0].x},${i.points[0].y} C ${i.points[1].x},${i.points[1].y} ${i.points[2].x},${i.points[2].y} ${i.points[3].x},${i.points[3].y}`;
        })
        .join(" ");
    },
    svgFilter() {
      return this.enableFilter ? `url(#dropshadow)` : null;
    }
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.onResize();
    });
    this.onResize();
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

.pane-l {
  flex: 1;
  overflow: hidden;
}
.pane-r {
  width: 240px;
  background: #eee;
}
.pane {
  display: flex;
  height: 100%;
}
.pane-r__block {
  border-bottom: 1px solid gray;
  padding-bottom: 1rem;
  padding-top: 1rem;
}
</style>
