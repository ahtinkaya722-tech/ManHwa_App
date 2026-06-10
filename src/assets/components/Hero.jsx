import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import soloLevelingBanner from "../../img/solo leveling.png";
import sonoBisqueBanner from "../../img/sono bisque.png";
import gaenoJitsureBanner from "../../img/gaeno jitsure.png";
import slavesBanner from "../../img/slaves.png";
import slimeBanner from "../../img/tensei shitara slime.png";

const defaultSlides = [
  {
    id: "solo-leveling",
    title: "Solo Leveling",
    description:
      "A hunter rises from the weakest rank and steps into a world of impossible gates, monsters, and hidden power.",
    banner: soloLevelingBanner,
    tags: ["Action", "Fantasy", "Adventure"],
  },
  {
    id: "sono-bisque",
    title: "Sono Bisque Doll",
    description:
      "A quiet craftsman and a bright cosplayer discover a shared love for costumes, detail, and creative courage.",
    banner: sonoBisqueBanner,
    tags: ["Romance", "Comedy", "Slice of Life"],
  },
  {
    id: "gaeno-jitsure",
    title: "Jitsuryoku Shijou Shugi",
    description:
      "Students compete in a school where status, strategy, and careful choices decide who rises and who falls.",
    banner: gaenoJitsureBanner,
    tags: ["Drama", "School", "Psychological"],
  },
  {
    id: "slaves",
    title: "Mato Seihei no Slave",
    description:
      "A supernatural battlefield opens the door to strange powers, dangerous enemies, and fierce alliances.",
    banner: slavesBanner,
    tags: ["Action", "Fantasy", "Supernatural"],
  },
  {
    id: "slime",
    title: "Tensei Shitara Slime",
    description:
      "Reborn as a slime, a new hero builds friendships, a nation, and a life in a colorful fantasy world.",
    banner: slimeBanner,
    tags: ["Isekai", "Fantasy", "Adventure"],
  },
];

const Hero = ({ openInfo }) => {

  const navigate = useNavigate();
  const [slides, setSlides] = useState(defaultSlides);

  useEffect(() => {
    const fetchHeroSectionManga = async () => {
      try {
        const res = await fetch(
          "https://api.mangadex.org/manga?limit=5&includes[]=cover_art&order[followedCount]=desc"
        );



        const data = await res.json();

        // get cover relationship
        const formattedSlides = await Promise.all(
          data.data.map(async (manga, index) => {
            const chapterRes = await fetch(
              `https://api.mangadex.org/chapter?manga=${manga.id}&translatedLanguage[]=en&order[chapter]=asc&limit=10`
            );

            const chapterData = await chapterRes.json();
            const episodes = chapterData.data.map((ch) => ({
              id: ch.id,
              chapter: ch.attributes.chapter,
              title: ch.attributes.title || `Chapter ${ch.attributes.chapter}`,
            }));

            const coverRel = manga.relationships.find(
              (rel) => rel.type === "cover_art"
            );

            const coverFile = coverRel?.attributes?.fileName;

            return {
              id: manga.id,
              title:
                manga.attributes.title.en ||
                Object.values(manga.attributes.title)[0],

              description:
                manga.attributes.description.en?.slice(0, 220) ||
                "No description available.",

              coverImage: coverFile
                ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFile}.512.jpg`
                : "https://via.placeholder.com/1200x600",

              banner: defaultSlides[index]?.banner,
              tags: manga.attributes.tags
                .slice(0, 3)
                .map((tag) => tag.attributes.name.en),
              episodes,
            };
          })
        );

        setSlides(formattedSlides);
      } catch (error) {
        console.log(error);
      }

      

    };

fetchHeroSectionManga();
  }, []);

return (

  <div className="relative">
    <Swiper
      modules={[Autoplay, EffectFade, Pagination]}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      effect="fade"
      pagination={{ clickable: true }}
      loop={true}
      className="w-full h-[520px] sm:h-[480px] md:h-[440px] relative"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div
            className="relative flex h-[520px] w-full flex-col justify-end bg-cover bg-center px-5 pb-16 pt-36 sm:h-[480px] sm:px-8 md:h-[440px] md:px-16 md:pb-14 md:pt-28"
            style={{
              backgroundImage: `url(${slide.banner || slide.coverImage})`,
              backgroundPosition: "top center",
              backgroundSize: "cover"
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-[#121214]" />

            {/* Content */}
            <div className="relative z-30 max-w-2xl">
              <h1 className="break-words text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400 drop-shadow-lg md:text-4xl">
                {slide.title}
              </h1>

              {/* Tags */}
              <div className="flex gap-2 mt-4 flex-wrap">
                {slide.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[#FF9F1C] text-black px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="mt-4 max-w-xl text-xs leading-relaxed text-zinc-300 drop-shadow-md md:text-sm">
                {slide.description}
              </p>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button onClick={() => { 
                  const token = localStorage.getItem("token");
                  if(!token){
                    alert("Please sign in to read this manga.");
                    navigate("/signin");
                    return
                  }
                  
                  navigate(`/manga/${slide.id}`, { state: slide }) }} className="bg-[#FF9F1C] hover:bg-[#e08b14] text-black font-bold text-xs px-6 py-2.5 rounded-sm transition tracking-wider uppercase">
                  Read Now
                </button>

                <button onClick={() => openInfo(slide)} className="bg-black/40 hover:bg-black/60 border border-zinc-600 font-bold text-xs px-6 py-2.5 rounded-sm transition tracking-wider uppercase">
                  More Info
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>

  </div>


);
};

export default Hero;
