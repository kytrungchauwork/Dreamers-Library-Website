import StoryModel from "../models/storyModel.js";

// Danh sách từ dừng (Stopwords) tiếng Việt cơ bản
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
  "bốn",
  "năm",
  "như",
  "vì",
  "nên",
  "tại",
  "do",
  "từ",
  "đến",
  "về",
  "cũng",
  "vẫn",
  "sẽ",
  "phải",
  "nhưng",
  "hoặc",
  "theo",
]);

const tokenize = (text) => {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !VIETNAMESE_STOPWORDS.has(word));
};

const prepareCorpus = (stories) => {
  return stories.map((story) => {
    // Tăng trọng số tiêu đề bằng cách lặp lại nó
    let textContent = `${story.title} ${story.title} ${
      story.description || ""
    }`;
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

    vocabArray.forEach((term, index) => {
      const tf = termFrequency[term] || 0;
      const idf = Math.log(docCount / (1 + (wordDocFrequency[term] || 0)));
      vec[index] = tf * idf;
    });

    return { id: doc.id, vec };
  });

  return vectors;
};

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

export const getStoryRecommendations = async (req, res) => {
  try {
    const currentStoryId = parseInt(req.params.id);
    const limit = 4;

    // 1. Lấy truyện hiện tại để chắc chắn nó tồn tại
    const currentStory = await StoryModel.findById(currentStoryId);
    if (!currentStory) {
      return res
        .status(404)
        .json({ success: false, message: "Story not found" });
    }

    // 2. Lấy danh sách truyện để so sánh (Lấy 50 truyện mới nhất)
    const allStories = await StoryModel.findAll(50, 0);

    // Đảm bảo truyện hiện tại có trong danh sách để tạo vector
    let processingList = [...allStories];
    if (!processingList.find((s) => s.id === currentStoryId)) {
      processingList.push(currentStory);
    }

    // 3. Tính toán AI
    const corpus = prepareCorpus(processingList);
    const vectors = createVectors(corpus);
    const currentVectorObj = vectors.find((v) => v.id === currentStoryId);

    let scores = [];
    if (currentVectorObj) {
      scores = vectors
        .filter((v) => v.id !== currentStoryId)
        .map((v) => ({
          id: v.id,
          score: cosineSimilarity(currentVectorObj.vec, v.vec),
        }))
        .filter((s) => s.score > 0) // Lấy các truyện có điểm tương đồng > 0
        .sort((a, b) => b.score - a.score);
    }

    // 4. --- LOGIC FALLBACK (QUAN TRỌNG) ---
    // Nếu AI tìm được ít hơn 4 truyện, ta lấy thêm truyện ngẫu nhiên/mới nhất bù vào
    if (scores.length < limit) {
      const existingIds = new Set([currentStoryId, ...scores.map((s) => s.id)]);

      // Lấy thêm truyện từ danh sách allStories chưa có trong scores
      const fallbackStories = allStories
        .filter((s) => !existingIds.has(s.id))
        .slice(0, limit - scores.length);

      // Gộp vào danh sách kết quả
      const fallbackScores = fallbackStories.map((s) => ({
        id: s.id,
        score: 0,
      }));
      scores = [...scores, ...fallbackScores];
    }

    // Cắt đúng số lượng cần lấy
    scores = scores.slice(0, limit);

    // 5. Map lại thông tin chi tiết truyện để trả về Client
    const recommendedStories = scores
      .map((scoreItem) => {
        return processingList.find((s) => s.id === scoreItem.id);
      })
      .filter((item) => item !== undefined); // Lọc bỏ undefined nếu có lỗi

    return res.json({
      success: true,
      data: recommendedStories,
    });
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    // Nếu lỗi thuật toán, trả về mảng rỗng để không crash app
    res.json({ success: true, data: [] });
  }
};
