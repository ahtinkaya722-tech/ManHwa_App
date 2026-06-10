import { Routes, Route } from "react-router-dom";
import Navbar from './assets/components/Navbar'
import Home from './assets/components/Home';
import "../src/App.css";
import MangaInfoBox from "./assets/components/InfoBox/MangaInfoB0x";
import SignIn from "./assets/components/SignIn/SignIn";
import SignUp from "./assets/components/SignIn/SignUp";
import MangaDetailPage from "./assets/components/MangaDetailPage/MangaDetailPage";
import { useState } from "react";
import SavedMangaPage from "./assets/components/NavPages/SavedMangaPage";
import NewLeasePage from "./assets/components/NavPages/NewLeasePage";
import MostReadPage from "./assets/components/NavPages/MostReadPage";
import TrendingPage from "./assets/components/NavPages/TrendingPage";
import MangaReaderPage from "./assets/components/ReadPage/MangaReaderPage";
import ReadManga from "./assets/components/ReadPage/ReadManga";
function App() {
  const [isOpenInfo, setIsOpenInfo] = useState(false);
  const [selectedInfoManga, setSelectedInfoManga] = useState(null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

return (
  <>
    <div className='min-h-screen  text-white overflow-x-hidden'>
      
      <div className="relative w-full">
     
        <Navbar user={user} setUser={setUser} />
        <MangaInfoBox isOpen={isOpenInfo} onClose={()=>setIsOpenInfo(false) } data={selectedInfoManga}/>
           <Routes>
         
               <Route path="/" element={<Home openInfo ={(manga)=>{setIsOpenInfo(true); setSelectedInfoManga(manga)}}/>}/>

              
               <Route path="/signUp" element={<SignUp/>}/>
               <Route path="/signIn" element={<SignIn setUser={setUser} />}/>
               <Route path="/savedmanga" element={<SavedMangaPage />} />
               <Route path="/newReleasePage" element={<NewLeasePage />} />
               <Route path="/mostRead" element={<MostReadPage />} />
               <Route path="/trendingPage" element={<TrendingPage />} />
              <Route path="/manga/:id" element={<MangaDetailPage />} />
              <Route path="/readManga/:chapterId" element={<MangaReaderPage />} />
          
               {/* <Route path="/trending" element={} />
             <Route path="/latest" element={} />
             <Route path="/library" element={} /> */}
           </Routes>

     
      </div>

    </div>

     
</>
         
       )
}

export default App
