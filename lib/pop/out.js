'use strict';

const View = require('@scola/view');

class PopOutView extends View.Abstract {
  constructor() {
    super();

    this.isFullScreen = null;
    this.positions = [];
  }

  build() {
    this.element('outer', 'div')
      .properties({
        className: 'scola out'
      })
      .style({
        background: 'rgba(0, 0, 0, 0.5)',
        bottom: 0,
        left: 0,
        opacity: 0,
        position: 'fixed',
        right: 0,
        top: 0
      })
      .animate({
        opacity: 1
      });

    this.element('wrapper', 'div')
      .properties({
        className: 'scola wrapper'
      })
      .style({
        height: '100%',
        position: 'absolute',
        width: '100%'
      })
      .appendTo(this.element('outer'));

    this.element('inner', 'div')
      .properties({
        className: 'scola inner'
      })
      .style({
        background: '#FFF',
        borderRadius: 'inherit',
        height: '100%',
        overflow: 'hidden',
        position: 'absolute',
        transform: 'scale(1)',
        width: '100%'
      })
      .listen({
        click: this.handleClick
      }, this)
      .appendTo(this.element('wrapper'));

    this
      .element('triangle', 'div')
      .properties({
        className: 'scola triangle'
      })
      .style({
        borderColor: 'transparent',
        borderStyle: 'solid',
        borderWidth: '0.75em',
        height: 0,
        position: 'absolute',
        width: 0,
        zIndex: 2
      })
      .appendTo(this.element('wrapper'));
  }

  render() {
    return this
      .addHandlers()
      .play()
      .element('outer');
  }

  destroy() {
    this
      .element('outer')
      .animate({
        opacity: 0,
        play: true,
        onComplete: () => {
          this.removeHandlers();
          super.destroy();
        }
      });
  }

  addHandlers() {
    return this.bindListener(
      'resize',
      this.window,
      this.debounce,
      this.rerender,
      250
    );
  }

  removeHandlers() {
    return this.unbindListener(
      'resize',
      this.window,
      this.debounce
    );
  }

  handleClick(element, event) {
    event.stopPropagation();
  }

  anchor(element) {
    this.anchorElement = element;
    return this;
  }

  inside(element) {
    this.insideElement = element;
    return this;
  }

  left() {
    this.positions.push('left');

    if (this.isFullScreen) {
      return this;
    }

    if (this.insideElement) {
      this.leftInside();
    } else {
      this.leftAnchor();
    }

    if (this.positions.length === 1) {
      this.leftTriangleVertical();
    } else {
      this.leftTriangleHorizontal();
    }

    return this;
  }

  leftInside() {
    const position = this.insideElement.getPosition();

    this.element('wrapper')
      .style({
        left: position.x
      });

    return this;
  }

  leftAnchor() {
    const position = this.anchorElement.getPosition();
    const dimensions = this.anchorElement.getDimensions();

    this.element('wrapper')
      .if(this.positions.length === 2)
      .style({
        left: position.x
      })
      .if(this.positions.length === 1)
      .style({
        left: position.x + dimensions.width
      });

    return this;
  }

  leftTriangleHorizontal() {
    const anchorPosition = this.anchorElement.getPosition();
    const anchorDimensions = this.anchorElement.getDimensions();
    const innerPosition = this.element('wrapper').getPosition();

    this.element('triangle')
      .style({
        marginLeft: '-0.75em',
        left: anchorPosition.x +
          (anchorDimensions.width / 2) -
          innerPosition.x
      });
  }

  leftTriangleVertical() {
    this.element('triangle')
      .style({
        borderRightColor: '#FAFAFA',
        borderLeftWidth: 0,
        marginLeft: '-0.75em'
      });

    this.element('wrapper')
      .style({
        marginLeft: '1em'
      });
  }

  right() {
    this.positions.push('right');

    if (this.isFullScreen) {
      return this;
    }

    if (this.insideElement) {
      this.rightInside();
    } else {
      this.rightAnchor();
    }

    if (this.positions.length === 1) {
      this.rightTriangleVertical();
    } else {
      this.rightTriangleHorizontal();
    }

    return this;
  }

