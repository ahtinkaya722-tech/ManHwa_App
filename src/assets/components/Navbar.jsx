import "../../css/navbar.css";

const Navbar = () => {
  return (
   <nav className='absolute left-0 top-0 z-50 grid w-full grid-cols-1 items-center gap-4 bg-gradient-to-b from-black/80 to-transparent px-5 py-4 md:grid-cols-[auto_1fr_auto] md:px-12'>
    <div className='min-w-0 justify-self-center md:justify-self-start'>
        {/* logo and text */}
        <div className="flex items-center gap-2">
            <div className="flex flex-col italic">
                <span className="font-racing text-4xl leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-[#FF9F1C] to-yellow-300 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    ANIME
                </span>
                <span className='font-montserrat text-[10px] font-black tracking-[0.2em] text-white/90 sm:text-[11px] -mt-1 ml-0.5 flex items-center non-italic'>
                    MANGA<span className="text-[#FF9F1C] mx-1">/</span>WORLD
                </span>
            </div>
        </div>
    </div>

    <div className="navbuttons w-full justify-self-center md:max-w-3xl">
      <div className="navbuttonsList flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center">
        <a href="#" className="nav-link">Most Read</a>
        <a href="#" className="nav-link">Trending This Week</a>
        <a href="#" className="nav-link">New Releases</a>
        <a href="#" className="nav-link">Save Manga</a>
      </div>
    </div>

    <div className="w-full justify-self-center sm:w-auto md:justify-self-end">
        <input type="text" placeholder='Search Manga By Name...' className=' w-full
      sm:w-64
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


    </div>
    
   </nav>
   
  )
}

export default Navbar
