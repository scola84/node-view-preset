'use strict';

const View = require('@scola/view');

class PopupButtonView extends View.Abstract {
  build() {
    this
      .element('button', 'button')
      .properties({
        className: 'scola button'
      })
      .style({
        background: '#FFF',
        border: 0,
        borderLeft: '1px none #DDD',
        borderTop: '1px solid #DDD',
        cursor: 'pointer',
        float: 'left',
        fontSize: '1.2em',
        height: '3em',
        lineHeight: '3em',
        padding: 0,
        textAlign: 'center',
        width: '100%'
      })
      .if(this.capability('hairline'))
      .style({
        borderWidth: '0.5px'
      });
  }

  render() {
    return this.element('button');
  }
}

module.exports = PopupButtonView;