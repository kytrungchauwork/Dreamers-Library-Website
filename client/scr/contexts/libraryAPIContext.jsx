import React, { createContext, useState, useEffect, useContext } from "react";
import { getMyLibrary, removeStoryFromLibrary } from "@/services/libraryAPI";

export const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [libraryStories, setLibraryStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load library từ backend
  const fetchLibrary = async () => {
    try {
      setLoading(true);
      const res = await getMyLibrary();
      if (res.data.success) {
        setLibraryStories(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load library", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const removeFromLibrary = async (storyId) => {
    try {
      await removeStoryFromLibrary(storyId);
      setLibraryStories((prev) =>
        prev.filter((item) => item.id !== storyId)
      );
    } catch (err) {
      console.error("Remove from library failed", err);
    }
  };

  return (
    <LibraryContext.Provider
      value={{
        libraryStories,
        loading,
        removeFromLibrary,
        reloadLibrary: fetchLibrary,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => useContext(LibraryContext);