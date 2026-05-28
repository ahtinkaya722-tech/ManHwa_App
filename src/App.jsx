import { Routes, Route } from "react-router-dom";
import Navbar from './assets/components/Navbar'
import Home from './assets/components/Home';
import "../src/App.css";

function App() {


return (
    <div className='min-h-screen  text-white overflow-x-hidden'>
      
      <div className="relative w-full">
        <Navbar />
        <Routes>
       
            <Route path="/" element={<Home/>}/>
            <Route path="*" element={<Home/>}/>
               {/* <Route path="/trending" element={} />
             <Route path="/latest" element={} />
             <Route path="/library" element={} /> */}
        </Routes>

     
      </div>

    </div>
       )
}

export default App
