import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

// Icons
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { BsList, BsGearFill, BsBookmarkFill, BsBookmark } from "react-icons/bs";
import { FaHeart, FaRegHeart, FaPlay, FaPause, FaTimes } from "react-icons/fa";
import { IoHeadset } from "react-icons/io5";

// Context & Utils
import { useLibrary } from "@/contexts/libraryAPIContext";
import { toggleLikeStory } from "@/services/libraryAPI";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { getStoryData, saveStoryData } from "@/utils/storage";

// Components
import Sidebar from "@/components/layout/Sidebar"; // ✅ 1. Import Sidebar chính

// API Services
import { getBookmarkOfStory, bookmarkChapter, removeBookmark } from "@/services/bookmarkAPI";
import { getStoryById } from "@/services/storyAPI";
import {
  getChapterById,
  getChaptersByStory,
  increaseChapterView,
} from "@/services/chapterAPI";

const ReadingPage = () => {
  const { storyId, chapterId } = useParams();
  const { libraryStories, reloadLibrary } = useLibrary();
  const navigate = useNavigate();

  const currentChapterId = parseInt(chapterId);
  const currentStoryId = parseInt(storyId);

  // --- STATE DỮ LIỆU ---
  const [story, setStory] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const safeStory = story || { title: "Đang tải...", id: currentStoryId };
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useContext(AuthContext);

  // --- STATE UI ---
  const [isChapterListVisible, setIsChapterListVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [markedChapterId, setMarkedChapterId] = useState(null);

  // --- STATE AUDIO ---
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");
  const utteranceRef = useRef(null);

  // --- STATE SETTINGS ---
  const [settings, setSettings] = useState({
    fontSize: 18,
    fontFamily: "'Quicksand', sans-serif",
    theme: "white",
  });

  const themes = {
    white: { bg: "#ffffff", text: "#333333" },
    yellow: { bg: "#fdf6e3", text: "#5f4b32" },
    blue: { bg: "#e9fbfb", text: "#333333" },
  };

  const fontOptions = [
    { label: "Mặc định", value: "'Quicksand', sans-serif" },
    { label: "Times New Roman", value: "'Merriweather', 'Times New Roman', serif" },
    { label: "Arial", value: "'Arial', sans-serif" },
  ];

  useEffect(() => {
    if (!safeStory?.id) return;
    const liked = libraryStories.some(
      (s) => s.id === safeStory.id
    );
    setIsLiked(liked);
  }, [libraryStories, safeStory?.id]);

  // ... (Giữ nguyên toàn bộ phần useEffect và Logic Audio/API y hệt code cũ) ...
  // Để tiết kiệm không gian, mình không paste lại đoạn logic ở giữa vì nó không đổi.
  // Hãy giữ nguyên từ dòng `useEffect` đến hết hàm `handleNextChapter`.

  // ===========================================================
  // 🔥 1. GỌI API & LOGIC (GIỮ NGUYÊN)
  // ===========================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const chapterRes = await getChapterById(chapterId);
        if (chapterRes.data.success) {
          setChapter(chapterRes.data.data);
        }
        const storyRes = await getStoryById(storyId);
        if (storyRes.data.success) setStory(storyRes.data.data);
        const chaptersRes = await getChaptersByStory(storyId);
        if (chaptersRes.data.success) setChapters(chaptersRes.data.data);
      } catch (error) {
        console.error("Lỗi tải API:", error);
      }
    };
    fetchData();
  }, [storyId, chapterId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      increaseChapterView(chapterId).catch(() => {});
    }, 5000);
    return () => clearTimeout(timer);
  }, [chapterId]);

  // Logic Bookmark
  useEffect(() => {
    if (!user) return;

    const fetchBookmark = async () => {
      try {
        const res = await getBookmarkOfStory(currentStoryId);
        setMarkedChapterId(res.data.data?.chapter_id || null);
      } catch (err) {
        console.error("Load bookmark failed", err);
      }
    };

    fetchBookmark();
  }, [currentStoryId, user]);

  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    const vnVoices = voices.filter((v) => v.lang.includes("vi"));
    vnVoices.sort((a, b) => {
      const isANatural = a.name.includes("Natural");
      const isBNatural = b.name.includes("Natural");
      return isANatural && !isBNatural ? -1 : !isANatural && isBNatural ? 1 : 0;
    });
    setAvailableVoices(vnVoices.length > 0 ? vnVoices : voices);
    if (!selectedVoiceURI && vnVoices.length > 0) {
      let best = vnVoices.find(
        (v) => v.name.includes("HoaiMy") && v.name.includes("Natural")
      );
      if (!best)
        best = vnVoices.find((v) => v.name.includes("Google Tiếng Việt"));
      if (best) setSelectedVoiceURI(best.voiceURI);
    }
  };

  useEffect(() => {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleToggleBookmark = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để bookmark");
      return;
    }

    try {
      if (markedChapterId === currentChapterId) {
        await removeBookmark(currentStoryId);
        setMarkedChapterId(null);
      } else {
        await bookmarkChapter({
          storyId: currentStoryId,
          chapterId: currentChapterId,
        });
        setMarkedChapterId(currentChapterId);
      }
    } catch (err) {
      console.error("Toggle bookmark failed", err);
    }
  };

  const processTextForSpeech = (text) =>
    text ? text.replace(/\n/g, ". ").replace(/[-_]/g, " ") : "Nội dung trống";

  const handleStartAudio = () => {
    if (!chapter) return;
    window.speechSynthesis.cancel();
    const voice = availableVoices.find((v) => v.voiceURI === selectedVoiceURI);
    const content = chapter.content || "Chương này chưa có nội dung.";
    const textToRead = processTextForSpeech(content);

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = "vi-VN";
    utterance.rate = playbackRate;
    if (voice) utterance.voice = voice;

    utterance.onend = () => setIsPlaying(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleStopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };
  const handleResumeAudio = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    } else handleStartAudio();
  };
  const handlePauseAudio = () => {
    window.speechSynthesis.pause();
    setIsPlaying(false);
  };
  const changePlaybackRate = (e) => {
    const rate = parseFloat(e.target.value);
    setPlaybackRate(rate);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setTimeout(handleStartAudio, 100);
    }
  };

  const currentIndex = chapters.findIndex((c) => c.id === currentChapterId);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < chapters.length - 1;

  const handlePrevChapter = () => {
    if (hasPrev) {
      handleStopAudio();
      const prevId = chapters[currentIndex - 1].id;
      navigate(`/truyen/${storyId}/chuong/${prevId}`);
    }
  };

  const handleNextChapter = () => {
    if (hasNext) {
      handleStopAudio();
      const nextId = chapters[currentIndex + 1].id;
      navigate(`/truyen/${storyId}/chuong/${nextId}`);
    }
  };

  if (!chapter) {
    return (
      <div className="h-screen flex items-center justify-center font-['Quicksand']">
        Đang tải nội dung chương...
      </div>
    );
  }

  const handleToggleLike = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để thích truyện");
      return;
    }

    try {
      const res = await toggleLikeStory(safeStory.id);
      if (res.data.success) {
        setIsLiked(res.data.liked);

        // 🔥 SYNC TOÀN HỆ THỐNG
        reloadLibrary();
      }
    } catch (err) {
      console.error("Toggle like failed", err);
    }
  };


  return (
    <div className="grid grid-cols-[80px_1fr] grid-rows-[60px_1fr] h-screen font-['Quicksand'] relative overflow-hidden">
      {/* HEADER */}
      <header className="col-start-2 row-start-1 bg-white flex justify-between items-center px-[20px] border-b border-[#ddd] relative z-[500]">
        <Link
          to={`/truyen/${storyId}`}
          className="flex items-center gap-[8px] no-underline text-[#333] font-medium"
        >
          <IoIosArrowBack /> {safeStory.title}
        </Link>

        <div className="flex gap-[15px] items-center relative">
          <button
            onClick={handleToggleLike}
            className="bg-none border-none text-[22px] cursor-pointer"
          >
            {isLiked ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className="text-[#333]" />
            )}
          </button>

          <button
            onClick={handleToggleBookmark}
            className={`bg-none border-none text-[22px] cursor-pointer ${
              markedChapterId === currentChapterId
                ? "text-orange-500"
                : "text-[#333]"
            }`}
          >
            {markedChapterId === currentChapterId ? (
              <BsBookmarkFill />
            ) : (
              <BsBookmark />
            )}
          </button>

          <button
            onClick={() => setIsSettingsVisible(!isSettingsVisible)}
            className={`bg-none border-none text-[22px] cursor-pointer ${
              isSettingsVisible ? "text-[#007bff]" : "text-[#333]"
            }`}
          >
            <BsGearFill />
          </button>

          {/* SETTINGS POPUP */}
          {isSettingsVisible && (
            <div className="absolute top-[50px] right-[40px] w-[300px] bg-white border border-[#ddd] shadow-lg rounded-[10px] p-[15px] z-[600] flex flex-col gap-[15px]">
              <div>
                <p className="text-[14px] font-bold mb-[8px] text-[#555]">
                  Giọng đọc (AI)
                </p>
                <select
                  className="w-full p-[8px] border border-[#ccc] rounded-[5px] text-[13px] bg-gray-50 text-black"
                  value={selectedVoiceURI}
                  onChange={(e) => {
                    setSelectedVoiceURI(e.target.value);
                    if (isPlaying) handleStopAudio();
                  }}
                >
                  {availableVoices.map((voice) => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name
                        .replace("Microsoft", "")
                        .replace("Online (Natural)", "✨ AI")}
                    </option>
                  ))}
                </select>
              </div>

              <hr className="border-t border-gray-100" />

              {/* Font chữ */}
              <div>
                <p className="text-[14px] font-bold mb-[8px] text-[#555]">
                  Phông chữ
                </p>
                <div className="flex gap-[5px] flex-wrap">
                  {fontOptions.map((font) => (
                    <button
                      key={font.value}
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          fontFamily: font.value,
                        }))
                      }
                      className={`flex-1 py-[6px] px-2 text-[12px] border rounded-[5px] truncate ${
                        settings.fontFamily === font.value
                          ? "border-blue-500 bg-blue-50 text-blue-600 font-bold"
                          : "border-[#ccc] text-[#333]"
                      }`}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-t border-gray-100" />

              <div>
                <p className="text-[14px] font-bold mb-[8px] text-[#555]">
                  Màu nền
                </p>
                <div className="flex gap-[10px]">
                  {Object.keys(themes).map((themeKey) => (
                    <button
                      key={themeKey}
                      onClick={() =>
                        setSettings((prev) => ({ ...prev, theme: themeKey }))
                      }
                      className={`w-[40px] h-[40px] rounded-full border border-[#ccc] ${
                        settings.theme === themeKey
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      style={{ backgroundColor: themes[themeKey].bg }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[14px] font-bold mb-[8px] text-[#555]">
                  Cỡ chữ: {settings.fontSize}px
                </p>
                <div className="flex gap-[10px]">
                  <button
                    onClick={() =>
                      setSettings((p) => ({
                        ...p,
                        fontSize: Math.max(12, p.fontSize - 1),
                      }))
                    }
                    className="flex-1 py-[6px] border border-[#ccc] rounded-[5px]"
                  >
                    A-
                  </button>
                  <button
                    onClick={() =>
                      setSettings((p) => ({
                        ...p,
                        fontSize: Math.min(30, p.fontSize + 1),
                      }))
                    }
                    className="flex-1 py-[6px] border border-[#ccc] rounded-[5px]"
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            className={`bg-none border-none text-[22px] cursor-pointer ${
              isAudioMode ? "text-[#007bff]" : "text-[#333]"
            }`}
            onClick={() => {
              if (isAudioMode) handleStopAudio();
              setIsAudioMode(!isAudioMode);
            }}
          >
            <IoHeadset />
          </button>

          <button
            onClick={() => setIsChapterListVisible(!isChapterListVisible)}
            className={`bg-none border-none text-[22px] cursor-pointer ${
              isChapterListVisible ? "text-[#007bff]" : "text-[#333]"
            }`}
          >
            <BsList />
          </button>
        </div>
      </header>

      {/* ✅ 2. SỬ DỤNG COMPONENT SIDEBAR THẬT */}
      {/* Chúng ta bọc Sidebar vào thẻ div để định vị trong CSS Grid */}
      <div className="col-start-1 row-span-2 h-full z-[1001] bg-white">
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <main
        className="col-start-2 row-start-2 overflow-y-auto p-[40px] relative transition-colors duration-300"
        style={{
          backgroundColor: themes[settings.theme].bg,
          color: themes[settings.theme].text,
          fontFamily: settings.fontFamily,
        }}
      >
        <div className="text-center mb-[40px]">
          <h3 className="text-[18px] font-medium opacity-70 m-0">
            Chương {chapter.chapter_number}
          </h3>
          <h1 className="text-[28px] font-bold mt-[5px] mb-0">
            {chapter.title}
          </h1>
        </div>
        <div
          className="max-w-[800px] mx-auto leading-[1.8] whitespace-pre-wrap transition-all duration-200"
          style={{ fontSize: `${settings.fontSize}px` }}
        >
          {chapter.content || "Nội dung chương trống."}
        </div>
      </main>

      {/* PAGINATION */}
      <div className="fixed bottom-[20px] left-1/2 -translate-x-1/2 bg-[rgba(0,0,0,0.8)] text-white px-[20px] py-[10px] rounded-[30px] flex items-center gap-[25px] shadow-lg backdrop-blur-sm z-50">
        <button
          onClick={handlePrevChapter}
          disabled={!hasPrev}
          className={`text-[24px] flex items-center ${
            hasPrev ? "cursor-pointer hover:text-blue-400" : "opacity-30"
          }`}
        >
          <IoIosArrowBack />
        </button>
        <span className="font-bold text-[16px]">
          {currentIndex !== -1 ? currentIndex + 1 : "?"} / {chapters.length}
        </span>
        <button
          onClick={handleNextChapter}
          disabled={!hasNext}
          className={`text-[24px] flex items-center ${
            hasNext ? "cursor-pointer hover:text-blue-400" : "opacity-30"
          }`}
        >
          <IoIosArrowForward />
        </button>
      </div>

      {/* AUDIO PLAYER */}
      {isAudioMode && (
        <div className="fixed bottom-[80px] left-1/2 -translate-x-1/2 w-[90%] max-w-[420px] bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 px-6 py-5 rounded-2xl flex flex-col gap-4 z-[1500] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex items-end gap-[2px] h-4 ${
                  isPlaying ? "" : "opacity-50 grayscale"
                }`}
              >
                <span
                  className={`w-1 bg-blue-500 rounded-full ${
                    isPlaying ? "h-full animate-[bounce_1s_infinite]" : "h-2"
                  }`}
                ></span>
                <span
                  className={`w-1 bg-blue-500 rounded-full ${
                    isPlaying ? "h-3/4 animate-[bounce_1.2s_infinite]" : "h-3"
                  }`}
                ></span>
                <span
                  className={`w-1 bg-blue-500 rounded-full ${
                    isPlaying ? "h-full animate-[bounce_0.8s_infinite]" : "h-1"
                  }`}
                ></span>
              </div>
              <span
                className={`font-bold text-sm ${
                  isPlaying ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {isPlaying ? "AI đang đọc truyện..." : "Đã tạm dừng"}
              </span>
            </div>
            <button
              onClick={() => {
                handleStopAudio();
                setIsAudioMode(false);
              }}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <FaTimes />
            </button>
          </div>
          <div className="flex items-center gap-5">
            <button
              className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full shadow-lg transition-all transform active:scale-95 ${
                isPlaying
                  ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/30"
              }`}
              onClick={isPlaying ? handlePauseAudio : handleResumeAudio}
            >
              {isPlaying ? (
                <FaPause size={20} />
              ) : (
                <FaPlay size={20} className="ml-1" />
              )}
            </button>
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span>Tốc độ</span>
                <span>{playbackRate}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.25"
                value={playbackRate}
                onChange={changePlaybackRate}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR CHAPTER LIST */}
      <aside
        className={`fixed top-0 right-0 w-[350px] h-full bg-white shadow-[-2px_0_10px_rgba(0,0,0,0.1)] transition-transform duration-300 z-[1000] flex flex-col ${
          isChapterListVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-[15px_20px] border-b border-[#eee] flex justify-between items-center">
          <h4 className="m-0 text-[18px]">Mục lục</h4>
          <button
            onClick={() => setIsChapterListVisible(false)}
            className="bg-none border-none text-[24px] cursor-pointer"
          >
            ×
          </button>
        </div>
        <ul className="list-none p-0 m-0 overflow-y-auto grow">
          {chapters.length > 0 ? (
            chapters.map((chap) => (
              <li key={chap.id}>
                <Link
                  to={`/truyen/${storyId}/chuong/${chap.id}`}
                  className={`block p-[12px_20px] no-underline border-b border-[#f5f5f5] ${
                    chap.id === currentChapterId
                      ? "text-[#007bff] font-bold"
                      : "text-[#333]"
                  }`}
                >
                  Chương {chap.chapter_number}: {chap.title}
                  {chap.id === markedChapterId && (
                    <BsBookmarkFill className="inline-block ml-2 text-orange-500 text-[12px]" />
                  )}
                </Link>
              </li>
            ))
          ) : (
            <li className="p-[20px] text-center text-gray-500">
              Chưa có danh sách chương
            </li>
          )}
        </ul>
      </aside>
      {isChapterListVisible && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] z-[999]"
          onClick={() => setIsChapterListVisible(false)}
        ></div>
      )}
    </div>
  );
};

export default ReadingPage;
