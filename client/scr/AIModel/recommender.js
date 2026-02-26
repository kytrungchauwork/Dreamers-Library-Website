import storiesData from "@/data/stories.json";
import chapterContentData from "@/data/chapter-content.json";

// Danh sách từ vô nghĩa tiếng Việt cơ bản
const VIETNAMESE_STOPWORDS = new Set([
  "là",
  "của",
  "và",
  "những",
  "các",
  "trong",
  "đã",
  "đang",
  "thì",
  "mà",
  "bị",
  "bởi",
  "với",
  "cho",
  "không",
  "có",
  "được",
  "ra",
  "vào",
  "lên",
  "xuống",
  "đi",
  "lại",
  "người",
  "khi",
  "lúc",
  "này",
  "đó",
  "cái",
  "con",
  "chiếc",
  "bức",
  "một",
  "hai",
  "ba",
]);

const tokenize = (text) => {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !VIETNAMESE_STOPWORDS.has(word));
};

const prepareCorpus = () => {
  return storiesData.map((story) => {
    let textContent = story.description || "";
    // nếu mô tả quá ngắn hoặc không có, lấy nội dung chương 1
    if (
      textContent.length < 50 &&
      story.chapters &&
      story.chapters.length > 0
    ) {
      const firstChapterId = story.chapters[0].id;
      const key = `${story.id}-${firstChapterId}`;
      const chapterData = chapterContentData[key];
      if (chapterData && chapterData.content) {
        textContent += " " + chapterData.content;
      }
    }

    return {
      id: story.id,
      tokens: tokenize(textContent),
    };
  });
};

const createVectors = (corpus) => {
  const vocabulary = new Set();
  const docCount = corpus.length;
  const wordDocFrequency = {};
  corpus.forEach((doc) => {
    const uniqueTokens = new Set(doc.tokens);
    uniqueTokens.forEach((token) => {
      vocabulary.add(token);
      wordDocFrequency[token] = (wordDocFrequency[token] || 0) + 1;
    });
  });

  const vocabArray = Array.from(vocabulary);
  const vectors = corpus.map((doc) => {
    const vec = new Array(vocabArray.length).fill(0);
    const termFrequency = {};
    doc.tokens.forEach((token) => {
      termFrequency[token] = (termFrequency[token] || 0) + 1;
    });

    // Tính TF-IDF
    vocabArray.forEach((term, index) => {
      const tf = termFrequency[term] || 0;
      const idf = Math.log(docCount / (1 + (wordDocFrequency[term] || 0)));
      vec[index] = tf * idf;
    });

    return { id: doc.id, vec };
  });

  return vectors;
};

// Tính Cosine Similarity giữa 2 vector
const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (magA * magB);
};

export const getRecommendations = (currentStoryId, limit = 4) => {
  const corpus = prepareCorpus();
  const vectors = createVectors(corpus);

  const currentVectorObj = vectors.find((v) => v.id === currentStoryId);
  if (!currentVectorObj) return [];

  const scores = vectors
    // Loại bỏ chính truyện đang xem
    .filter((v) => v.id !== currentStoryId)
    .map((v) => ({
      id: v.id,
      score: cosineSimilarity(currentVectorObj.vec, v.vec),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return scores.map((s) => storiesData.find((story) => story.id === s.id));
};
