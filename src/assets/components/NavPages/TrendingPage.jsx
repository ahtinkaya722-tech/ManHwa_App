import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaFire, FaBookmark, FaEye } from 'react-icons/fa';
import axios from 'axios';

const TrendingPage = () => {
  const navigate = useNavigate();
  const [trendingManga, setTrendingManga] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchTrendingData = async () => {
      try {
        setLoading(true);
        // order[followedCount]=desc with limit 20 to get trending/popular
        const response = await axios.get('https://api.mangadex.org/manga', {
          params: {
            limit: 24,
            'includes[]': ['cover_art', 'author'],
            'order[followedCount]': 'desc' 
          }
        });
        
        const rawData = response.data?.data || [];
        const formattedData = rawData.map(manga => {
            const title = manga.attributes?.title?.en || Object.values(manga.attributes?.title || {})[0] || 'Unknown Title';
            const coverRel = manga.relationships?.find(rel => rel.type === 'cover_art');
            const authorRel = manga.relationships?.find(rel => rel.type === 'author');
            const fileName = coverRel?.attributes?.fileName;
            
            return {
                id: manga.id,
                title,
                author: authorRel?.attributes?.name || 'Unknown Author',
                status: manga.attributes?.status || 'ongoing',
                coverImage: fileName 
                    ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`
                    : 'https://via.placeholder.com/256x360?text=No+Cover',
                rating: (Math.random() * (9.8 - 8.5) + 8.5).toFixed(1) // Placeholder rating as MD API rating is separate
            };
        });

        setTrendingManga(formattedData);
      } catch (error) {
        console.error("Error fetching trending manga:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingData();
  }, []);

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#121214] flex flex-col items-center justify-center text-white p-4">
        <FaBookmark className="text-zinc-600 text-5xl mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold mb-2 uppercase tracking-wide font-montserrat">Access Denied</h2>
        <p className="text-zinc-500 text-sm mb-6 max-w-xs text-center leading-relaxed">
          Please sign in to view this week's trending titles and your personal library.
        </p>
        <button
          onClick={() => navigate('/signIn')}
          className="bg-[#FF9F1C] text-black px-6 py-2.5 rounded font-bold hover:bg-[#e08b14] transition uppercase tracking-wider text-xs"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-[#FF9F1C] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-neutral-400 font-medium animate-pulse uppercase tracking-widest text-xs">Analyzing Trends...</p>
      </div>
    );
  }

  const spotlightManga = trendingManga.slice(0, 3);
  const regularTrending = trendingManga.slice(3);

  return (
    <div className="min-h-screen bg-neutral-900 text-white px-6 pt-32 pb-12">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex items-center gap-4 mb-2">
            <div className="h-8 w-1.5 bg-[#FF9F1C] rounded-full"></div>
            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-[#FF9F1C] to-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
              Trending Now
            </h1>
        </div>
        <p className="text-neutral-400 text-sm md:text-base font-medium max-w-2xl">
          The highest velocity series this week. See what the community is binge-reading right now.
        </p>
      </div>

      {/* Spotlight Section (Top 3) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {spotlightManga.map((manga, index) => (
          <div 
            key={manga.id}
            onClick={() => navigate(`/manga/${manga.id}`, { state: manga })}
            className="relative overflow-hidden rounded-2xl bg-neutral-800/50 border border-neutral-700/50 hover:border-[#FF9F1C]/50 transition-all duration-300 p-5 flex gap-5 cursor-pointer group shadow-xl"
          >
            {/* Rank Indicator */}
            <span className={`absolute -bottom-2 -right-2 text-7xl font-black italic select-none opacity-10 group-hover:opacity-20 transition-opacity duration-300 ${
              index === 0 ? 'text-[#FF9F1C]' : 'text-neutral-400'
            }`}>
              #{index + 1}
            </span>

            {/* Poster Asset */}
            <div className="w-28 h-40 flex-shrink-0 overflow-hidden rounded-xl shadow-2xl aspect-[2/3] border border-white/5">
              <img 
                src={manga.coverImage} 
                alt={manga.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            {/* Content Meta */}
            <div className="flex flex-col justify-between py-1 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#FF9F1C] text-black text-[9px] font-black px-2 py-0.5 rounded uppercase">TOP {index + 1}</span>
                    <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest flex items-center gap-1">
                        <FaEye className="text-[9px]" /> 12.5k
                    </span>
                </div>
                <h3 className="font-bold text-base md:text-lg line-clamp-2 group-hover:text-[#FF9F1C] transition-colors leading-tight">
                  {manga.title}
                </h3>
                <p className="text-xs text-neutral-400 font-semibold mt-2 truncate">
                  by {manga.author}
                </p>
              </div>
              
              <div className="flex items-center gap-3 mt-4">
                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/5 px-3 py-1 rounded-full text-xs font-bold text-[#FF9F1C]">
                  <FaStar className="text-[10px]" /> {manga.rating}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${manga.status === 'ongoing' ? 'text-green-500' : 'text-blue-500'}`}>
                    {manga.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent my-12" />

      {/* Regular Feed Grid */}
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
          <h2 className="text-xl font-black italic uppercase tracking-tighter text-neutral-300 flex items-center gap-3">
            <FaFire className="text-[#FF9F1C]" /> High Velocity Updates
          </h2>
          <span className="text-[10px] bg-[#FF9F1C]/10 text-[#FF9F1C] border border-[#FF9F1C]/20 px-3 py-1 rounded-full font-black uppercase tracking-widest">
            Weekly Refresh
          </span>
      </div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {regularTrending.map((manga) => (
          <div 
            key={manga.id}
            onClick={() => navigate(`/manga/${manga.id}`, { state: manga })}
            className="flex flex-col cursor-pointer group"
          >
            {/* Image Thumbnail */}
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-neutral-950 border border-neutral-800/50 group-hover:border-[#FF9F1C]/50 transition-all duration-300 shadow-lg group-hover:-translate-y-2">
              <img 
                src={manga.coverImage} 
                alt={manga.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Score Badge */}
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-[10px] font-black text-white px-2 py-1 rounded flex items-center gap-1 shadow-xl border border-white/10">
                <FaStar className="text-[#FF9F1C] text-[9px]" />
                <span>{manga.rating}</span>
              </div>

              {/* Hover Details Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-[9px] font-black text-[#FF9F1C] uppercase tracking-[0.2em] mb-1">View Series</span>
                  <div className="h-0.5 w-8 bg-[#FF9F1C] rounded-full" />
              </div>
            </div>

            {/* Meta details */}
            <div className="mt-4">
              <h4 className="font-bold text-sm line-clamp-2 text-neutral-200 group-hover:text-[#FF9F1C] transition-colors duration-200 leading-snug">
                {manga.title}
              </h4>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-neutral-500 font-semibold truncate max-w-[60%]">{manga.author}</span>
                <span className={`text-[9px] font-black uppercase tracking-widest ${manga.status === 'ongoing' ? 'text-green-500/80' : 'text-blue-500/80'}`}>
                    {manga.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TrendingPage;