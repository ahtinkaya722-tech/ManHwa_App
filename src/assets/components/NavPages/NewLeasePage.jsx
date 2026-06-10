import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewLeasePage = () => {
  const navigate = useNavigate();
  const [mangaList, setMangaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchNewReleases = async () => {
      try {
        setLoading(true);
        // Fetch 30 of the absolute newest manga series from MangaDex
        const response = await axios.get(
         `https://api.mangadex.org/manga?limit=30&order[createdAt]=desc&year=2025&year=2026&includes[]=cover_art`
        );
        
        const rawManga = response.data?.data || [];
        
        // Transform API layout into simple variables for your components
        const formattedManga = rawManga.map((manga) => {
          // Extract English title safely (fallback to first available local alternative)
          const title =
            manga.attributes?.title?.en ||
            Object.values(manga.attributes?.title || {})[0] ||
            'Unknown Title';

          // Extract the cover filename from relationships array
          const coverRel = manga.relationships?.find((rel) => rel.type === 'cover_art');
          const fileName = coverRel?.attributes?.fileName;

          // Build MangaDex CDN cover source string
          const coverImage = fileName
            ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`
            : 'https://via.placeholder.com/256x360?text=No+Cover';

          return {
            id: manga.id,
            title: title,
            coverImage: coverImage,
            status: manga.attributes?.status || 'ongoing',
            year: manga.attributes?.year || 'N/A',
          };
        });

        setMangaList(formattedManga);
      } catch (error) {
        console.error('Error fetching new releases from MangaDex:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-400 font-medium">Fetching New Releases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white px-6 pt-32 pb-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex items-center gap-4 mb-2">
            <div className="h-8 w-1.5 bg-[#FF9F1C] rounded-full"></div>
            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-[#FF9F1C] to-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
              New Releases
            </h1>
        </div>
        <p className="text-neutral-400 text-sm md:text-base font-medium">
          Explore the freshest stories just dropped on MangaDex.
        </p>
      </div>

      {/* Grid Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {mangaList.length > 0 ? (
          mangaList.map((manga) => (
            <div
              key={manga.id}
              onClick={() => navigate(`/manga/${manga.id}`, { state: manga })}
              className="group bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700/50 hover:border-amber-500/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              {/* Image Aspect Wrapper */}
              <div className="relative aspect-[2/3] w-full bg-neutral-950 overflow-hidden">
                <img
                  src={manga.coverImage}
                  alt={manga.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Year Badge */}
                <span className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded">
                  {manga.year}
                </span>
              </div>

              {/* Text Information Pad */}
              <div className="p-3 flex flex-col justify-between flex-grow">
                <h3 className="text-sm font-bold line-clamp-2 text-neutral-100 group-hover:text-amber-400 transition-colors duration-200">
                  {manga.title}
                </h3>
                
                <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400 uppercase font-semibold">
                  <span className={`px-1.5 py-0.5 rounded ${
                    manga.status === 'completed' ? 'bg-emerald-950 text-emerald-400' : 'bg-blue-950 text-blue-400'
                  }`}>
                    {manga.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-neutral-500">
            No recently released titles found. Check back later!
          </div>
        )}
      </div>
    </div>
  );
};

export default NewLeasePage;