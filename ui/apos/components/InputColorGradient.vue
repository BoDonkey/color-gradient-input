<template>
  <AposInputWrapper
  :field="field"
  :error="null"
  :uid="uid"
  >
    <template #body>
      <div class="apos-input-object">
        <div class="apos-input-wrapper">
          <div id="color-square" :style="{ background: gradient }" />
          <AposSchema
          :schema="gradientSchema"
          :trigger-validation="triggerValidation"
          :utility-rail="false"
          :generation="generation"
          v-model="gradientSchemaInput"
          />
        </div>
      </div>
    </template>
  </AposInputWrapper>
</template>

<script>
import AposInputMixin from 'apostrophe/modules/@apostrophecms/schema/ui/apos/mixins/AposInputMixin';
import AposInputWrapper from 'apostrophe/modules/@apostrophecms/schema/ui/apos/components/AposInputWrapper.vue';
import AposSchema from 'apostrophe/modules/@apostrophecms/schema/ui/apos/components/AposSchema.vue';

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
    const gradientSchema = apos.modules['color-gradient'].schema;
    return {
      next,
      gradientSchemaInput: {
        data: next
      },
      gradientSchema: gradientSchema
    }
  },
  computed: {
    gradient() {
      if (this.next.colors && this.next.angle) {
        const gradientString = this.next.colors.reduce((acc, curr, i, colors) => {
          acc += `${curr.color} ${curr.stop}%`;
          if (i !== colors.length - 1) {
            acc += ', ';
          } else {
            acc += ')';
          }
          return acc;
        }, `linear-gradient(${this.next.angle}deg, `);
        return gradientString;
      }
    }
  },
  watch: {
    generation() {
      this.next = this.getNext();
      this.gradientSchemaInput = {
        data: this.next.value
      };
    },
    gradientSchemaInput: {
      deep: true,
      handler() {
        if (!this.gradientSchemaInput.hasErrors) {
          this.next = this.gradientSchemaInput.data;
        }
      }
    }
  },
  methods: {
    validate(value) {
      if (value == null) {
        value = '';
      }
      if (this.gradientSchemaInput.hasErrors) {
        return 'invalid';
      }
      return false;
    },
    getNext() {
      return this.value.data ? this.value.data : (this.field.def || {
        angle: 90,
        colors: [
          {
            color: '#d0021bff',
            stop: 0
          },
          {
            color: '#4a11ffff',
            stop: 100
          }
        ]
      });
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