
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Portfolio from './components/Portfolio/Portfolio.tsx';
import Transactions from './components/Transactions';
import StockList from './components/StockList';
import StockDetails from './components/StockDetails';
import Header from './components/Header';


export default function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <div className="pt-10">
                <Routes>
                    <Route path="/" element={<Portfolio />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/stocks" element={<StockList />} />
                    <Route path="/stocks/:ticker" element={<StockDetails />} />
                </Routes>
                </div>
            </div>
        </Router>
    );
}

