import React from 'react'
import Home from './pages/Home'

import Auth from "./pages/Auth";
import Clubs from "./pages/Club";
import Event from "./pages/Event";
import Resources from "./pages/Resources";
import Groups from "./pages/Groups";
import { Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/events" element={<Event />} />
        <Route path="/resources" element={<Resources />} />
         <Route path="/groups" element={<Groups />} />
    </Routes>  

  )
}

export default App
