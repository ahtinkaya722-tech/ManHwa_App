import { Routes, Route } from "react-router-dom";
import Home from "./assets/components/Home";
import MangaInfoBox from "./assets/components/InfoBox/MangaInfoB0x";
import SignIn from "./assets/components/SignIn/SignIn";
import SignUp from "./assets/components/SignIn/SignUp";

import MainLayout from "./assets/components/layout/MainLayout";
import AuthLayout from "./assets/components/layout/AuthLayout";

import { useState } from "react";

function App() {
  const [isOpenInfo, setIsOpenInfo] = useState(false);
  const [selectedInfoManga, setSelectedInfoManga] = useState(null);

  return (
    <>
      <MangaInfoBox
        isOpen={isOpenInfo}
        onClose={() => setIsOpenInfo(false)}
        data={selectedInfoManga}
      />

      <Routes>

        {/* 🟢 MAIN APP (WITH NAVBAR) */}
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <Home
                openInfo={(manga) => {
                  setIsOpenInfo(true);
                  setSelectedInfoManga(manga);
                }}
              />
            }
          />
        </Route>

        {/* 🔵 AUTH PAGES (NO NAVBAR) */}
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

      </Routes>
    </>
  );
}

export default App;