import { useEffect, useRef, useState } from "react";
import "../../css/swiper.css";
const Train = () => {

const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPopularManga = async () => {
      try {
        setLoading(true);
        

      
      } catch (error) {
        console.error("Could not fetch popular manga list:", error);
   
      } finally {
        setLoading(true);
      }
    };

    getPopularManga();
  }, []);


  return (
  <section className='w-full bg-[#121214] text-white  py-6' >
    <div className='flex items-center justify-between px-5'>

 
    <div>
            <h2 className='text-sm font-bold'>Popular Manga</h2>

    </div>
    <div className='flex gap-2'>
    <button className='h-10 w-10 bg-zinc-800'> next</button>
    <button  className='h-10 w-10 bg-orange-500'>prev</button>

    </div>

    </div>
        <div className="mt-6">

        {loading ?( <div className="flex h-64 items-center justify-center bg-[#121214]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF9F1C] border-t-transparent"></div>
      </div>):( <div>
          Manga list goes here
        </div>)}



        </div>

  </section>
  )
}

export default Train
