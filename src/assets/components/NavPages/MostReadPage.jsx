import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaFire } from 'react-icons/fa';
import axios from 'axios';

const MostReadPage = () => {
  const [mangaList, setMangaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchMostReadManga = async () => {
      try {
        setLoading(true);
        // order[followedCount]=desc sorts by the most popular/read manga on MangaDex
        const response = await axios.get('https://api.mangadex.org/manga', {
          params: {
            limit: 30,
            'order[followedCount]': 'desc',
            'includes[]': ['cover_art', 'author']
          }
        });
        setMangaList(response.data.data);
      } catch (error) {
        console.error("Error fetching most read manga:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMostReadManga();
  }, []);

  // Helper function to extract cover image filenames safely
  const getCoverImageUrl = (mangaItem) => {
    const coverRel = mangaItem.relationships.find((rel) => rel.type === 'cover_art');
    const fileName = coverRel?.attributes?.fileName;
    if (fileName) {
      return `https://uploads.mangadex.org/covers/${mangaItem.id}/${fileName}.256.jpg`;
    }
    return 'https://via.placeholder.com/256x360?text=No+Cover';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-[#FF9F1C] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-neutral-400 font-medium animate-pulse">Loading Most Popular...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white px-6 pt-32 pb-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex items-center gap-4 mb-2">
            <div className="h-8 w-1.5 bg-[#FF9F1C] rounded-full"></div>
            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-[#FF9F1C] to-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
              Most Read
            </h1>
        </div>
        <p className="text-neutral-400 text-sm md:text-base font-medium max-w-2xl">
          Discover the series that are capturing everyone's attention. The most followed and discussed manga on the platform.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {mangaList.map((mangaItem) => {
          const title = mangaItem.attributes.title.en || Object.values(mangaItem.attributes.title)[0] || 'Unknown Title';
          const authorRel = mangaItem.relationships.find((rel) => rel.type === 'author');
          const authorName = authorRel?.attributes?.name || 'Unknown Author';

          return (
            <div
              key={mangaItem.id}
              onClick={() => navigate(`/manga/${mangaItem.id}`, { state: mangaItem })}
              className="group bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700/50 hover:border-[#FF9F1C]/50 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col shadow-lg"
            >
              {/* Cover Container */}
              <div className="relative aspect-[2/3] overflow-hidden bg-neutral-950">
                <img
                  src={getCoverImageUrl(mangaItem)}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Ranking Badge */}
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 text-[#FF9F1C] border border-white/10">
                  <FaFire className="text-[9px]" /> POPULAR
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <span className="text-[10px] font-bold text-[#FF9F1C] uppercase tracking-widest">Read Details →</span>
                </div>
              </div>

              {/* Info Container */}
              <div className="p-3 flex-grow flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-sm line-clamp-2 leading-snug text-neutral-100 group-hover:text-[#FF9F1C] transition-colors duration-200">
                    {title}
                    </h3>
                    <p className="text-[11px] text-neutral-500 mt-1.5 font-semibold truncate">
                    {authorName}
                    </p>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                    mangaItem.attributes.status === 'ongoing' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {mangaItem.attributes.status}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-bold">
                    <FaStar className="text-[#FF9F1C] text-[9px]" />
                    <span>4.8</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MostReadPage;