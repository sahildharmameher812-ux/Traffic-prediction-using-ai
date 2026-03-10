import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import BestRoute from './pages/BestRoute'
import Weather from './pages/Weather'
import Chatbot from './pages/Chatbot'
import AboutUs from './pages/AboutUs'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/route"      element={<BestRoute />} />
            <Route path="/weather"    element={<Weather />} />
            <Route path="/chatbot"    element={<Chatbot />} />
            <Route path="/about"      element={<AboutUs />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}