/**
 * ChatScreen — Main chat interface
 * Message bubbles, photo attachment, typing indicator, feedback cards.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../theme/theme';
import { analyzeWriting, sendTextMessage } from '../services/geminiService';
import { getApiKey, getGrade, getPetId, saveChatHistory, getChatHistory, clearAllData } from '../services/storageService';
import { getPetById } from '../data/pets';
import FeedbackCard from '../components/FeedbackCard';
import ImagePickerButton from '../components/ImagePickerButton';

const TypingIndicator = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = (dot, delay) =>
            Animated.loop(
                Animated.sequence([
                    Animated.timing(dot, { toValue: -8, duration: 300, delay, useNativeDriver: true }),
                    Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
                ])
            );
        animate(dot1, 0).start();
        animate(dot2, 150).start();
        animate(dot3, 300).start();
    }, []);

    return (
        <View style={styles.typingContainer}>
            <View style={styles.botBubble}>
                <View style={styles.dotsContainer}>
                    {[dot1, dot2, dot3].map((dot, i) => (
                        <Animated.View
                            key={i}
                            style={[styles.dot, { transform: [{ translateY: dot }] }]}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
};

/**
 * Convert technical API errors into child-friendly messages.
 */
const getFriendlyError = (errorMessage, isImage = false) => {
    const msg = (errorMessage || '').toLowerCase();

    if (msg.includes('api_key_invalid') || msg.includes('api key not valid')) {
        return '🔑 Oops! The API key doesn\'t seem to be working.\n\nAsk a parent or teacher to check that the API key is correct. You can get one from Google AI Studio!\n\nTap ⚙️ to go back to settings.';
    }
    if (msg.includes('quota') || msg.includes('rate limit') || msg.includes('resource_exhausted')) {
        return '⏳ Wow, you\'ve been busy! We\'ve used up our questions for now.\n\nTake a short break and try again in a minute. Great writers take breaks too! 🌟';
    }
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('connection')) {
        return '📶 Hmm, it looks like we lost our internet connection.\n\nCheck your Wi-Fi and try again! 🛜';
    }
    if (msg.includes('safety') || msg.includes('blocked')) {
        return '🛡️ I wasn\'t able to respond to that one.\n\nLet\'s stick to questions about English writing! Try asking me about grammar, essays, or creative writing. ✏️';
    }

    if (isImage) {
        return '📸 Hmm, I had trouble with that photo.\n\nCould you try again? Here are some tips:\n• Make sure the writing is clear and well-lit 💡\n• Hold the camera steady 📱\n• Try to get the whole page in the frame';
    }

    return '😅 Oops! Something didn\'t work quite right.\n\nPlease try again — I\'m sure we\'ll get it next time! 💪';
};

const ChatScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [grade, setGrade] = useState(6);
    const [pet, setPet] = useState(getPetById('scout'));
    const flatListRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            const key = await getApiKey();
            const g = await getGrade();
            const petId = await getPetId();
            const history = await getChatHistory();
            const currentPet = getPetById(petId);
            setApiKey(key || '');
            setGrade(g);
            setPet(currentPet);

            if (history.length > 0) {
                setMessages(history);
            } else {
                const welcomeMsg = {
                    id: 'welcome',
                    type: 'bot',
                    text: `${currentPet.greeting} I'm ${currentPet.name} ${currentPet.emoji}, your Grade ${g} writing buddy!\n\n📸 Take a photo of your writing and I'll give you helpful feedback aligned with your Ontario curriculum.\n\n✏️ You can also ask me questions about writing, grammar, or English!`,
                    timestamp: new Date().toISOString(),
                };
                setMessages([welcomeMsg]);
            }
        };
        init();
    }, []);

    // Auto-save chat history
    useEffect(() => {
        if (messages.length > 0) {
            // Don't save messages with feedback objects (too large)
            const saveable = messages.map((m) => ({
                ...m,
                feedback: m.feedback ? { overallEncouragement: m.feedback.overallEncouragement, overallStars: m.feedback.overallStars } : undefined,
            }));
            saveChatHistory(saveable);
        }
    }, [messages]);

    const scrollToBottom = useCallback(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, []);

    const addMessage = useCallback((msg) => {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
    }, [scrollToBottom]);

    const handleSendText = async () => {
        const text = inputText.trim();
        if (!text || isLoading) return;

        setInputText('');
        const userMsg = {
            id: Date.now().toString(),
            type: 'user',
            text,
            timestamp: new Date().toISOString(),
        };
        addMessage(userMsg);
        setIsLoading(true);

        try {
            const response = await sendTextMessage(apiKey, text, grade, pet.name, pet.personality);
            const botMsg = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                text: response,
                timestamp: new Date().toISOString(),
            };
            addMessage(botMsg);
        } catch (error) {
            const friendlyError = getFriendlyError(error.message);
            const errorMsg = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                text: friendlyError,
                isError: true,
                timestamp: new Date().toISOString(),
            };
            addMessage(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageSelected = async (imageData) => {
        const userMsg = {
            id: Date.now().toString(),
            type: 'user',
            text: '📸 Here\'s my writing!',
            imageUri: imageData.uri,
            timestamp: new Date().toISOString(),
        };
        addMessage(userMsg);
        setIsLoading(true);

        try {
            const feedback = await analyzeWriting(
                apiKey,
                imageData.base64,
                imageData.mimeType,
                grade,
                'english',
                pet.name,
                pet.personality
            );
            const botMsg = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                text: feedback.overallEncouragement,
                feedback,
                timestamp: new Date().toISOString(),
            };
            addMessage(botMsg);
        } catch (error) {
            const friendlyError = getFriendlyError(error.message, true);
            const errorMsg = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                text: friendlyError,
                isError: true,
                timestamp: new Date().toISOString(),
            };
            addMessage(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        Alert.alert(
            'Start Over?',
            'This will clear your chat history and settings. You\'ll need to set up again.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        await clearAllData();
                        navigation.replace('Welcome');
                    },
                },
            ]
        );
    };

    const renderMessage = ({ item }) => {
        const isUser = item.type === 'user';

        return (
            <View
                style={[
                    styles.messageRow,
                    isUser ? styles.userMessageRow : styles.botMessageRow,
                ]}
            >
                {!isUser && <Text style={styles.botAvatar}>{pet.emoji}</Text>}
                <View style={styles.messageBubbleContainer}>
                    {/* Image preview */}
                    {item.imageUri && (
                        <Image source={{ uri: item.imageUri }} style={styles.messageImage} />
                    )}

                    {/* Text bubble */}
                    <View
                        style={[
                            styles.messageBubble,
                            isUser ? styles.userBubble : styles.botBubble,
                            item.isError && styles.errorBubble,
                        ]}
                    >
                        <Text
                            style={[
                                styles.messageText,
                                isUser ? styles.userText : styles.botText,
                            ]}
                        >
                            {item.text}
                        </Text>
                    </View>

                    {/* Feedback card */}
                    {item.feedback && <FeedbackCard feedback={item.feedback} />}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.headerTitle}>{pet.emoji} {pet.name}</Text>
                        <Text style={styles.headerSubtitle}>Grade {grade} • English</Text>
                    </View>
                    <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                        <Text style={styles.resetIcon}>⚙️</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={scrollToBottom}
                showsVerticalScrollIndicator={false}
            />

            {/* Typing indicator */}
            {isLoading && <TypingIndicator />}

            {/* Input bar */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                <View style={styles.inputBar}>
                    <ImagePickerButton
                        onImageSelected={handleImageSelected}
                        disabled={isLoading}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Ask me about writing..."
                        placeholderTextColor={COLORS.textMuted}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={500}
                        editable={!isLoading}
                        onSubmitEditing={handleSendText}
                        returnKeyType="send"
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
                        ]}
                        onPress={handleSendText}
                        disabled={!inputText.trim() || isLoading}
                    >
                        <Text style={styles.sendIcon}>
                            {isLoading ? '⏳' : '🚀'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 56 : 40,
        paddingBottom: SPACING.md,
        paddingHorizontal: SPACING.lg,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        ...TYPOGRAPHY.title,
        color: COLORS.textLight,
    },
    headerSubtitle: {
        ...TYPOGRAPHY.caption,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    resetButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resetIcon: {
        fontSize: 20,
    },
    messagesList: {
        padding: SPACING.md,
        paddingBottom: SPACING.xl,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: SPACING.md,
        maxWidth: '85%',
    },
    userMessageRow: {
        alignSelf: 'flex-end',
    },
    botMessageRow: {
        alignSelf: 'flex-start',
    },
    botAvatar: {
        fontSize: 28,
        marginRight: SPACING.sm,
        marginTop: SPACING.xs,
    },
    messageBubbleContainer: {
        maxWidth: '100%',
        flexShrink: 1,
    },
    messageBubble: {
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        ...SHADOWS.small,
    },
    userBubble: {
        backgroundColor: COLORS.userBubble,
        borderBottomRightRadius: SPACING.xs,
    },
    botBubble: {
        backgroundColor: COLORS.botBubble,
        borderBottomLeftRadius: SPACING.xs,
    },
    errorBubble: {
        backgroundColor: '#FEF2F2',
    },
    messageText: {
        ...TYPOGRAPHY.body,
        lineHeight: 22,
    },
    userText: {
        color: COLORS.userBubbleText,
    },
    botText: {
        color: COLORS.botBubbleText,
    },
    messageImage: {
        width: 200,
        height: 260,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.sm,
        backgroundColor: COLORS.border,
    },
    typingContainer: {
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.sm,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.textMuted,
        marginHorizontal: 3,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: SPACING.sm,
        paddingBottom: Platform.OS === 'ios' ? SPACING.lg : SPACING.sm,
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
        ...SHADOWS.small,
    },
    textInput: {
        flex: 1,
        backgroundColor: COLORS.background,
        borderRadius: BORDER_RADIUS.xl,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        ...TYPOGRAPHY.body,
        color: COLORS.text,
        maxHeight: 100,
        minHeight: 44,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: SPACING.sm,
        ...SHADOWS.small,
    },
    sendButtonDisabled: {
        backgroundColor: COLORS.border,
    },
    sendIcon: {
        fontSize: 20,
    },
});

export default ChatScreen;
