import './App.css';
import About from "./Components/About";
import Home from "./Components/Home";
import Navbar from './Components/Navbar';
import Service from "./Components/Service";
import { Route, Routes } from "react-router-dom";


function App() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="service" element={<Service />} />
      </Routes>
    </>
  );
}

export default App;
