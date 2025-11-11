export class TextAnalyzer {
  /**
   * Calculate character-level entropy
   * Lower entropy often indicates more predictable (AI-like) text
   */
  static calculateEntropy(text) {
    const cleanText = text.toLowerCase().replace(/[^a-z]/g, "");
    if (cleanText.length < 10) return 0.5;

    const charCount = {};
    let totalChars = 0;

    for (const char of cleanText) {
      charCount[char] = (charCount[char] || 0) + 1;
      totalChars++;
    }

    let entropy = 0;
    for (const char in charCount) {
      const probability = charCount[char] / totalChars;
      entropy -= probability * Math.log2(probability);
    }

    // Normalize entropy (typical English range: 3.5-4.5, but works for any language)
    // Lower entropy = more predictable = more AI-like
    return Math.max(0, Math.min(1, 1 - entropy / 4.5));
  }

  /**
   * Calculate sentence length variability (burstiness)
   * Human writing tends to have more sentence length variation
   */
  static calculateBurstiness(text) {
    // Multi-language sentence splitting
    const sentences = text
      .split(/[.!?。！？]+/)
      .filter((s) => s.trim().length > 0);
    if (sentences.length < 3) return 0.5;

    const sentenceLengths = sentences.map((s) => s.split(/\s+/).length);
    const mean =
      sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;

    // Calculate standard deviation
    const variance =
      sentenceLengths.reduce(
        (acc, length) => acc + Math.pow(length - mean, 2),
        0
      ) / sentenceLengths.length;
    const stdDev = Math.sqrt(variance);

    // Normalize burstiness (higher stdDev = more human-like)
    const normalizedBurstiness = Math.min(stdDev / 10, 1);
    return 1 - normalizedBurstiness; // Convert to AI probability
  }

  /**
   * Calculate lexical diversity (type-token ratio)
   * AI text often has lower vocabulary diversity
   */
  static calculateLexicalDiversity(text) {
    const words = text
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 1);
    if (words.length < 10) return 0.5;

    const uniqueWords = new Set(words);
    const typeTokenRatio = uniqueWords.size / words.length;

    // Lower diversity = more AI-like
    return Math.max(0, 1 - typeTokenRatio * 1.5);
  }

  /**
   * Calculate word and phrase repetition
   * AI text often repeats words and patterns
   */
  static calculateRepetition(text) {
    const words = text
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2);
    if (words.length < 15) return 0;

    // Word repetition
    const wordFreq = {};
    let wordRepetitionScore = 0;

    words.forEach((word) => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    Object.values(wordFreq).forEach((count) => {
      if (count > 2) {
        wordRepetitionScore += (count - 2) * 0.1;
      }
    });

    // Phrase repetition (bigrams)
    const bigrams = [];
    for (let i = 0; i < words.length - 1; i++) {
      bigrams.push(`${words[i]} ${words[i + 1]}`);
    }

    const bigramFreq = {};
    let bigramRepetitionScore = 0;

    bigrams.forEach((bigram) => {
      bigramFreq[bigram] = (bigramFreq[bigram] || 0) + 1;
    });

    Object.values(bigramFreq).forEach((count) => {
      if (count > 1) {
        bigramRepetitionScore += count * 0.05;
      }
    });

    return Math.min(wordRepetitionScore + bigramRepetitionScore, 1);
  }

  /**
   * Calculate structural patterns
   * AI text often has more uniform structure
   */
  static calculateStructuralPatterns(text) {
    const sentences = text
      .split(/[.!?。！？]+/)
      .filter((s) => s.trim().length > 0);
    if (sentences.length < 3) return 0.5;

    let structuralScore = 0;

    // 1. Sentence length uniformity
    const sentenceLengths = sentences.map((s) => s.split(/\s+/).length);
    const lengthStdDev = Math.sqrt(
      sentenceLengths.reduce((sq, n) => {
        const mean =
          sentenceLengths.reduce((a, b) => a + b) / sentenceLengths.length;
        return sq + Math.pow(n - mean, 2);
      }, 0) / sentenceLengths.length
    );

    // Very uniform sentence lengths = more AI-like
    if (lengthStdDev < 2.5) structuralScore += 0.3;

    // 2. Paragraph structure analysis
    const hasParagraphBreaks =
      text.includes("\n\n") || text.includes("\r\n\r\n");
    const textLength = text.length;

    // Long text without paragraph breaks = more AI-like
    if (!hasParagraphBreaks && textLength > 400) {
      structuralScore += 0.2;
    }

    // 3. Opening phrase patterns (AI often uses similar openings)
    const sentenceBeginnings = sentences.map((s) => {
      const words = s.trim().split(/\s+/);
      return words.slice(0, 2).join(" ").toLowerCase();
    });

    const uniqueBeginnings = new Set(sentenceBeginnings);
    const beginningDiversity =
      uniqueBeginnings.size / sentenceBeginnings.length;

    if (beginningDiversity < 0.6) {
      structuralScore += 0.2;
    }

    return Math.min(structuralScore, 0.7);
  }

  /**
   * Calculate punctuation and formatting patterns
   * Human writing tends to have more varied punctuation
   */
  static calculatePunctuationPatterns(text) {
    if (text.length < 50) return 0.5;

    let punctuationScore = 0;

    // Count different punctuation types
    const punctuation = {
      periods: (text.match(/\./g) || []).length,
      commas: (text.match(/,/g) || []).length,
      questions: (text.match(/\?/g) || []).length,
      exclamations: (text.match(/!/g) || []).length,
      colons: (text.match(/:/g) || []).length,
      semicolons: (text.match(/;/g) || []).length,
    };

    const totalSentences = (text.match(/[.!?。！？]/g) || []).length || 1;

    // Very uniform punctuation distribution = more AI-like
    const punctuationVariety = Object.values(punctuation).filter(
      (count) => count > 0
    ).length;
    if (punctuationVariety < 3 && text.length > 200) {
      punctuationScore += 0.3;
    }

    // Excessive use of certain punctuation
    const commaDensity = punctuation.commas / text.length;
    if (commaDensity > 0.03) {
      // More than 3% commas
      punctuationScore += 0.2;
    }

    return Math.min(punctuationScore, 0.5);
  }

  /**
   * Calculate readability and complexity metrics
   * AI text often has either very simple or overly complex structure
   */
  static calculateReadability(text) {
    const sentences = text
      .split(/[.!?。！？]+/)
      .filter((s) => s.trim().length > 0);
    const words = text.split(/\s+/).filter((w) => w.length > 0);

    if (sentences.length === 0 || words.length === 0) return 0.5;

    const avgSentenceLength = words.length / sentences.length;
    const avgWordLength = text.replace(/\s+/g, "").length / words.length;

    let readabilityScore = 0;

    // Either very short or very long sentences = more AI-like
    if (avgSentenceLength < 8 || avgSentenceLength > 25) {
      readabilityScore += 0.3;
    }

    // Either very short or very long words = more AI-like
    if (avgWordLength < 4 || avgWordLength > 6.5) {
      readabilityScore += 0.2;
    }

    return Math.min(readabilityScore, 0.5);
  }

  /**
   * Main analysis function - language agnostic
   */
  static analyzeText(text) {
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return this.getDefaultResult();
    }

    const cleanText = text.trim();

    try {
      // Calculate all metrics
      const entropy = this.calculateEntropy(cleanText);
      const burstiness = this.calculateBurstiness(cleanText);
      const lexicalDiversity = this.calculateLexicalDiversity(cleanText);
      const repetition = this.calculateRepetition(cleanText);
      const structuralPatterns = this.calculateStructuralPatterns(cleanText);
      const punctuationPatterns = this.calculatePunctuationPatterns(cleanText);
      const readability = this.calculateReadability(cleanText);

      // Weighted combination based on research
      const aiProbability =
        entropy * 0.2 + // Character predictability
        burstiness * 0.15 + // Sentence length uniformity
        lexicalDiversity * 0.2 + // Vocabulary diversity
        repetition * 0.15 + // Word/phrase repetition
        structuralPatterns * 0.15 + // Structural patterns
        punctuationPatterns * 0.1 + // Punctuation patterns
        readability * 0.05; // Readability extremes

      const wordCount = cleanText
        .split(/\s+/)
        .filter((w) => w.length > 0).length;
      const characters = cleanText.length;

      return {
        aiProbability: Math.min(Math.max(aiProbability, 0), 1),
        metrics: {
          entropy: Math.min(Math.max(entropy, 0), 1),
          burstiness: Math.min(Math.max(burstiness, 0), 1),
          lexicalDiversity: Math.min(Math.max(lexicalDiversity, 0), 1),
          repetition: Math.min(Math.max(repetition, 0), 1),
          structuralPatterns: Math.min(Math.max(structuralPatterns, 0), 1),
          punctuationPatterns: Math.min(Math.max(punctuationPatterns, 0), 1),
          readability: Math.min(Math.max(readability, 0), 1),
        },
        wordCount,
        characters,
        detectedLanguage: "universal",
      };
    } catch (error) {
      console.error("Error in text analysis:", error);
      return this.getDefaultResult(cleanText);
    }
  }

  static getDefaultResult(text = "") {
    return {
      aiProbability: 0.5,
      metrics: {
        entropy: 0.5,
        burstiness: 0.5,
        lexicalDiversity: 0.5,
        repetition: 0,
        structuralPatterns: 0.5,
        punctuationPatterns: 0.5,
        readability: 0.5,
      },
      wordCount: text.split(/\s+/).filter((w) => w.length > 0).length,
      characters: text.length,
      detectedLanguage: "unknown",
    };
  }
}
