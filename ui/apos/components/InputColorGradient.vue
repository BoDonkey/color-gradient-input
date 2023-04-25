<template>
  <AposInputWrapper :field="field" :error="null" :uid="uid" :display-options="displayOptions" :modifiers="modifiers"
    :value="value" :items="next.colors">
    <template #body>
      <div class="apos-input-object">
        <div class="apos-input-wrapper">
          <div id="color-square" :style="{ background: gradient }" />
          <AposSchema :schema="angleSchema" :trigger-validation="triggerValidation" :utility-rail="false"
            :generation="generation" v-model="angleSchemaInput" ref="angleSchema">
          </AposSchema>
          <div>
            <h3>Colors</h3>
            <AposSchema :schema="colorSchema" v-model="colorSchemaInput" :trigger-validation="triggerValidation"
              :utility-rail="false" :generation="generation" :items="next.colors" ref="colorSchema">
            </AposSchema>
          </div>
        </div>
      </div>
    </template>
  </AposInputWrapper>
</template>

<script>

import AposInputMixin from 'apostrophe/modules/@apostrophecms/schema/ui/apos/mixins/AposInputMixin';
import AposInputWrapper from 'apostrophe/modules/@apostrophecms/schema/ui/apos/components/AposInputWrapper.vue';
import AposSchema from 'apostrophe/modules/@apostrophecms/schema/ui/apos/components/AposSchema.vue';


const defStartColor = '#4a90e2ff';
const defEndColor = '#e24a4fff';

export default {
  name: 'InputColorGradient',
  components: {
    AposInputWrapper,
    AposSchema
  },
  mixins: [AposInputMixin],
  props: {
    generation: {
      type: Number,
      required: false,
      default() {
        return null;
      }
    },
    docId: {
      type: String,
      required: false,
      default() {
        return null;
      }
    }
  },
  data() {
    const next = this.getNext();
    console.log('data', next);
    return {
      next,
      angleSchemaInput: this.expandAngle(next.angle),
      colorSchemaInput: this.expandColors(next.colors),
      // These schemas are really constants, but this is a convenient
      // way to make them component properties
      angleSchema: [
        {
          name: 'angle',
          label: 'Angle',
          type: 'range',
          min: 0,
          max: 360,
          unit: 'deg'
        }
      ],
      colorSchema: [
        {
          name: 'colors',
          label: 'Colors',
          type: 'array',
          min: 2,
          inline: true,
          fields: {
            add: {
              color: {
                label: 'Add Color',
                type: 'color'
              },
              stop: {
                label: 'Stop',
                type: 'range',
                min: 0,
                max: 100,
                unit: '%'
              }
            }
          }
        }
      ]
    };
  },
  computed: {
    gradient() {
      console.log('gradient', this.next, typeof this.next.colors);
      const gradientString = this.next.colors.reduce((acc, curr, i, colors) => {
        acc += `${curr.color} ${curr.stop}%`;
        if (i !== colors.length - 1) {
          acc += ', ';
        }
        return acc;
      }, `linear-gradient(${this.next.angle}, )`);
      return gradientString;
    }
  },
  watch: {
    generation() {
      this.next = this.getNext();
      this.angleSchemaInput = expandAngle(this.next.angle);
      this.colorSchemaInput = expandColors(this.next.colors);
    },
    angleSchemaInput: {
      deep: true,
      handler() {
        if (!this.angleSchemaInput.hasErrors) {
          this.next = {
            ...this.next,
            angle: this.angleSchemaInput.data.angle
          };
        }
      }
    },
    colorSchemaInput: {
      deep: true,
      handler() {
        if (this.colorSchemaInput.hasErrors) {
          this.next = {
            ...this.next,
            colors: this.colorSchemaInput.data.colors
          };
        }
      }
    }
  },
  methods: {
    validate(value) {
      if (value == null) {
        value = '';
      }
      if (this.nameSchemaInput.hasErrors || this.valueSchemaInput.hasErrors) {
        return 'invalid';
      }
      return false;
    },
    getNext() {
      return this.value.data ? this.value.data : (this.field.def || {
        angle: 90,
        colors: [
          {
            color: defStartColor,
            stop: 0
          },
          {
            color: defEndColor,
            stop: 100
          }
        ]
      });
    },
    expandAngle(angle) {
      return {
        data: {
          angle
        }
      };
    },
    expandColors(colors) {
      return {
        data: {
          colors
        }
      };
    }
  }
};
</script>

<style lang="scss" scoped>
#color-square {
  height: 200px;
  width: 100%;
}

li {
  list-style: none;
}

.apos-input-object {
  border-left: 1px solid var(--a-base-9);
}

.apos-input-wrapper {
  margin: 20px 0 0 19px;
}

.apos-input-object ::v-deep .apos-schema .apos-field {
  margin-bottom: 30px;
}

.span-right {
  float: right;
}
</style>
