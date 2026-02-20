// Mock for react-native in test environment
const React = require('react');

const createMockComponent = (name) => {
    const component = (props) => {
        return React.createElement(name, props, props.children);
    };
    component.displayName = name;
    return component;
};

module.exports = {
    View: createMockComponent('View'),
    Text: createMockComponent('Text'),
    TextInput: createMockComponent('TextInput'),
    TouchableOpacity: createMockComponent('TouchableOpacity'),
    Image: createMockComponent('Image'),
    FlatList: createMockComponent('FlatList'),
    ScrollView: createMockComponent('ScrollView'),
    Modal: createMockComponent('Modal'),
    Alert: { alert: jest.fn() },
    Animated: {
        View: createMockComponent('Animated.View'),
        Text: createMockComponent('Animated.Text'),
        Value: jest.fn(() => ({
            setValue: jest.fn(),
            interpolate: jest.fn(() => 0),
        })),
        timing: jest.fn(() => ({ start: jest.fn((cb) => cb && cb()) })),
        spring: jest.fn(() => ({ start: jest.fn((cb) => cb && cb()) })),
        parallel: jest.fn(() => ({ start: jest.fn((cb) => cb && cb()) })),
        sequence: jest.fn(() => ({ start: jest.fn((cb) => cb && cb()) })),
        loop: jest.fn(() => ({ start: jest.fn(), stop: jest.fn() })),
    },
    StyleSheet: {
        create: (styles) => styles,
        flatten: jest.fn((style) => style),
    },
    Platform: { OS: 'ios', select: jest.fn((obj) => obj.ios || obj.default) },
    KeyboardAvoidingView: createMockComponent('KeyboardAvoidingView'),
    ActivityIndicator: createMockComponent('ActivityIndicator'),
    Linking: { openURL: jest.fn() },
    Dimensions: { get: jest.fn(() => ({ width: 375, height: 812 })) },
};
