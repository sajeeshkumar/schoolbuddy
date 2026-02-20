module.exports = {
    requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    launchCameraAsync: jest.fn().mockResolvedValue({ canceled: true }),
    launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: true }),
};
