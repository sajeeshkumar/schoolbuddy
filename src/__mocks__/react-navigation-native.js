const React = require('react');
module.exports = {
    NavigationContainer: ({ children }) => React.createElement('View', null, children),
    useNavigation: () => ({
        navigate: jest.fn(),
        replace: jest.fn(),
        goBack: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
};
