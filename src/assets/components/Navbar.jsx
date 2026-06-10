import "../../css/navbar.css";
import { Link, useLocation } from "react-router-dom";
const Navbar = ({ user, setUser }) => {
 
  const location = useLocation();
  const isReadPage = location.pathname.startsWith("/readManga");
  const hideSearch = location.pathname === "/signIn" || location.pathname === "/signUp" || location.pathname.startsWith("/manga/") || location.pathname.startsWith("/newReleasePage") || location.pathname.startsWith("/savedmanga")|| location.pathname.startsWith("/mostRead")|| location.pathname.startsWith("/trendingPage") || location.pathname.startsWith("/readManga");
  const savedMangaPage = "/savedmanga/";
  const newReleasePage="/newReleasePage";
  const mostReadPage="/mostRead";
  const TrendingPage="/trendingPage";
  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);


  };



  return (
   <div className='absolute left-0 top-0 z-50 grid w-full grid-cols-1 items-center gap-4 bg-gradient-to-b from-black/80 to-transparent px-5 py-4 md:grid-cols-[auto_1fr_auto] md:px-12'>
    <Link to={"/"} className='min-w-0 justify-self-start'>
        {/* logo and text */}
        <div className="md:justify-self-center justify-self-start ">
            <div className="flex flex-col italic">
                <span className="font-racing text-4xl leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-[#FF9F1C] to-yellow-300 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    ANIME
                </span>
                <span className='font-montserrat text-[10px] font-black tracking-[0.2em] text-white/90 sm:text-[11px] -mt-1 ml-0.5 flex items-center non-italic'>
                    MANGA<span className="text-[#FF9F1C] mx-1">/</span>WORLD
                </span>
            </div>
        </div>
    </Link>

{!isReadPage && (   <div className="navbuttons w-full justify-self-center md:max-w-3xl">
      <div className="navbuttonsList flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center">
     
        <Link to={mostReadPage}  className="nav-link">Most Read</Link>
        <Link to={TrendingPage}  className="nav-link">Trending This Week</Link>
        
        <Link to={savedMangaPage}  className="nav-link">Save Manga</Link>
        <Link to={newReleasePage}  className="nav-link">New Releases</Link>
         <div className="">
     

    </div>
      </div>
     
    </div> )}
 

    <div className="flex w-full items-center justify-self-end">
          {/* Search Box */}
      {!hideSearch && (
        <>
        <input type="text" placeholder='Search Manga By Name...' className=' w-full
      sm:w-52
      md:w-72
      lg:w-80
      rounded-md
      border border-gray-700
      bg-black/40
      px-4 py-2
      text-sm
      md:text-base
      text-white
      outline-none
      focus:border-yellow-500
      transition-all text-center'    />

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <img src="https://cdn3.iconfinder.com/data/icons/avatar-165/536/NORMAL_HAIR-512.png" alt="user image"  className="w-5 h-5 md:w-9 md:h-9"/>
                <span className="text-sm md:text-base  text-white/80">Hello, {user.name || user.username || user.email}</span>
                <button type="button" onClick={handleLogout} className=" bg-[#FF9F1C] text-black px-1 py-1  md:px-3 md:py-2  md:rounded-md text-xs md:text-base ">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signIn" className="nav-link">Sign In</Link>
                <Link to="/signUp" className="nav-link">Sign Up</Link>
              </>
            )}
          </div>
        </>
          
      
      )}
       
       
     
        
    
    </div>
    
   </div>
   
  )
}

export default Navbar
