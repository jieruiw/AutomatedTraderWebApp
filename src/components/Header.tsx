import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <header className="w-full flex justify-end py-4 fixed top-0"
                style={{ backgroundColor: '#161616',
                paddingRight: '80px'}}>
            <nav className="flex space-x-8 mt-10">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "underline text-white" : "text-white hover:text-gray-400"
                    }
                >
                    Portfolio
                </NavLink>
                <NavLink
                    to="/transactions"
                    className={({ isActive }) =>
                        isActive ? "underline text-white" : "text-white hover:text-gray-400"
                    }
                >
                    Transactions
                </NavLink>
                <NavLink
                    to="/stocks"
                    className={({ isActive }) =>
                        isActive ? "underline text-white" : "text-white hover:text-gray-400"
                    }
                >
                    Stock List
                </NavLink>
            </nav>
        </header>
    );
}

export default Header;