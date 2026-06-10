import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import { fetchMangaByGenre } from "../../api/apiFetchManga";

const GENRE_LIST = [
  { id: "391b0423-d847-456f-afd4-8b1e47f4d387", name: "Akcja", labelEn: "Action" },
  { id: "cdc58593-87dd-415e-bbc0-2ec27bf404cc", name: "Fantasy", labelEn: "Fantasy" },
  { id: "423e2eae-a7a2-4a8b-ac03-a8351462d71d", name: "Romans", labelEn: "Romance" },
  { id: "4d32cc48-9f00-4cca-9b5a-a839f0764984", name: "Komedia", labelEn: "Comedy" },
  { id: "b9af3a63-f058-46de-a9a0-e0c13906197a", name: "Dramat", labelEn: "Drama" },
];

const getTitle = (manga) =>
  manga.attributes?.title?.en ||
  Object.values(manga.attributes?.title || {})[0] ||
  "Untitled";

const getCoverImage = (manga) => {
  const cover = manga.relationships?.find((rel) => rel.type === "cover_art");
  const fileName = cover?.attributes?.fileName;

  if (!fileName) {
    return "https://via.placeholder.com/256x360/18181b/FFFFFF?text=No+Cover";
  }

  return `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`;
};

const Genre = () => {
  const navigate = useNavigate();
  const [activeGenre, setActiveGenre] = useState(GENRE_LIST[0]);
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadManga = async () => {
      try {
        setLoading(true);
        setError("");

        const manga = await fetchMangaByGenre(activeGenre.id);
        setMangas(manga);
      } catch (error) {
        console.error("Could not load manga by genre:", error);
        setError("Not Available");
        setMangas([]);
      } finally {
        setLoading(false);
      }
    };

    loadManga();
  }, [activeGenre.id]);

  const handleMangaClick = (manga) => {
    const formattedManga = {
      id: manga.id,
      title: getTitle(manga),
      description: manga.attributes?.description?.en || "No description available.",
      coverImage: getCoverImage(manga).replace('.256.jpg', '.512.jpg'), // Get higher res for detail page
      tags: manga.attributes?.tags?.slice(0, 3).map(tag => tag.attributes.name.en) || [],
      year: manga.attributes?.year,
      status: manga.attributes?.status,
    };

    navigate(`/manga/${manga.id}`, { state: formattedManga });
  };

  return (
    <section className="w-full bg-gradient-to-b from-black/70 via-black/50 to-[#121214] px-2 py-6 text-white">
      <div className="mb-5 flex flex-wrap gap-3">
        {GENRE_LIST.map((genre) => {
          const isSelected = activeGenre.id === genre.id;

          return (
            <button
              key={genre.id}
              onClick={() => setActiveGenre(genre)}
              className={`cursor-pointer rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                isSelected
                  ? "border border-[#FF9F1C] bg-[#FF9F1C] text-black shadow-lg shadow-[#FF9F1C]/10"
                  : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white"
              }`}
              type="button"
            >
              {genre.name}
            </button>
          );
        })}
      </div>

      <div className="mb-4">
        <h2 className="border-l-4 border-[#FF9F1C] pl-2 text-[13px] font-bold uppercase tracking-widest text-zinc-100">
          {activeGenre.name}
        </h2>
        <p className="mt-1 pl-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          {activeGenre.labelEn}
        </p>
      </div>

      {loading && (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF9F1C] border-t-transparent"></div>
        </div>
      )}

      {!loading && error && <p className="text-sm text-red-400">{error}</p>}

      {!loading && !error && mangas.length === 0 && (
        <p className="text-sm text-zinc-400">No manga found.</p>
      )}

      {!loading && !error && mangas.length > 0 && (
        <Swiper
          key={activeGenre.id}
          modules={[Navigation]}
          navigation
          spaceBetween={14}
          slidesPerView={2}
          breakpoints={{
            480: { slidesPerView: 3 },
            640: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 6 },
            1280: { slidesPerView: 7 },
          }}
        >
          {mangas.map((manga) => {
            const title = getTitle(manga);
            const year = manga.attributes?.year || "N/A";

            return (
              <SwiperSlide key={manga.id}>
                <div 
                  className="group flex cursor-pointer flex-col"
                  onClick={() => handleMangaClick(manga)}
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded bg-zinc-900">
                    <img
                      src={getCoverImage(manga)}
                      alt={title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  </div>

                  <div className="mt-2.5 px-0.5">
                    <h3 className="truncate text-xs font-semibold text-zinc-200 transition duration-150 group-hover:text-[#FF9F1C]">
                      {title}
                    </h3>
                    <p className="mt-0.5 text-[10px] font-medium text-zinc-500">
                      Manga - {year}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </section>
  );
};

export default Genre;

