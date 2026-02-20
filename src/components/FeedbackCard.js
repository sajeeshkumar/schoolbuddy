/**
 * FeedbackCard — Displays structured curriculum-aligned feedback
 * With star ratings, color-coded badges, and animated entrance.
 */
import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
} from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, TYPOGRAPHY, SHADOWS, getStarRating } from '../theme/theme';

const CriterionRow = ({ criterion, index }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 150,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                delay: index * 150,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const starColor =
        criterion.stars >= 4
            ? COLORS.success
            : criterion.stars >= 3
                ? COLORS.accent
                : COLORS.warning;

    return (
        <Animated.View
            style={[
                styles.criterionCard,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
        >
            <View style={styles.criterionHeader}>
                <Text style={styles.criterionIcon}>{criterion.icon || '📋'}</Text>
                <Text style={styles.criterionName}>{criterion.name}</Text>
                <Text style={[styles.criterionStars, { color: starColor }]}>
                    {getStarRating(criterion.stars)}
                </Text>
            </View>
            <Text style={styles.criterionFeedback}>{criterion.feedback}</Text>
            {criterion.tip && (
                <View style={styles.tipContainer}>
                    <Text style={styles.tipLabel}>💡 Tip:</Text>
                    <Text style={styles.tipText}>{criterion.tip}</Text>
                </View>
            )}
        </Animated.View>
    );
};

const FeedbackCard = ({ feedback, onDismiss }) => {
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    if (!feedback) return null;

    // Map criteria icons from curriculum data
    const criteriaIcons = { ideas_organization: '💡', voice_style: '🎨', conventions: '📏', reflection: '🤔', critical_thinking: '🧠', critical_literacy: '🌍' };

    return (
        <Animated.View
            style={[
                styles.container,
                { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
        >
            {/* Overall encouragement */}
            <View style={styles.overallSection}>
                <Text style={styles.overallStars}>
                    {getStarRating(feedback.overallStars)}
                </Text>
                <Text style={styles.overallText}>{feedback.overallEncouragement}</Text>
            </View>

            {/* Per-criterion feedback */}
            {feedback.criteria && feedback.criteria.length > 0 && (
                <View style={styles.criteriaSection}>
                    <Text style={styles.sectionTitle}>📊 Detailed Feedback</Text>
                    {feedback.criteria.map((criterion, index) => (
                        <CriterionRow
                            key={criterion.id || index}
                            criterion={{
                                ...criterion,
                                icon: criteriaIcons[criterion.id] || '📋',
                            }}
                            index={index}
                        />
                    ))}
                </View>
            )}

            {/* Fun fact */}
            {feedback.funFact && (
                <View style={styles.funFactContainer}>
                    <Text style={styles.funFactLabel}>🎲 Fun Fact</Text>
                    <Text style={styles.funFactText}>{feedback.funFact}</Text>
                </View>
            )}

            {/* Next challenge */}
            {feedback.nextChallenge && (
                <View style={styles.challengeContainer}>
                    <Text style={styles.challengeLabel}>🚀 Try This Next!</Text>
                    <Text style={styles.challengeText}>{feedback.nextChallenge}</Text>
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        marginVertical: SPACING.sm,
        ...SHADOWS.medium,
    },
    overallSection: {
        alignItems: 'center',
        paddingBottom: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
        marginBottom: SPACING.md,
    },
    overallStars: {
        fontSize: 28,
        marginBottom: SPACING.sm,
    },
    overallText: {
        ...TYPOGRAPHY.body,
        color: COLORS.text,
        textAlign: 'center',
        lineHeight: 22,
    },
    criteriaSection: {
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        ...TYPOGRAPHY.subtitle,
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    criterionCard: {
        backgroundColor: COLORS.background,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
    },
    criterionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    criterionIcon: {
        fontSize: 18,
        marginRight: SPACING.xs,
    },
    criterionName: {
        ...TYPOGRAPHY.bodyBold,
        color: COLORS.text,
        flex: 1,
    },
    criterionStars: {
        fontSize: 14,
    },
    criterionFeedback: {
        ...TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
        fontSize: 14,
        lineHeight: 20,
    },
    tipContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.sm,
        padding: SPACING.sm,
        marginTop: SPACING.xs,
    },
    tipLabel: {
        ...TYPOGRAPHY.caption,
        fontWeight: '700',
        marginRight: SPACING.xs,
    },
    tipText: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        flex: 1,
    },
    funFactContainer: {
        backgroundColor: '#FEF3C7',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
    },
    funFactLabel: {
        ...TYPOGRAPHY.bodyBold,
        color: COLORS.accentDark,
        marginBottom: SPACING.xs,
    },
    funFactText: {
        ...TYPOGRAPHY.caption,
        color: COLORS.text,
        lineHeight: 20,
    },
    challengeContainer: {
        backgroundColor: '#ECFDF5',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
    },
    challengeLabel: {
        ...TYPOGRAPHY.bodyBold,
        color: COLORS.successDark,
        marginBottom: SPACING.xs,
    },
    challengeText: {
        ...TYPOGRAPHY.caption,
        color: COLORS.text,
        lineHeight: 20,
    },
});

export default FeedbackCard;
