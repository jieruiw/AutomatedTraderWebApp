import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-gray-800 text-white p-4">
            <nav className="flex justify-around">
                <NavLink to="/" className="hover:text-gray-400">Portfolio</NavLink>
                <NavLink to="/transactions" className="hover:text-gray-400">Transactions</NavLink>
                <NavLink to="/stocks" className="hover:text-gray-400">Stock List</NavLink>
            </nav>
        </header>
    );
}

export default Header;