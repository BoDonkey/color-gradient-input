module.exports = {
  init(self) {
    console.log('init')
    self.addColorGradientFieldType();
  },
  methods(self) {
    return {
      addColorGradientFieldType() {
        self.apos.schema.addFieldType({
          name: 'colorGradient',
          convert: self.convertInput,
          vueComponent: 'InputColorGradient'
        });
      },
      async convertInput(req, field, data, object) {
        data = data[field.name];
        const schema = [
          {
            name: 'angle',
            label: 'Angle',
            type: 'range',
            min: 0,
            max: 360,
            unit: 'deg',
            def: 90
          },
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
                  type: 'color',
                  def: '#4a11ffff'
                },
                stop: {
                  label: 'Stop',
                  type: 'range',
                  min: 0,
                  max: 100,
                  unit: '%',
                  def: 0
                }
              }
            }
          }
        ];
        const errors = [];
        const result = {
          _id:
            self.apos.launder.id(data && data._id) ||
            self.apos.util.generateId()
        };
        if (data == null || typeof data !== 'object' || Array.isArray(data)) {
          data = {};
        }
        try {
          await self.apos.schema.convert(req, schema, data, result);
        } catch (e) {
          for (const error of e) {
            errors.push({
              path: error.path,
              error: error.error
            });
          }
        }
        result.metaType = 'gradientItem';
        result.scopedObjectName = field.scopedObjectName;
        object[field.name] = result;
        if (errors.length) {
          throw errors;
        }
      }
    };
  }
};
