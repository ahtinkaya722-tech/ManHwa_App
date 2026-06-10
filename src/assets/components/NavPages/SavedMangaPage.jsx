import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookmark, FaStar, FaTrash, FaBookOpen, FaFolderOpen } from 'react-icons/fa';
import axios from 'axios';

const SavedMangaPage = () => {
    const navigate = useNavigate();
    const [library, setLibrary] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchLibrary = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }
            try {

                const res = await axios.get(`http://localhost:5000/getUserLibrary/${userId}`);
                if (res.data && res.data.MangaInLibrary) {

                    const savedManga = res.data.MangaInLibrary;
                    const savedMangaId = savedManga.map(manga => manga.manga_id);
                    const mangaPromise = savedMangaId.map(async (id) => {
                        const res = await axios.get(`https://api.mangadex.org/manga/${id}?includes[]=cover_art`);

                        const manga = res.data.data;
                        const title = manga.attributes?.title?.en || Object.values(manga.attributes?.title || {})[0] || "Untitled";
                        const coverRelation = manga.relationships?.find((rel)=> rel.type === "cover_art");
                        const fileName = coverRelation?.attributes?.fileName;
                        const coverImage = fileName
                            ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`
                            : "https://via.placeholder.com/512x720";
                        return {
                            id: manga.id,
                            title,
                            coverImage,
                            status: manga.attributes?.status || "ongoing",
                        };


                    });
                    const FinalLibrary= await Promise.all(mangaPromise);
                    setLibrary(FinalLibrary);


                }

            } catch (error) {
                console.error("Error fetching library data:", error);
                setLibrary([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLibrary();
    }, [userId]);


    const removeMangaFromLibrary = async (e, mangaId) => {
        e.stopPropagation(); 
        try{
            const response = await axios.delete(`http://localhost:5000/deleteManga/${userId}/${mangaId}`)
            if(response.data.success){
                console.log("Manga Removed Successfully");
                  window.location.reload();   
            }else{
                   console.log("Manga Can't Remove");
                  window.location.reload();      
            }
        }catch(err){
            console.error(err);
        }


    };

    if (!userId) {
        return (
            <div className="min-h-screen bg-[#121214] flex flex-col items-center justify-center text-white p-4">
                <FaBookmark className="text-zinc-600 text-5xl mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold mb-2 uppercase tracking-wide font-montserrat">Access Denied</h2>
                <p className="text-zinc-500 text-sm mb-6 max-w-xs text-center leading-relaxed">
                    Please sign in to view your personal manga vault and tracking progress.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-[#FF9F1C] text-black px-6 py-2.5 rounded font-bold hover:bg-[#e08b14] transition uppercase tracking-wider text-xs"
                >
                    Go to Sign In
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#121214] flex items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#FF9F1C] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121214] text-white animate-fadeIn pb-20">
            {/* Header Banner Section */}
            <div className="relative w-full h-[220px] md:h-[300px] flex items-end bg-gradient-to-br from-zinc-900 to-[#121214] border-b border-zinc-800">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent" />
                <div className="container mx-auto px-4 pb-8 z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-1.5 bg-[#FF9F1C] rounded-full"></div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-[#FF9F1C] to-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                                My Library
                            </h1>
                            <p className="text-zinc-500 text-xs md:text-sm font-medium mt-1 font-montserrat tracking-wider uppercase">
                                Tracking {library.length} {library.length === 1 ? 'Manga Title' : 'Manga Titles'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Library Grid Area */}
            <div className="container mx-auto px-4 py-12">
                {library.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-20 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-2xl p-8 max-w-xl mx-auto">
                        <FaFolderOpen className="text-zinc-700 text-6xl mb-4" />
                        <h3 className="text-xl font-bold mb-2">Your shelf is completely empty</h3>
                        <p className="text-zinc-500 text-sm mb-6 max-w-sm leading-relaxed font-montserrat">
                            Explore the homepage collection and click "Add to Library" on your favorite releases to compile your reading logs here.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 font-bold px-6 py-3 rounded transition-all tracking-wider text-xs uppercase"
                        >
                            <FaBookOpen /> Browse Manga
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                        {library.map((manga, index) => (
                            <div
                                key={manga.id}
                                onClick={() => navigate(`/manga/${manga.id}`, { state: manga })}
                                className="group relative flex flex-col cursor-pointer transition-all animate-slideUp"
                                style={{ animationDelay: `${index * 40}ms` }}
                            >
                                {/* Media Artwork Box */}
                                <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden border border-zinc-800 shadow-lg group-hover:border-[#FF9F1C]/40 group-hover:shadow-[#FF9F1C]/5 transition-all transform group-hover:-translate-y-2 duration-300">
                                    <img
                                        src={manga.coverImage || "https://via.placeholder.com/512x720"}
                                        alt={manga.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />

                                    {/* Visual Top Gradients & Badge Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 opacity-80 group-hover:opacity-90 transition-opacity" />

                                    {/* Status Tag (Top-Left) */}
                                    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${manga.status === 'ongoing' ? 'bg-green-500 text-black' : 'bg-blue-500 text-white'
                                        }`}>
                                        {manga.status || 'Ongoing'}
                                    </span>

                                    {/* Star Score Layer (Top-Right) */}
                                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold">
                                        <FaStar className="text-[#FF9F1C]" />
                                        <span>4.8</span>
                                    </div>

                                    {/* Absolute Context Control Overlay (Shows on Hover) */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={(e) => removeMangaFromLibrary(e, manga.id)}
                                            className="w-full flex items-center justify-center gap-2 bg-red-600/90 hover:bg-red-600 text-white font-bold py-2 rounded-lg text-[11px] uppercase tracking-wider backdrop-blur-xs transition-colors shadow-lg shadow-red-900/20"
                                            title="Remove from Shelf"
                                        >
                                            <FaTrash className="text-[10px]" /> Drop Series
                                        </button>
                                    </div>
                                </div>

                                {/* Meta Text details block */}
                                <div className="mt-3 flex-1 flex flex-col justify-between">
                                    <h3 className="font-bold text-sm text-zinc-200 group-hover:text-[#FF9F1C] transition-colors line-clamp-2 leading-snug">
                                        {manga.title}
                                    </h3>
                                    {manga.author && (
                                        <span className="text-zinc-500 text-[11px] font-semibold tracking-wide truncate mt-1">
                                            by {manga.author}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Layout Keyframes Animations */}
            <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-slideUp {
          opacity: 0;
          animation: slideUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
        </div>
    );
};


export default SavedMangaPage
