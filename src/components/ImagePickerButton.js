/**
 * ImagePickerButton — Unified camera/gallery picker with permission handling.
 */
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Platform,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, BORDER_RADIUS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/theme';

const ImagePickerButton = ({ onImageSelected, disabled }) => {
    const [showModal, setShowModal] = useState(false);

    const requestPermission = async (type) => {
        if (type === 'camera') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Camera Permission',
                    'We need camera access so you can take photos of your writing! Please enable it in Settings.',
                    [{ text: 'OK' }]
                );
                return false;
            }
        } else {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Photo Library Permission',
                    'We need photo library access so you can select photos of your writing! Please enable it in Settings.',
                    [{ text: 'OK' }]
                );
                return false;
            }
        }
        return true;
    };

    const pickImage = async (source) => {
        setShowModal(false);

        const hasPermission = await requestPermission(source);
        if (!hasPermission) return;

        const options = {
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
            base64: true,
        };

        let result;
        if (source === 'camera') {
            result = await ImagePicker.launchCameraAsync(options);
        } else {
            result = await ImagePicker.launchImageLibraryAsync(options);
        }

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            onImageSelected({
                uri: asset.uri,
                base64: asset.base64,
                mimeType: asset.mimeType || 'image/jpeg',
            });
        }
    };

    return (
        <>
            <TouchableOpacity
                style={[styles.button, disabled && styles.buttonDisabled]}
                onPress={() => setShowModal(true)}
                disabled={disabled}
                accessibilityLabel="Attach a photo of your writing"
                accessibilityRole="button"
            >
                <Text style={styles.buttonIcon}>📸</Text>
            </TouchableOpacity>

            <Modal
                visible={showModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowModal(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Your Writing ✏️</Text>
                        <Text style={styles.modalSubtitle}>
                            Choose how to share your writing
                        </Text>

                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => pickImage('camera')}
                        >
                            <Text style={styles.optionIcon}>📷</Text>
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionTitle}>Take a Photo</Text>
                                <Text style={styles.optionDesc}>
                                    Use your camera to snap a picture
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => pickImage('library')}
                        >
                            <Text style={styles.optionIcon}>🖼️</Text>
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionTitle}>Choose from Gallery</Text>
                                <Text style={styles.optionDesc}>
                                    Pick a photo you already have
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setShowModal(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.sm,
        ...SHADOWS.small,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonIcon: {
        fontSize: 22,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        paddingBottom: SPACING.xxl,
    },
    modalTitle: {
        ...TYPOGRAPHY.title,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: SPACING.xs,
    },
    modalSubtitle: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
    },
    optionIcon: {
        fontSize: 32,
        marginRight: SPACING.md,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        ...TYPOGRAPHY.bodyBold,
        color: COLORS.text,
    },
    optionDesc: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
    },
    cancelButton: {
        paddingVertical: SPACING.md,
        alignItems: 'center',
        marginTop: SPACING.sm,
    },
    cancelText: {
        ...TYPOGRAPHY.bodyBold,
        color: COLORS.textMuted,
    },
});

export default ImagePickerButton;
