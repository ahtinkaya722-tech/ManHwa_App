import React from "react";
import "../../../css/mangaInfoPopUpBox.css";

const MangainfoBOx = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const cover = data.relationships?.find(
    (relationship) => relationship.type === "cover_art"
  )?.attributes?.fileName;
  const title =
    data.attributes?.title?.en ||
    Object.values(data.attributes?.title || {})[0] ||
    data.title ||
    "No Title";
  const description =
    data.attributes?.description?.en ||
    data.description ||
    "No description available";
  const coverImage =
    data.coverImage ||
    (cover ? `https://uploads.mangadex.org/covers/${data.id}/${cover}` : null);
  const genres =
    data.tags?.join(", ") ||
    data.attributes?.tags
      ?.slice(0, 3)
      .map((tag) => tag.attributes?.name?.en)
      .filter(Boolean)
      .join(", ") ||
    "N/A";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 bg-black/80 backdrop-blur-md select-none font-sans animate-fadeIn">
      <div className="popup-box w-full max-w-[380px] sm:max-w-lg md:max-w-2xl lg:max-w-3xl px-2">
        <div className="bg-[#1c1c1f] border border-zinc-800 rounded-xl p-4 sm:p-6 shadow-2xl flex flex-col sm:flex-row gap-5 sm:gap-8 relative overflow-hidden">
          {/* Close button - more accessible on mobile */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-zinc-400 hover:text-white hover:bg-[#FF9F1C] transition-all"
            aria-label="Close"
          >
            <span className="text-xl font-bold">×</span>
          </button>

          {/* Left Column: Image & Main Action */}
          <div className="w-full sm:w-48 md:w-56 shrink-0 flex flex-col gap-4">
            <div className="relative w-40 sm:w-full mx-auto aspect-[2/3] bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 shadow-xl group">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs font-bold uppercase tracking-wider text-zinc-500 italic">
                  No Cover Art
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <button className="w-full bg-[#FF9F1C] hover:bg-[#e08b14] text-black text-[10px] sm:text-[11px] font-black uppercase tracking-widest py-3 rounded-lg font-montserrat transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-500/10">
              Read Now
            </button>
          </div>

          {/* Right Column: Info & Description */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="pr-8 sm:pr-0">
              <h1 className="font-montserrat text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white line-clamp-2 leading-tight">
                {title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-[#FF9F1C] uppercase tracking-widest">Manga</span>
                <span className="text-zinc-700">•</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">English</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-[70px_1fr] gap-y-3 text-[11px] sm:text-xs border-y border-zinc-800/50 py-5">
              <span className="text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-2">
                Genre
              </span>
              <span className="text-zinc-200 font-semibold line-clamp-1">{genres}</span>

              <span className="text-zinc-500 font-bold uppercase tracking-widest">
                Artist
              </span>
              <span className="text-zinc-300">Unknown</span>

              <span className="text-zinc-500 font-bold uppercase tracking-widest">
                Ratings
              </span>
              <div className="flex items-center gap-2">
                <div className="flex text-[#FF9F1C]">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-[10px]">★</span>
                  ))}
                </div>
                <span className="text-zinc-500 font-mono text-[10px] font-bold">(4.8)</span>
              </div>
            </div>

            <div className="mt-5 flex-1 overflow-y-auto max-h-[120px] sm:max-h-none scrollbar-hide">
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-medium font-montserrat">
                {description}
              </p>
            </div>
            
            <div className="mt-6 flex gap-3">
               <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-md transition-colors border border-zinc-700">
                  More Details
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangainfoBOx;
