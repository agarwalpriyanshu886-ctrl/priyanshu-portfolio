export interface GeneralAIResult {
  text: string
  suggestions: string[]
}

const GENERAL_KNOWLEDGE_BASE: Array<{
  keywords: string[]
  answer: string
  suggestions: string[]
}> = [
  {
    keywords: ['chatgpt', 'chat gpt', 'openai', 'gpt-4', 'llm'],
    answer:
      '**ChatGPT** is a conversational AI assistant developed by OpenAI. It is built using Large Language Models (LLMs) trained on vast datasets to understand natural language, generate code, write text, answer complex questions, and assist in technical problem-solving.',
    suggestions: ['What is ChatGPT used for?', 'How does an LLM work?', 'ChatGPT vs Traditional Search'],
  },
  {
    keywords: ['python'],
    answer:
      '**Python** is a high-level, interpreted programming language known for its clear syntax and versatility. It is the dominant language for Artificial Intelligence, Machine Learning, Data Science, and Backend Web Development.',
    suggestions: ['Why is Python used for AI?', 'Python vs JavaScript', 'How to learn Python?'],
  },
  {
    keywords: ['react vs angular', 'difference between react and angular', 'react or angular'],
    answer:
      '**React** is a lightweight JavaScript library for building component-based user interfaces (created by Meta), while **Angular** is a full-featured TypeScript framework (developed by Google). React offers greater flexibility and a smaller learning curve, whereas Angular provides built-in tools for routing, state management, and dependency injection out of the box.',
    suggestions: ['Why choose React for Web Apps?', 'What is Vite with React?', 'React vs Next.js'],
  },
  {
    keywords: ['capital of india', 'india capital'],
    answer: '**New Delhi** is the official capital of India.',
    suggestions: ['Tell me about India', 'General Knowledge topics'],
  },
  {
    keywords: ['machine learning', 'what is ml', 'what is machine learning'],
    answer:
      '**Machine Learning (ML)** is a subset of Artificial Intelligence where algorithms analyze data, learn patterns, and make predictions without being explicitly programmed for every scenario.',
    suggestions: ['Supervised vs Unsupervised ML', 'What is Neural Network?', 'ML vs AI'],
  },
]

export function answerGeneralQuestion(query: string): GeneralAIResult {
  const q = query.toLowerCase()

  for (const item of GENERAL_KNOWLEDGE_BASE) {
    if (item.keywords.some((kw) => q.includes(kw))) {
      return {
        text: item.answer,
        suggestions: item.suggestions,
      }
    }
  }

  // Dynamic General Fallback for any other general query
  return {
    text: `That is a great general query! While I primarily serve as Priyanshu's portfolio guide, I can answer technical & general knowledge questions. If you'd like to explore how Priyanshu applies technical tools in his projects, feel free to ask!`,
    suggestions: ['Tell me about Priyanshu', 'Show me his AI projects', 'What is ChatGPT used for?'],
  }
}
