const React = require('react');
const createNativeStackNavigator = () => ({
    Navigator: ({ children }) => React.createElement('View', null, children),
    Screen: ({ children }) => React.createElement('View', null, children),
});
module.exports = { createNativeStackNavigator };
