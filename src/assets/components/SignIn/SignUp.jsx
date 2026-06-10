import React, { useState } from 'react';
import "../../../css/SingIn.css";
import luffyImg from "../../../img/luffy_Image.jpg";
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      alert(response.data.message);
      navigate("/signIn");
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.response?.data || "An error occurred during signup");
    }
  };

  return (
    <div className="min-h-screen bg-[#121214] flex items-center justify-center p-4 font-sans">

      {/* Main Card */}
      <div className="Upper-container-luffy animate-fadeInUp relative w-full max-w-5xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row bg-gradient-to-br from-[#1c1c1f] to-[#000000] min-h-[600px] border border-white/10">

        {/* Background Layer */}
        <div className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none mix-blend-overlay" />

        {/* LEFT SIDE */}
        <div className="animate-slideInLeft flex-1 p-8 md:p-12 flex flex-col justify-between relative z-10 text-white/90">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="font-black text-[#FF9F1C] text-xs uppercase tracking-widest">
              ANIME<br />MANGA WORLD
            </div>

               <div className="flex items-center gap-6 font-bold text-xs tracking-widest text-white/80">
              <a href="#home" className="hover:text-[#FF9F1C] transition">HOME</a>
              <Link to="/signIn"  className="bg-[#FF9F1C] text-black px-5 py-2 rounded-md shadow-sm hover:bg-[#FF9F1C]/80 transition">Sign In</Link>
            </div>
         
          </div>

          {/* Form */}
          <div className="my-auto max-w-md w-full mx-auto md:mx-0">

            <h1 className="text-4xl font-black text-[#FF9F1C] uppercase border-b-4 border-[#FF9F1C] pb-2 inline-block">
              SIGN UP
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">

              {/* Name */}
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-white/5 p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#FF9F1C]"
              />

              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-white/5 p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#FF9F1C]"
              />

              {/* Password */}
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-white/5 p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#FF9F1C]"
              />

              {/* Confirm Password */}
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-white/5 p-3 rounded-xl text-white outline-none border border-white/10 focus:border-[#FF9F1C]"
              />

              {/* Show Password */}
              <div className="flex items-center gap-2 text-xs text-white/70">
                <input
                  type="checkbox"
                  onChange={() => setShowPassword(!showPassword)}
                />
                Show Password
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-[#FF9F1C] text-black font-black py-3 rounded-xl uppercase hover:bg-[#e58f19] transition"
              >
                Create Account
              </button>

            </form>
          </div>

        </div>

        {/* RIGHT SIDE: Character Space */}
              <div className="animate-slideInRight hidden md:flex md:w-[45%] relative overflow-hidden">
                {/* Background Image with Cover fit */}
                <img 
                  src={luffyImg} 
                  alt="Naruto Character Art" 
                  className="absolute inset-0 w-full h-full object-contain object-cover object-[60%_40%]"
                />
                
                {/* Gradient Overlay for blending */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FF9F1C]/20 to-transparent" />
                
                {/* Optional: Branding or Text on image */}
                <div className="relative z-10 mt-auto p-12">
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10">
  <p className="text-[#FF9F1C] font-black text-xl italic leading-none">
    KING OF THE PIRATES!
  </p>

  <p className="text-white/60 text-[10px] font-bold tracking-[0.3em] uppercase mt-1">
    Luffy
  </p>


</div>
                </div>
              </div>

      </div>
    </div>
  );
};

export default SignUp;