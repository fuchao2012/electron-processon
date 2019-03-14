// AnyCharacter nodes are for `*` regular expression syntax. They are rendered
// as just an "any character" label.

const _ = require('lodash');
export default {
  type: 'any-character',

  _render() {
    return this.renderLabel('any character');
  }
};
