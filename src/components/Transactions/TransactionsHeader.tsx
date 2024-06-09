const TransactionsHeader: React.FC<{ filter: string | null, handleFilterChange: (type: string | null) => void }> = ({ filter, handleFilterChange }) => (
    <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mr-60">Transactions</h1>
        <div className="flex items-center bg-gray-700 rounded-full p-1">
            <button
                className={`px-4 py-2 rounded-l-full ${filter === 'buy' ? 'bg-gray-500 text-white' : 'bg-gray-700 text-gray-400'}`}
                onClick={() => handleFilterChange(filter === 'buy' ? null : 'buy')}
            >
                Buys
            </button>
            <button
                className={`px-4 py-2 rounded-r-full ${filter === 'sell' ? 'bg-gray-500 text-white' : 'bg-gray-700 text-gray-400'}`}
                onClick={() => handleFilterChange(filter === 'sell' ? null : 'sell')}
            >
                Sells
            </button>
        </div>
    </div>
);

export default TransactionsHeader;