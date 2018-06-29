var Util = require('./Util');
var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');

var _ = (function() {
  if (React) return React.createElement;
  else {
    throw new Error('Morearty: global variable React not found');
  }
})();

var wrapComponent = function(comp, displayName) {
  return createReactClass({
    displayName: displayName,

    getInitialState: function() {
      return { value: this.props.value };
    },

    onChange: function(event) {
      var handler = this.props.onChange;
      if (handler) {
        handler(event);
        this.setState({ value: event.target.value });
      }
    },

    componentWillReceiveProps: function(newProps) {
      this.setState({ value: newProps.value });
    },

    render: function() {
      var props = Util.assign({}, this.props, {
        value: this.state.value,
        onChange: this.onChange,
        children: this.props.children,
      });
      return comp(props);
    },
  });
};

function createDOMFactory(type) {
  var factory = _.bind(null, type);
  // Expose the type on the factory and the prototype so that it can be
  // easily accessed on elements. E.g. `<Foo />.type === Foo`.
  // This should not be named `constructor` since this may not be the function
  // that created the element, and it may not even be a constructor.
  factory.type = type;
  return factory;
}

/**
 * @name DOM
 * @namespace
 * @classdesc DOM module. Exposes requestAnimationFrame-friendly wrappers around input, textarea, and option.
 */
var DOM = {
  input: wrapComponent(createDOMFactory('input'), 'input'),

  textarea: wrapComponent(createDOMFactory('textarea'), 'textarea'),

  option: wrapComponent(createDOMFactory('option'), 'option'),
};

module.exports = DOM;
