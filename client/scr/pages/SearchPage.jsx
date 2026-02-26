import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import StoryCard from "@/components/StoryCard";
import { getAllStories } from "@/services/storyAPI";
import { removeVietnameseTones } from "@/string/stringHandle";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllStories({ limit: 1000 }); // Lấy hết về lọc

        if (res.data.success) {
          const allStories = res.data.data;
          const normalizedSearch = removeVietnameseTones(query.toLowerCase());

          // Lọc dữ liệu tại Frontend
          const filtered = allStories
            .filter((story) => {
              const normalizedTitle = removeVietnameseTones(
                story.title.toLowerCase()
              );
              const normalizedAuthor = removeVietnameseTones(
                story.author.toLowerCase()
              );

              return (
                normalizedTitle.includes(normalizedSearch) ||
                normalizedAuthor.includes(normalizedSearch)
              );
            })
            .map((s) => ({
              ...s,
              coverImage: s.cover_image,
            }));

          setResults(filtered);
        }
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <div className="max-w-[1200px] mx-auto my-[30px] px-[20px] font-['Quicksand']">
      <h1 className="text-[24px] mb-[30px] text-[#333]">
        Kết quả tìm kiếm cho:{" "}
        <span className="text-[#007bff] italic">"{query}"</span>
      </h1>

      {loading ? (
        <div className="text-center">Đang tìm kiếm...</div>
      ) : results.length === 0 ? (
        <p className="text-[18px] text-[#666] text-center mt-[50px]">
          Không tìm thấy truyện nào phù hợp.
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-[30px]">
          {results.map((story) => (
            <Link
              key={story.id}
              to={`/truyen/${story.id}`}
              className="no-underline text-inherit"
            >
              <StoryCard story={story} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