  rightInside() {
    const insidePosition = this.insideElement.getPosition();
    const insideDimensions = this.insideElement.getDimensions();
    const innerDimensions = this.element('wrapper').getDimensions();

    this.element('wrapper')
      .style({
        left: insidePosition.x +
          insideDimensions.width -
          innerDimensions.width
      });

    return this;
  }

  rightAnchor() {
    const anchorPosition = this.anchorElement.getPosition();
    const anchorDimensions = this.anchorElement.getDimensions();
    const innerDimensions = this.element('wrapper').getDimensions();

    this.element('wrapper')
      .if(this.positions.length === 2)
      .style({
        left: anchorPosition.x +
          anchorDimensions.width -
          innerDimensions.width
      })
      .if(this.positions.length === 1)
      .style({
        left: anchorPosition.x -
          innerDimensions.width
      });

    return this;
  }

  rightTriangleHorizontal() {
    const anchorPosition = this.anchorElement.getPosition();
    const anchorDimensions = this.anchorElement.getDimensions();
    const innerPosition = this.element('wrapper').getPosition();

    this.element('triangle')
      .style({
        marginLeft: '-0.75em',
        left: anchorPosition.x +
          (anchorDimensions.width / 2) -
          innerPosition.x
      });
  }

  rightTriangleVertical() {
    this.element('triangle')
      .style({
        right: 0,
        borderLeftColor: '#FAFAFA',
        borderRightWidth: 0,
        marginRight: '-0.75em'
      });

    this.element('wrapper')
      .style({
        marginLeft: '-1em'
      });
  }

  center() {
    this.positions.push('center');

    if (this.isFullScreen) {
      return this;
    }

    if (this.insideElement) {
      this.centerInside();
    } else {
      this.centerAnchor();
    }

    if (this.positions.length === 2) {
      this.centerTriangleHorizontal();
    }

    return this;
  }

  centerInside() {
    const insidePosition = this.insideElement.getPosition();
    const insideDimensions = this.insideElement.getDimensions();
    const innerDimensions = this.element('wrapper').getDimensions();

    this.element('wrapper')
      .style({
        left: insidePosition.x +
          (insideDimensions.width / 2) -
          (innerDimensions.width / 2)
      });

    return this;
  }

  centerAnchor() {
    const anchorPosition = this.anchorElement.getPosition();
    const anchorDimensions = this.anchorElement.getDimensions();
    const innerDimensions = this.element('wrapper').getDimensions();

    this.element('wrapper')
      .style({
        left: anchorPosition.x +
          (anchorDimensions.width / 2) -
          (innerDimensions.width / 2)
      });

    return this;
  }

  centerTriangleHorizontal() {
    const innerDimensions = this.element('wrapper').getDimensions();

    this.element('triangle')
      .style({
        marginLeft: '-0.75em',
        left: innerDimensions.width / 2
      });
  }

  top() {
    this.positions.push('top');

    if (this.isFullScreen) {
      return this;
    }

    if (this.insideElement) {
      this.topInside();
    } else {
      this.topAnchor();
    }

    if (this.positions.length === 1) {
      this.topTriangleHorizontal();
    } else {
      this.topTriangleVertical();
    }

    return this;
  }

  topInside() {
    const position = this.insideElement.getPosition();

    this.element('wrapper')
      .style({
        top: position.y
      });

    return this;
  }

  topAnchor() {
    const position = this.anchorElement.getPosition();
    const dimensions = this.anchorElement.getDimensions();

    this.element('wrapper')
      .if(this.positions.length === 2)
      .style({
        top: position.y
      })
      .if(this.positions.length === 1)
      .style({
        top: position.y + dimensions.height
      });

    return this;
  }

  topTriangleHorizontal() {
    this.element('triangle')
      .style({
        borderBottomColor: '#FAFAFA',
        borderTopWidth: 0,
        marginTop: '-0.75em'
      });

    this.element('wrapper')
      .style({
        marginTop: '1em'
      });
  }

  topTriangleVertical() {
    const anchorPosition = this.anchorElement.getPosition();
    const anchorDimensions = this.anchorElement.getDimensions();
    const innerPosition = this.element('wrapper').getPosition();

    this.element('triangle')
      .style({
        marginTop: '-0.75em',
        top: anchorPosition.y +
          (anchorDimensions.height / 2) -
          innerPosition.y
      });
  }

