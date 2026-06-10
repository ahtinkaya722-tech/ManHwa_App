import { useState } from 'react';
import "../../../css/SingIn.css";
import narutoImg from "../../../img/narutio_Image.jpg";
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';
const SignIn = ({ setUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const navigate = useNavigate();
  const handleSignIn = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:5000/signin", formData);
      console.log("Login Response:", response.data);
      alert("Login successful!");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      navigate("/");
    } catch (error) {
        console.error("Login error:", error);
        alert(error.response?.data || "An error occurred during login");
    }

  }
  return (
    <div className=" min-h-screen bg-[#121214] flex items-center justify-center p-4 font-sans">
      {/* Main Card Container */}
      <div className="Upper-container-naruto animate-fadeInUp relative w-full max-w-5xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row bg-gradient-to-br from-[#1c1c1f] to-[#000000] min-h-[600px] border border-white/10">
        
        {/* Background Watermark Layer */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000')] bg-cover bg-center pointer-events-none mix-blend-overlay" />

        {/* LEFT SIDE: Form Content */}
        <div className="animate-slideInLeft flex-1 p-8 md:p-12 flex flex-col justify-between relative z-10 text-white/90">
          
          {/* Header Nav Inside Card */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              {/* Custom CSS Logo */}
             
              <div className="leading-tight font-black tracking-wider text-xs uppercase text-[#FF9F1C]">
                ANIME<br />MANGA WORLD
              </div>
            </div>
            
            <div className="flex items-center gap-6 font-bold text-xs tracking-widest text-white/80">
              <a href="#home" className="hover:text-[#FF9F1C] transition">HOME</a>
              <Link to="/signUp"  className="bg-[#FF9F1C] text-black px-5 py-2 rounded-md shadow-sm hover:bg-[#FF9F1C]/80 transition">Sign Up</Link>
            </div>
          </div>

          {/* Form Content Area */}
          <div className="my-auto max-w-md w-full mx-auto md:mx-0">
            <span className="text-xs font-black tracking-widest opacity-80 block mb-1 text-[#FF9F1C]">
              START FOR FREE
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-wide text-[#FF9F1C] mb-2 uppercase border-b-4 border-[#FF9F1C] pb-2 inline-block">
              SIGN IN
            </h1>
            
            <p className="text-xs font-bold mt-4 mb-6 text-white/60">
              Don't have an Account?{' '}
              <Link to="/signUp" className="text-[#FF9F1C] hover:underline transition ml-1">
                Create Account
              </Link>
            </p>

            {/* Input Fields */}
            <form onSubmit={ handleSignIn} className="space-y-4">
              
              {/* Email / Username Field */}
              <div className="relative bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10 focus-within:border-[#FF9F1C]/50 transition">
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#FF9F1C]">
                  Email or Username
                </label>
                <input
                  type="text"
                  name="emailOrUsername"
                  value={formData.emailOrUsername}
                  onChange={handleInputChange}
                  className="w-full bg-transparent text-sm font-bold text-white outline-none mt-1 pr-8"
                />
                {/* Standard Mail Envelope Character */}
                <span className="absolute right-4 bottom-2 text-base opacity-60 font-sans text-white">✉</span>
              </div>

              {/* Password Field */}
              <div className="relative bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10 focus-within:border-[#FF9F1C]/50 transition">
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#FF9F1C]">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-transparent text-sm font-bold text-white outline-none mt-1 pr-8 tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 bottom-2.5 text-xs font-bold text-[#FF9F1C] hover:opacity-90 transition"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-6 bg-[#FF9F1C] hover:bg-[#e58f19] text-black text-xs font-black tracking-widest px-8 py-3 rounded-xl uppercase transition shadow-lg hover:shadow-xl transform active:scale-95"
              >
                Login
              </button>
            </form>
          </div>


   
        </div>

        {/* RIGHT SIDE: Character Space */}
        <div className="animate-slideInRight hidden md:flex md:w-[45%] relative overflow-hidden">
          {/* Background Image with Cover fit */}
          <img 
            src={narutoImg} 
            alt="Naruto Character Art" 
            className="absolute inset-0 w-full h-full object-contain object-cover object-[80%_40%]"
          />
          
          {/* Gradient Overlay for blending */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-transparent to-transparent opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FF9F1C]/20 to-transparent" />
          
          {/* Optional: Branding or Text on image */}
          <div className="relative z-10 mt-auto p-12">
            <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <p className="text-[#FF9F1C] font-black text-xl italic leading-none">DATTEBAYO!</p>
              <p className="text-white/60 text-[10px] font-bold tracking-[0.3em] uppercase mt-1">Join the Shinobi World</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignIn;