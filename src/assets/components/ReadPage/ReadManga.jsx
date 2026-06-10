import React, { useEffect, useState } from 'react'
import {useParams} from "react-router-dom";
import axios from 'axios';
const ReadManga = () => {
    const [loading,setLoading]=useState(true);
    const {chapterId}= useParams();
    const [currentPage,setCurrentPage]=useState(0);
    const [pages,setPages]=useState([]);
    const [error,setError]=useState("");
    useEffect(()=>{
        const fetchChapter  = async () => {
            try{

            const res = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`
             );
             const baseUrl= res.data.baseUrl;
             const hash = res.data.chapter?.hash;
             const data = res.data.chapter?.data|| [];

             if(!baseUrl || !hash || data.length===0){
                setPages([]);
                  setError("This chapter has no readable pages available.");
           return;
             }  
                 const imagePages = data.map(
          (file) => `${baseUrl}/data/${hash}/${file}`
        );

        setPages(imagePages);
        setCurrentPage(0);
            }catch(err){
               console.error(err);
        setPages([]);
        setError("Chapter not found or unavailable. Please try another chapter.");
            }finally{
                  setLoading(false);
            }

        }
        fetchChapter();
    },[chapterId]);

    if(loading){
         return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4 text-center text-white">
        Loading chapter...
      </div>
    );
    }
    if(error|| pages.length ===0 ){
        return(
             <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-center text-white">
        <h1 className="text-xl font-bold">Unable to open chapter</h1>
        <p className="mt-3 max-w-md text-sm text-zinc-400">{error}</p>
      </div>
        );
    }

  return (
    <div className='bg-black min-h-screen w-full flex items-center justify-center'>
        <div className="bg-black text-white">
            <span>Pages {currentPage+1}/{pages.length}</span>
            <img src={pages[currentPage]} alt="" />
             <button
          onClick={() => setCurrentPage((page)=>Math.max(page-1,0))}
          disabled={currentPage === 0}
          className="min-h-11 flex-1 rounded bg-gray-800 px-4 py-2 font-bold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:min-w-32"
        >
          Prev
        </button>

        <button
           onClick={() => setCurrentPage((page)=>Math.min(page+1,pages.length))}
          disabled={currentPage === pages.length - 1}
          className="min-h-11 flex-1 rounded bg-orange-500 px-4 py-2 font-bold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:min-w-32"
        >
          Next
        </button>
        </div>
    </div>
  )
}

export default ReadManga
