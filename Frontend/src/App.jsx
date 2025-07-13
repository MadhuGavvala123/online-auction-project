import './index.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Sign_up from './components/Sign_up.jsx';
import Sign_in from './components/Sign_in.jsx';
import Home from './components/Home.jsx';
import Landing from './components/Landing.jsx';
import Aboutus from './components/Aboutus.jsx';
import Sell from './components/Sell.jsx';
import Buy from './components/Buy.jsx';
import ViewBids from './components/ViewBids.jsx';
import Winner from './components/Winner.jsx';
import Logout from './components/Logout.jsx';
import ApiProvider from './api/ApiProvider.jsx';
import { ProductProvider } from './context/ProductContext.jsx';

function AppContent() {
  const location = useLocation();
  const hideNavbarFooter = ["/", "/signin", "/signup", "/logout"].includes(location.pathname); // ✅ hide on landing page and logout page

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Sign_up />} />
        <Route path="/signin" element={<Sign_in />} />
        <Route path="/home" element={<Home />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/buy/:productId" element={<Buy />} />
        <Route path="/viewbids" element={<ViewBids />} />
        <Route path="/winner" element={<Winner />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
      {!hideNavbarFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <ApiProvider>
      <ProductProvider>
        <AppContent />
      </ProductProvider>
    </ApiProvider>
  );
}

export default App;