  bottom() {
    this.positions.push('bottom');

    if (this.isFullScreen) {
      return this;
    }

    if (this.insideElement) {
      this.bottomInside();
    } else {
      this.bottomAnchor();
    }

    if (this.positions.length === 1) {
      this.bottomTriangleHorizontal();
    } else {
      this.bottomTriangleVertical();
    }

    return this;
  }

  bottomInside() {
    const insidePosition = this.insideElement.getPosition();
    const insideDimensions = this.insideElement.getDimensions();
    const innerDimensions = this.element('wrapper').getDimensions();

    this.element('wrapper')
      .style({
        top: insidePosition.y +
          insideDimensions.height -
          innerDimensions.height
      });

    return this;
  }

  bottomAnchor() {
    const anchorPosition = this.anchorElement.getPosition();
    const anchorDimensions = this.anchorElement.getDimensions();
    const innerDimensions = this.element('wrapper').getDimensions();

    this.element('wrapper')
      .if(this.positions.length === 2)
      .style({
        top: anchorPosition.y +
          anchorDimensions.height -
          innerDimensions.height
      })
      .if(this.positions.length === 1)
      .style({
        top: anchorPosition.y -
          innerDimensions.height
      });

    return this;
  }

  bottomTriangleHorizontal() {
    this.element('triangle')
      .style({
        bottom: 0,
        borderTopColor: '#FAFAFA',
        borderBottomWidth: 0,
        marginBottom: '-0.75em'
      });

    this.element('wrapper')
      .style({
        marginTop: '-1em'
      });
  }

  bottomTriangleVertical() {
    const anchorPosition = this.anchorElement.getPosition();
    const anchorDimensions = this.anchorElement.getDimensions();
    const innerPosition = this.element('wrapper').getPosition();

    this.element('triangle')
      .style({
        marginTop: '-0.75em',
        top: anchorPosition.y +
          (anchorDimensions.height / 2) -
          innerPosition.y
      });
  }

  middle() {
    this.positions.push('middle');

    if (this.isFullScreen) {
      return this;
    }

    if (this.insideElement) {
      this.middleInside();
    } else {
      this.middleAnchor();
    }

    if (this.positions.length === 2) {
      this.middleTriangleVertical();
    }

    return this;
  }

  middleInside() {
    const insidePosition = this.insideElement.getPosition();
    const insideDimensions = this.insideElement.getDimensions();
    const innerDimensions = this.element('wrapper').getDimensions();

    this.element('wrapper')
      .style({
        top: insidePosition.y +
          (insideDimensions.height / 2) -
          (innerDimensions.height / 2)
      });

    return this;
  }

  middleAnchor() {
    const anchorPosition = this.anchorElement.getPosition();
    const anchorDimensions = this.anchorElement.getDimensions();
    const innerDimensions = this.element('wrapper').getDimensions();

    this.element('wrapper')
      .style({
        top: anchorPosition.y +
          (anchorDimensions.height / 2) -
          (innerDimensions.height / 2)
      });

    return this;
  }

  middleTriangleVertical() {
    const innerDimensions = this.element('wrapper').getDimensions();

    this.element('triangle')
      .style({
        marginTop: '-0.75em',
        top: innerDimensions.height / 2
      });
  }

  fullScreen(fullScreen) {
    this.isFullScreen = fullScreen;

    this.element('wrapper')
      .if(fullScreen)
      .style({
        left: 0,
        marginLeft: null,
        marginTop: null,
        top: null
      });

    this.element('triangle')
      .if(fullScreen)
      .style({
        display: 'none'
      })
      .if(!fullScreen)
      .style({
        display: 'block'
      });

    return this;
  }

  rerender() {
    const positions = this.positions;
    this.positions = [];

    this.setPositions(...positions);
  }

  setPositions(...positions) {
    positions.forEach((position) => {
      this.setPosition(position);
    });
  }

  setPosition(position) {
    switch (position) {
      case 'left':
        this.left();
        break;
      case 'right':
        this.right();
        break;
      case 'center':
        this.center();
        break;
      case 'top':
        this.top();
        break;
      case 'bottom':
        this.bottom();
        break;
      case 'middle':
        this.middle();
        break;
    }

    return this;
  }
}

module.exports = PopOutView;
