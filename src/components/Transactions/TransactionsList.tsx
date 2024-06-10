import {Transaction} from "../types.ts";

const TransactionsList: React.FC<{ filteredTransactions: { [date: string]: Transaction[] }, logos: { [key: string]: string } }> = ({ filteredTransactions, logos }) => (
    <div>
        {Object.keys(filteredTransactions).map((date) => (
            <div key={date} className="mb-8">
                <h2 className="text-xl font-semibold mb-2">{date}</h2>
                {filteredTransactions[date].map((tx) => (
                    <div key={tx._id} className="flex justify-between items-center mb-2 p-4 rounded-lg w-full"
                         style={{ backgroundColor: '#262626' }}>
                        <div>
                            <div className="flex items-center">
                                <img src={logos[tx.ticker]} alt={tx.ticker} className="h-6 w-6 object-contain mr-2" />
                                <span className="font-bold">{tx.ticker}</span>
                            </div>
                            <div className="text-gray-400">{tx.type}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-white font-bold">
                                {tx.quantity} Shares @
                                {tx.price.toFixed(2)} USD
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ))}
    </div>
);


export default TransactionsList;