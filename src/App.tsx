import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ShoppingCart from './components/ShoppingCart';
import { useEffect } from 'react';
import { loadCartFromStorage } from './store/cartSlice';
import { store } from './store/store';

function App() {
  useEffect(() => {
    store.dispatch(loadCartFromStorage());
  }, []);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<ShoppingCart />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
