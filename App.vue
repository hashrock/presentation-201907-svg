<template>
  <div class="pane" tabindex="0">
    <div
      contenteditable
      ref="wrapper"
      class="pane-l"
      @focus="onfocus"
      @blur="onblur"
      @pointerdown="blur"
    >
      <svg
        :width="width"
        :height="height"
        ref="canv"
        :viewBox="`0 0 ${width} ${height}`"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
      >
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
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="rainbow"
            :x1="gradient.start.x"
            :y1="gradient.start.y"
            :x2="gradient.end.x"
            :y2="gradient.end.y"
          >
            <stop offset="0%" stop-color="#ff0000" />
            <stop offset="16.7%" stop-color="#ffff00" />
            <stop offset="33.3%" stop-color="#00ff00" />
            <stop offset="50.0%" stop-color="#00ffff" />
            <stop offset="66.7%" stop-color="#0000ff" />
            <stop offset="83.3%" stop-color="#ff00ff" />
            <stop offset="100%" stop-color="#ff0000" />
          </linearGradient>
          <filter id="hue-rotate">
            <feColorMatrix type="hueRotate" :values="angle" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.6" />
              <feFuncG type="linear" slope="1.6" />
              <feFuncB type="linear" slope="1.6" />
            </feComponentTransfer>
          </filter>
        </defs>
        <path v-show="editing" :d="curvesStr" id="path1" />
        <g :filter="enablePartyHard ? 'url(#hue-rotate)' : ''">
          <text
            :fill="fill"
            :stroke="borderColor"
            :stroke-width="borderWidth"
            stroke-linejoin="round"
            class="output-text"
            paint-order="stroke"
            :filter="svgFilter"
          >
            <textPath font-weight="900" :font-size="fontSize" href="#path1">SVG最高!</textPath>
          </text>
        </g>
        <g v-if="editing">
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
        <g v-if="editing">
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
              <circle
                :class="{'selected': selection === point}"
                style="pointer-events: none;"
                r="5"
                x="0"
                y="0"
                fill="rgba(0,0,0,0.5)"
              />
            </g>
          </g>
        </g>
        <g v-if="enableRainbow && editing">
          <line
            :x1="gradient.start.x"
            :y1="gradient.start.y"
            :x2="gradient.end.x"
            :y2="gradient.end.y"
            stroke="blue"
          />
          <g
            @pointerdown="onPointerDown($event, gradient.start)"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            :transform="translate(gradient.start.x,gradient.start.y)"
          >
            <circle class="handle" r="10" x="0" y="0" fill="rgba(0,255,0,0.0)" />
            <circle style="pointer-events: none;" r="5" x="0" y="0" fill="rgba(0,0,255,0.5)" />
          </g>
          <g
            @pointerdown="onPointerDown($event, gradient.end)"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            :transform="translate(gradient.end.x,gradient.end.y)"
          >
            <circle class="handle" r="10" x="0" y="0" fill="rgba(0,255,0,0.0)" />
            <circle style="pointer-events: none;" r="5" x="0" y="0" fill="rgba(0,0,255,0.5)" />
          </g>
        </g>
      </svg>
    </div>
    <div class="pane-r">
      <div class="pane-r__block">
        <label class="pane-title">塗り</label>
        <color @change="setColor" :initial-color="{h: 188, s: 83, l: 50}"></color>
      </div>
      <div class="pane-r__block">
        <label class="pane-title">輪郭</label>
        <color @change="setBorderColor" :initial-color="{h: 0, s: 0, l: 0}"></color>
      </div>
      <div class="pane-r__block">
        <label>
          サイズ
          <input type="range" v-model="fontSize" />
        </label>
        <label>
          輪郭太さ
          <input type="range" v-model="borderWidth" min="0" max="40" />
        </label>
      </div>
      <div class="pane-r__block">
        <label>
          <input type="checkbox" v-model="enableFilter" />
          Drop Shadow
        </label>
      </div>
      <div class="pane-r__block">
        <label>
          <input type="checkbox" v-model="enableRainbow" />
          Rainbow
        </label>
      </div>
      <div class="pane-r__block">
        <label>
          <input type="checkbox" v-model="enablePartyHard" />
          Party Hard
        </label>
      </div>
      <div class="pane-r__block">
        <button @click="getSvg">Get SVG</button>
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
      fontSize: 60,
      editing: false,
      enableFilter: false,
      height: 300,
      width: 300,
      angle: 0,
      color: "hsl(188, 83%, 50%)",
      borderColor: "hsl(0, 0%, 0%)",
      borderWidth: 3,
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
      selection: null,
      gradient: {
        start: {
          x: 100,
          y: 100
        },
        end: {
          x: 300,
          y: 300
        }
      },
      enableRainbow: false,
      enablePartyHard: false
    };
  },
  methods: {
    translate(x, y) {
      return `translate(${x},${y})`;
    },

    setColor(payload) {
      this.color = payload;
    },

    setBorderColor(payload) {
      this.borderColor = payload;
    },

    onPointerUp(e) {
      this.offset = null;
    },
    onPointerDown(e, item) {
      e.stopPropagation();
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
    },
    onfocus() {
      this.editing = true;
    },
    onblur() {
      this.editing = false;
    },
    getSvg() {
      const svg =
        `<?xml version="1.0" standalone="no"?>` + this.$refs.canv.outerHTML;
      prompt("クリップボードにコピーしてください", svg);
    },
    blur() {
      this.selection = null;
    }
  },
  computed: {
    fill() {
      return this.enableRainbow ? "url(#rainbow)" : this.color;
    },
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

    window.addEventListener("keydown", ev => {
      const value = ev.shiftKey ? 10 : 2;
      if (this.selection) {
        switch (event.code) {
          case "ArrowDown":
            this.selection.y += value;
            break;
          case "ArrowUp":
            this.selection.y -= value;
            break;
          case "ArrowLeft":
            this.selection.x -= value;
            break;
          case "ArrowRight":
            this.selection.x += value;
            break;
        }
      }
    });

    setInterval(() => {
      this.angle += 5;
    }, 10);
  }
};
</script>

<style>
body {
  margin: 0;
}

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

.selected {
  fill: white;
  stroke: blue;
  stroke-width: 2;
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
  padding-right: 0.5rem;
  padding-left: 0.5rem;
}
.pane-title {
  font-size: 0.8rem;
  color: #333;
  font-weight: 900;
  text-align: center;
  display: block;
}
.party-hard {
  animation: filter-animation 1000ms infinite;
}
@keyframes filter-animation {
  0% {
    filter: hue-rotate(0deg);
  }
  50% {
    filter: hue-rotate(100deg);
  }
  100% {
    filter: hue-rotate(0deg);
  }
}
</style>
