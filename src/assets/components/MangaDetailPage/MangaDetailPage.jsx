import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaPlay, FaPlus, FaStar, FaCalendarAlt, FaUser, FaPalette } from 'react-icons/fa';
import axios from 'axios';
const MangaDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const stateManga = location.state || null;
  const [manga, setManga] = useState(stateManga);
  const [loading, setLoading] = useState(!location.state);
  const [fetchingEpisodes, setFetchingEpisodes] = useState(false);
  const [inLibrary, setInLibrary] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const usrId = user?.id;

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMangaDetails = async () => {
      try {
        setLoading(true);
        // If we don't have manga in state, fetch the main data
        let currentManga = stateManga;
        if (!currentManga) {
          const res = await fetch(`https://api.mangadex.org/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`);
          const data = await res.json();
          const mangaData = data.data;

          const title = mangaData.attributes.title.en || Object.values(mangaData.attributes.title)[0];
          const coverRel = mangaData.relationships.find(rel => rel.type === 'cover_art');
          const coverFile = coverRel?.attributes?.fileName;
          const authorRel = mangaData.relationships.find(rel => rel.type === 'author');
          const artistRel = mangaData.relationships.find(rel => rel.type === 'artist');

          currentManga = {
            id: mangaData.id,
            title: title,
            description: mangaData.attributes.description.en || "No description available.",
            coverImage: coverFile ? `https://uploads.mangadex.org/covers/${mangaData.id}/${coverFile}.512.jpg` : "https://via.placeholder.com/512x720",
            tags: mangaData.attributes.tags.slice(0, 5).map(tag => tag.attributes.name.en),
            year: mangaData.attributes.year || "N/A",
            status: mangaData.attributes.status,
            author: authorRel?.attributes?.name || "Unknown",
            artist: artistRel?.attributes?.name || "Unknown",
          };
          setManga(currentManga);
        }

        if (usrId && currentManga?.id) {
          const Res = await axios.get(`http://localhost:5000/checkLibrary/${usrId}/${currentManga.id}`);

          if (Res.data.inLibrary) {
            setInLibrary(true);
          }
        }

        // Fetch episodes if they are missing
        if (!currentManga.episodes) {
          setFetchingEpisodes(true);
          const chapterRes = await fetch(`https://api.mangadex.org/chapter?manga=${id}&translatedLanguage[]=en&order[chapter]=asc&limit=100`);
          const chapterData = await chapterRes.json();
          const episodes = chapterData.data.map(ch => ({
            id: ch.id,
            chapter: ch.attributes.chapter,
            title: ch.attributes.title || `Chapter ${ch.attributes.chapter}`,
          }));
          
          setManga(prev => ({ ...prev, episodes }));
          setFetchingEpisodes(false);
        }

        // If we have manga but missing author/artist (from state), fetch them
        if (!currentManga.author || currentManga.author === "Unknown") {
            const res = await fetch(`https://api.mangadex.org/manga/${id}?includes[]=author&includes[]=artist`);
            const data = await res.json();
            const authorRel = data.data.relationships.find(rel => rel.type === 'author');
            const artistRel = data.data.relationships.find(rel => rel.type === 'artist');
            setManga(prev => ({
                ...prev,
                author: authorRel?.attributes?.name || "Unknown",
                artist: artistRel?.attributes?.name || "Unknown"
            }));
        }

      } catch (error) {
        console.error("Error fetching manga details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMangaDetails();
  }, [id, stateManga, usrId]);

  if (loading && !manga) {
    return (
      <div className="min-h-screen bg-[#121214] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#FF9F1C] border-t-transparent"></div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="min-h-screen bg-[#121214] flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Manga data not found</h2>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#FF9F1C] text-black px-6 py-2 rounded-md font-bold hover:bg-[#e08b14] transition"
        >
          Return Home
        </button>
      </div>
    );
  }

        // add library
          const addMangaToLibrary = async () => {
            if (!usrId) {
              alert("Please sign in before adding manga to your library.");
              return;
            }



            try {
              

                const res = await axios.post("http://localhost:5000/addLibrary/added", { mangaId: manga.id, userId: usrId });

                if (res.data.status === "success") {
                  setInLibrary(true);
                  console.log("Manga added to library successfully");
                } else {
                  alert("Could not add manga to library. Please try again.");
                }
            } catch (err) {
                console.error(err.response?.data || err.message);
                alert(err.response?.data || "An error occurred while adding manga to library.");
            }
          }

        // end library added

  return (
    <div className="min-h-screen bg-[#121214] text-white animate-fadeIn">
      {/* Hero Section */}
      <div className="relative w-full min-h-[450px] md:h-[600px] flex items-center md:items-end">
        {/* Background Banner with Blur and Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${manga.banner || manga.coverImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#121214]/90 to-[#121214]" />
          <div className="absolute inset-0 backdrop-blur-[3px]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 pt-32 pb-10 md:pb-16 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
          {/* Cover Image */}
          <div className="w-44 md:w-64 aspect-[2/3] rounded-xl shadow-2xl overflow-hidden border-2 border-zinc-800 animate-slideUp shrink-0 shadow-orange-500/10">
            <img 
              src={manga.coverImage} 
              alt={manga.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Basic Info */}
          <div className="flex-1 text-center md:text-left animate-slideUp delay-100">
             <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {manga.tags?.map((tag) => (
                <span 
                  key={tag} 
                  className="bg-[#FF9F1C] text-black px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-[#FF9F1C] to-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-4 leading-tight">
              {manga.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-zinc-300 mb-8 font-montserrat">
              <div className="flex items-center gap-2">
                <FaStar className="text-[#FF9F1C]" />
                <span className="font-bold text-white">4.8</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-[#FF9F1C]" />
                <span>{manga.year || "2024"}</span>
              </div>
              <div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-bold">
                <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">Manga</span>
                <span className={`px-2 py-0.5 rounded ${manga.status === 'ongoing' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>
                    {manga.status || 'Ongoing'}
                </span>
              </div>
            </div>

            <div className="flex w-full flex-col sm:w-auto sm:flex-row flex-wrap justify-center md:justify-start gap-3 sm:gap-4">
                <button
                  onClick={() => manga.episodes?.[0]?.id && navigate(`/readManga/${manga.episodes[0].id}`)}
                  disabled={!manga.episodes?.length}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 bg-[#FF9F1C] hover:bg-[#e08b14] disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed text-black font-bold px-6 sm:px-8 py-3.5 rounded transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,159,28,0.3)] uppercase tracking-wider text-xs"
                >
                  <FaPlay /> Read Now
                </button>
                <button
                  onClick={addMangaToLibrary}
                  disabled={inLibrary}
                  className={`flex w-full sm:w-auto items-center justify-center gap-2 ${inLibrary ? 'bg-zinc-700 cursor-not-allowed' : 'bg-zinc-800/80 hover:bg-zinc-700'} border border-zinc-600 text-white font-bold px-6 sm:px-8 py-3.5 rounded transition-all transform ${inLibrary ? '' : 'hover:scale-105 active:scale-95'} uppercase tracking-wider text-xs`}
                >
                     {inLibrary ? 'Added' : <><FaPlus /> Add to Library</>}
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="container mx-auto px-4 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16">
        {/* Left Column: Description and Info */}
        <div className="lg:col-span-2 space-y-12 animate-slideUp delay-200">
          <div>
            <h2 className="text-2xl font-bold border-l-4 border-[#FF9F1C] pl-4 mb-6 uppercase tracking-wider flex items-center gap-3">
              Synopsis
            </h2>
            <p className="text-zinc-400 leading-relaxed text-lg font-montserrat whitespace-pre-line">
              {manga.description}
            </p>
          </div>

          {/* Episode List */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold border-l-4 border-[#FF9F1C] pl-4 uppercase tracking-wider">
                Chapters
              </h2>
              <div className="flex items-center gap-4">
                 {fetchingEpisodes && <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FF9F1C] border-t-transparent"></div>}
                 <span className="text-zinc-500 text-sm font-bold">
                    {manga.episodes?.length || 0} Chapters available
                 </span>
              </div>
            </div>
            
            <div  className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {manga.episodes?.map((ep, index) => (
                <div 
                onClick={()=>navigate(`/readManga/${ep.id}`)}
                  key={ep.id}
                  className="group bg-zinc-900/40 hover:bg-zinc-800/60 border border-zinc-800 hover:border-[#FF9F1C]/40 p-3 sm:p-4 rounded-xl flex items-center justify-between gap-3 transition-all cursor-pointer transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-lg bg-zinc-800 group-hover:bg-[#FF9F1C] flex flex-col items-center justify-center transition-colors">
                      <span className="text-[10px] text-zinc-500 group-hover:text-black/60 font-bold leading-none mb-1 uppercase">CH</span>
                      <span className="max-w-10 truncate font-black text-base sm:text-lg group-hover:text-black leading-none">{ep.chapter || index + 1}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm group-hover:text-[#FF9F1C] transition-colors line-clamp-1">
                        {ep.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold px-1.5 py-0.5 bg-zinc-800 rounded">EN</span>
                        <span className="text-[10px] text-zinc-600 font-bold uppercase">Mangadex</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-[#FF9F1C]/10 transition-colors">
                    <FaPlay className="text-[10px] text-zinc-600 group-hover:text-[#FF9F1C] transition-all" />
                  </div>
                </div>
              ))}
              
              {!fetchingEpisodes && (!manga.episodes || manga.episodes.length === 0) && (
                  <p className="col-span-full text-center text-zinc-500 py-8 italic">No chapters found for this language.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Info */}
        <div className="space-y-8 animate-slideUp delay-300">
          <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-8 text-white border-b border-zinc-800 pb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#FF9F1C] rounded-full"></div>
                Information
            </h3>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">Status</span>
                <span className="text-[#FF9F1C] font-bold text-sm uppercase">{manga.status || 'Ongoing'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <FaUser className="text-[8px]" /> Author
                </span>
                <span className="text-zinc-200 font-bold text-sm">{manga.author || 'Unknown'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <FaPalette className="text-[8px]" /> Artist
                </span>
                <span className="text-zinc-200 font-bold text-sm">{manga.artist || 'Unknown'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">Released</span>
                <span className="text-zinc-200 font-bold text-sm">{manga.year || '2024'}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 rounded-2xl border border-zinc-800">
             <h3 className="text-xl font-bold mb-4 text-white">Share</h3>
             <p className="text-xs text-zinc-500 mb-6 font-montserrat leading-relaxed">Share this manga with your friends and grow the community!</p>
             <div className="flex gap-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-12 h-12 rounded-xl bg-zinc-800 hover:bg-[#FF9F1C] hover:text-black flex items-center justify-center transition-all cursor-pointer border border-zinc-700 hover:border-transparent transform hover:-translate-y-1">
                    <span className="font-black text-xs">S{i}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-slideUp {
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .delay-100 { animation-delay: 0.15s; }
        .delay-200 { animation-delay: 0.3s; }
        .delay-300 { animation-delay: 0.45s; }
      `}</style>
    </div>
  );
};

export default MangaDetailPage;
