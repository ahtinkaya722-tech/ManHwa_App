import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const PopularSlider = () => {
  const [mangaData, setMangaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const getPopularManga = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          "https://api.mangadex.org/manga?limit=15&includes[]=cover_art&order[followedCount]=desc"
        );

        if (!res.ok) {
          throw new Error(`MangaDex request failed: ${res.status}`);
        }

        const json = await res.json();
        setMangaData(json.data || []);
      } catch (error) {
        console.error("Could not fetch popular manga list:", error);
        setError("Could not load popular manga.");
      } finally {
        setLoading(false);
      }
    };

    getPopularManga();
  }, []);

  if (loading) {
    return (
      <div className="relative w-full flex h-64 items-center justify-center bg-[#121214]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF9F1C] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <section className="relative w-full  select-none bg-[#121214] py-6 text-white">
      <div className="mb-4 flex items-center justify-between px-2">
        <h2 className="border-l-4 border-[#FF9F1C] pl-2 text-[13px] font-bold uppercase tracking-widest text-zinc-100">
          Najpopularniejsze (Popular)
        </h2>

        <div className="flex gap-1.5">
          <button
            ref={prevRef}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded bg-zinc-800 text-sm text-zinc-400 transition hover:bg-zinc-700 hover:text-white"
            type="button"
          >
            &#10094;
          </button>
          <button
            ref={nextRef}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded bg-[#FF9F1C] text-sm font-bold text-black transition hover:bg-[#e08b14]"
            type="button"
          >
            &#10095;
          </button>
        </div>
      </div>

      {error && <p className="px-2 text-sm text-red-400">{error}</p>}

      {!error && mangaData.length === 0 && (
        <p className="px-2 text-sm text-zinc-400">No popular manga found.</p>
      )}

      {!error && mangaData.length > 0 && (
        <Swiper
          modules={[Navigation]}
          spaceBetween={14}
          slidesPerView={2}
          navigation
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          breakpoints={{
            480: { slidesPerView: 3 },
            640: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 6 },
            1280: { slidesPerView: 7 },
          }}
          className="px-2"
        >
          {mangaData.map((manga) => {
            const title =
              manga.attributes?.title?.en ||
              Object.values(manga.attributes?.title || {})[0] ||
              "Untitled";
            const coverRelation = manga.relationships?.find(
              (rel) => rel.type === "cover_art"
            );
            const file = coverRelation?.attributes?.fileName;
            const coverUrl = file
              ? `https://uploads.mangadex.org/covers/${manga.id}/${file}.256.jpg`
              : "https://via.placeholder.com/256x360/121214/FFFFFF?text=No+Cover";
            const year = manga.attributes?.year || "N/A";

            return (
              <SwiperSlide key={manga.id}>
                <div className="group flex cursor-pointer flex-col">
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded border border-transparent bg-zinc-900 transition duration-200 group-hover:border-[#FF9F1C]/50">
                    <img
                      src={coverUrl}
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

export default PopularSlider;
