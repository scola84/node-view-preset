'use strict';

const View = require('@scola/view');

class CheckboxView extends View.Abstract {
  constructor() {
    super();
    this.isChecked = false;
  }

  build() {
    this
      .element('wrapper', 'div')
      .style({
        position: 'relative'
      });

    this
      .element('input', 'input')
      .properties({
        type: 'checkbox'
      })
      .style({
        opacity: 0
      })
      .listen({
        click: this.handleClick,
        check: this.handleCheck
      }, this)
      .appendTo(
        this.element('wrapper')
      );

    this
      .element('outer', 'div')
      .style({
        border: '0.3em solid #FFF',
        background: '#FFF',
        cursor: 'pointer',
        height: '1.5em',
        left: 0,
        position: 'absolute',
        textAlign: 'center',
        top: 0,
        width: '1.5em'
      })
      .listen({
        click: this.handleClick
      }, this)
      .appendTo(
        this.element('wrapper')
      );

    this
      .element('inner', 'div')
      .style({
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
      })
      .appendTo(
        this.element('outer')
      );
  }

  render() {
    return this.element('wrapper');
  }

  checked() {
    return this.element('input').get().checked;
  }

  handleClick() {
    const element = this.element('input').get();

    this.isChecked = !this.isChecked;
    element.checked = this.isChecked;

    this.element('input').emit('check', {
      view: this,
      checked: this.isChecked
    });
  }

  handleCheck(event) {
    event
      .view
      .element('inner')
      .style({
        background: event.checked ? '#000' : 'none'
      });
  }
}

module.exports = CheckboxView;
