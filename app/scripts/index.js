var React = require('react');
var ReactDOM = require('react-dom');

var MenuContainer = require('./components/menu.jsx').MenuContainer;

ReactDOM.render(
  React.createElement(MenuContainer),
  document.getElementById('app')
);
