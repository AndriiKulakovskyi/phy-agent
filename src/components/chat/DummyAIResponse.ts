// A utility to generate dummy AI responses for the chat interface
// This will be replaced with actual LLM integration later

const therapeuticResponses = [
  "I understand that must be challenging for you. Could you tell me more about how that makes you feel?",
  "It sounds like you're going through a difficult time. What strategies have helped you cope with similar situations in the past?",
  "Thank you for sharing that with me. How long have you been experiencing these feelings?",
  "I'm hearing that you're feeling overwhelmed. Let's break this down into smaller, more manageable parts.",
  "That's a common experience many people face. How has this been affecting your daily life?",
  "I'm curious about what thoughts come up for you when you're in that situation.",
  "It takes courage to talk about these things. What would be a small step you could take toward addressing this?",
  "I notice you mentioned feeling anxious. Can you describe what that anxiety feels like in your body?",
  "Let's explore some techniques that might help you manage these feelings more effectively.",
  "I'm wondering if you've noticed any patterns or triggers related to when these feelings intensify?",
  "That sounds really difficult. How have you been taking care of yourself during this time?",
  "I appreciate your openness. What kind of support do you feel would be most helpful right now?",
  "It's important to acknowledge these feelings. Have you considered how they might be connected to your past experiences?",
  "I'm hearing that this situation has been really impacting your wellbeing. What would feeling better look like to you?",
  "Let's work together to develop some coping strategies that might help in these moments.",
];

const followUpQuestions = [
  "How does that make you feel?",
  "Can you tell me more about that?",
  "When did you first notice this?",
  "What thoughts come up when this happens?",
  "How has this affected your relationships?",
  "What would be helpful for you right now?",
  "Have you tried any strategies to cope with this?",
  "How would you like things to be different?",
  "What support do you currently have?",
  "How does this compare to how you've felt in the past?",
];

const validationStatements = [
  "That sounds really challenging.",
  "I can understand why you'd feel that way.",
  "It makes sense that you're feeling this way given what you've described.",
  "That's a very common reaction to this type of situation.",
  "Your feelings are completely valid.",
  "It takes courage to share these experiences.",
  "I appreciate your openness about this.",
  "Thank you for trusting me with this information.",
  "It's understandable to have those reactions.",
  "Many people would feel similarly in your position.",
];

/**
 * Generates a random therapeutic response
 * @returns A string containing a therapeutic response
 */
export const generateDummyResponse = (): string => {
  // Randomly decide whether to include a validation statement (70% chance)
  const includeValidation = Math.random() < 0.7;

  // Randomly select a therapeutic response
  const responseIndex = Math.floor(Math.random() * therapeuticResponses.length);
  let response = therapeuticResponses[responseIndex];

  // Add a validation statement before the response if decided
  if (includeValidation) {
    const validationIndex = Math.floor(
      Math.random() * validationStatements.length,
    );
    response = `${validationStatements[validationIndex]} ${response}`;
  }

  // Randomly decide whether to add a follow-up question (50% chance)
  const includeFollowUp = Math.random() < 0.5;

  if (includeFollowUp) {
    const followUpIndex = Math.floor(Math.random() * followUpQuestions.length);
    response = `${response} ${followUpQuestions[followUpIndex]}`;
  }

  return response;
};

/**
 * Simulates the typing effect by returning portions of the message over time
 * @param message The full message to be typed
 * @param callback Function to call with each portion of the message
 * @param onComplete Function to call when typing is complete
 */
export const simulateTyping = (
  message: string,
  callback: (text: string) => void,
  onComplete: () => void,
): void => {
  const words = message.split(" ");
  let currentIndex = 0;
  let currentText = "";

  // Determine a random typing speed between 50-100ms per word
  const typingSpeed = Math.floor(Math.random() * 50) + 50;

  const typeNextWord = () => {
    if (currentIndex < words.length) {
      currentText += (currentIndex > 0 ? " " : "") + words[currentIndex];
      callback(currentText);
      currentIndex++;
      setTimeout(typeNextWord, typingSpeed);
    } else {
      onComplete();
    }
  };

  typeNextWord();
};
