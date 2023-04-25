const tinycolor = require('tinycolor2');

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
        const input = data[field.name];
        if (data[field.name] == null || data[field.name] === '') {
          if (field.required) {
            throw self.apos.error('Required field not present');
          }
        }
        const sanitizedColors = [];
        for (const colorSet of input.colors) {
          let color = self.apos.launder.string(colorSet.color);
          const test = tinycolor(color);
          if (!tinycolor(test).isValid()) {
            color = null;
          }
          const stop = self.apos.launder.integer(colorSet.stop);

          sanitizedColors.push({
            color,
            stop
          });
        }

        const launderedData = {
          angle: self.apos.launder.integer(input.angle),
          colors: sanitizedColors
        };
        object[field.name] = launderedData;
      }
    };
  }
};
