/**
 * WelcomeScreen — First-launch onboarding
 * Pet picker, grade picker, friendly mascot introduction.
 */
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Platform,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../theme/theme';
import { saveGrade, savePetId, setOnboarded } from '../services/storageService';
import { PETS } from '../data/pets';

const GRADES = [
    { value: 'K', label: 'K' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10' },
    { value: 11, label: '11' },
    { value: 12, label: '12' },
];

const WelcomeScreen = ({ navigation }) => {
    const [selectedPet, setSelectedPet] = useState('scout');
    const [selectedGrade, setSelectedGrade] = useState(6);
    const [step, setStep] = useState(0); // 0 = welcome, 1 = pet, 2 = grade

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const mascotBounce = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(mascotBounce, {
                    toValue: -10,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(mascotBounce, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const animateStep = (nextStep) => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setStep(nextStep);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
        });
        slideAnim.setValue(30);
    };

    const handleComplete = async () => {
        try {
            await savePetId(selectedPet);
            await saveGrade(selectedGrade);
            await setOnboarded();
            navigation.replace('Chat');
        } catch (e) {
            navigation.replace('Chat');
        }
    };

    const currentPet = PETS.find((p) => p.id === selectedPet) || PETS[0];

    const renderWelcome = () => (
        <View style={styles.stepContainer}>
            <Animated.Text
                style={[styles.mascot, { transform: [{ translateY: mascotBounce }] }]}
            >
                📚
            </Animated.Text>
            <Text style={styles.heroTitle}>Hello there!</Text>
            <Text style={styles.heroSubtitle}>
                Welcome to <Text style={styles.coachName}>SchoolBuddy</Text>!
            </Text>
            <Text style={styles.description}>
                Choose a study pet, pick your grade, and get helpful feedback
                on your English writing — powered by AI! ✨
            </Text>
            <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => animateStep(1)}
            >
                <LinearGradient
                    colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientButton}
                >
                    <Text style={styles.primaryButtonText}>Let's Get Started! 🚀</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    const renderPetPicker = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Choose Your Study Pet! 🐾</Text>
            <Text style={styles.stepSubtitle}>
                Your pet will be your writing buddy
            </Text>
            <View style={styles.petGrid}>
                {PETS.map((pet) => (
                    <TouchableOpacity
                        key={pet.id}
                        style={[
                            styles.petCard,
                            selectedPet === pet.id && {
                                borderColor: pet.color,
                                backgroundColor: `${pet.color}15`,
                            },
                        ]}
                        onPress={() => setSelectedPet(pet.id)}
                    >
                        <Text style={styles.petEmoji}>{pet.emoji}</Text>
                        <Text
                            style={[
                                styles.petName,
                                selectedPet === pet.id && { color: pet.color, fontWeight: '800' },
                            ]}
                        >
                            {pet.name}
                        </Text>
                        <Text style={styles.petTagline}>{pet.tagline}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => animateStep(2)}
            >
                <LinearGradient
                    colors={[currentPet.color, COLORS.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientButton}
                >
                    <Text style={styles.primaryButtonText}>
                        {currentPet.emoji} I choose {currentPet.name}!
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    const renderGradePicker = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.petPreview}>{currentPet.emoji}</Text>
            <Text style={styles.stepTitle}>
                What grade are you in? 🏫
            </Text>
            <Text style={styles.stepSubtitle}>
                {currentPet.name} will tailor feedback to your level
            </Text>
            <View style={styles.gradeGrid}>
                {GRADES.map((g) => (
                    <TouchableOpacity
                        key={g.value}
                        style={[
                            styles.gradeChip,
                            selectedGrade === g.value && {
                                backgroundColor: currentPet.color,
                                borderColor: currentPet.color,
                            },
                        ]}
                        onPress={() => setSelectedGrade(g.value)}
                    >
                        <Text
                            style={[
                                styles.gradeChipText,
                                selectedGrade === g.value && styles.gradeChipTextSelected,
                            ]}
                        >
                            {g.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleComplete}
            >
                <LinearGradient
                    colors={[currentPet.color, COLORS.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientButton}
                >
                    <Text style={styles.primaryButtonText}>Start Writing! ✨</Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => animateStep(1)}
            >
                <Text style={styles.backText}>← Change pet</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <LinearGradient
            colors={[COLORS.background, '#EDE9FE', COLORS.background]}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Animated.View
                    style={[
                        styles.contentWrapper,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    {/* Progress dots */}
                    <View style={styles.progressContainer}>
                        {[0, 1, 2].map((s) => (
                            <View
                                key={s}
                                style={[
                                    styles.progressDot,
                                    step >= s && styles.progressDotActive,
                                ]}
                            />
                        ))}
                    </View>

                    {step === 0 && renderWelcome()}
                    {step === 1 && renderPetPicker()}
                    {step === 2 && renderGradePicker()}
                </Animated.View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    contentWrapper: {
        alignItems: 'center',
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
    },
    progressDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.border,
        marginHorizontal: SPACING.xs,
    },
    progressDotActive: {
        backgroundColor: COLORS.primary,
        width: 28,
        borderRadius: 5,
    },
    stepContainer: {
        alignItems: 'center',
        width: '100%',
    },
    mascot: {
        fontSize: 80,
        marginBottom: SPACING.md,
    },
    heroTitle: {
        ...TYPOGRAPHY.hero,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    heroSubtitle: {
        ...TYPOGRAPHY.subtitle,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    coachName: {
        color: COLORS.primary,
        fontWeight: '800',
    },
    description: {
        ...TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        paddingHorizontal: SPACING.md,
        lineHeight: 24,
    },
    stepTitle: {
        ...TYPOGRAPHY.title,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    stepSubtitle: {
        ...TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    petPreview: {
        fontSize: 48,
        marginBottom: SPACING.sm,
    },
    // Pet grid
    petGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.xl,
        maxWidth: 400,
    },
    petCard: {
        width: 110,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.sm,
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        ...SHADOWS.small,
        borderWidth: 3,
        borderColor: 'transparent',
    },
    petEmoji: {
        fontSize: 36,
        marginBottom: SPACING.xs,
    },
    petName: {
        ...TYPOGRAPHY.subtitle,
        color: COLORS.text,
        fontSize: 14,
    },
    petTagline: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textMuted,
        textAlign: 'center',
        fontSize: 10,
        marginTop: 2,
    },
    // Grade grid (K-12)
    gradeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.xl,
        maxWidth: 400,
    },
    gradeChip: {
        width: 52,
        height: 52,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.small,
        borderWidth: 2,
        borderColor: COLORS.border,
    },
    gradeChipText: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textSecondary,
    },
    gradeChipTextSelected: {
        color: '#FFFFFF',
        fontWeight: '800',
    },
    primaryButton: {
        width: '100%',
        maxWidth: 320,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        ...SHADOWS.medium,
    },
    gradientButton: {
        paddingVertical: SPACING.md,
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.lg,
    },
    primaryButtonText: {
        ...TYPOGRAPHY.subtitle,
        color: COLORS.textLight,
    },
    backButton: {
        marginTop: SPACING.md,
        padding: SPACING.sm,
    },
    backText: {
        ...TYPOGRAPHY.body,
        color: COLORS.textSecondary,
    },
});

export default WelcomeScreen;
