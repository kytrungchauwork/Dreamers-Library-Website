import React, { createContext, useState, useEffect, useContext } from 'react';

export const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [libraryStories, setLibraryStories] = useState(() => {
    const saved = localStorage.getItem('my_library');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('my_library', JSON.stringify(libraryStories));
  }, [libraryStories]);

  const addToLibrary = (story) => {
    if (!libraryStories.find(item => item.id === story.id)) 
      setLibraryStories([...libraryStories, story]);   
  };

  const removeFromLibrary = (storyId) => {
    setLibraryStories(libraryStories.filter(item => item.id !== storyId));
  };

  const isInLibrary = (storyId) => {
    return libraryStories.some(item => item.id === storyId);
  };

  return (
    <LibraryContext.Provider value={{ libraryStories, addToLibrary, removeFromLibrary, isInLibrary }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  return useContext(LibraryContext);
};