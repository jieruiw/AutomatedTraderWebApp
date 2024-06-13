import {useEffect, useState} from "react";
import {getLogo, getStocks} from "../../services/api.ts";
import {Stock} from "../types.ts";

const StockList = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const data = await getStocks();
                const addLogo = await Promise.all(data.map(async (stock: Stock) => {
                    const logo = await getLogo(stock.ticker).catch(() => 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=');
                    return {
                        ...stock,
                        logo
                    };
                }));
                setStocks(addLogo);

            } catch (error) {
                console.error('Error fetching stocks:', error);
            }
        };
        fetchStocks();
    }, []);

    const formatValue = (value: number | null | undefined) => {
        return value !== null && value !== undefined ? value.toFixed(2) : 'N/A';
    };

    return (
        <div className="pl-16 p-4 mt-10">
            <h1 className="text-3xl font-bold mb-4">Stocks</h1>

            <div className="table-responsive">
                <table className="min-w-full text-left rounded-3xl "
                       style={{backgroundColor: '#262626'}}>
                    <thead>
                    <tr>
                        <th className="py-2 px-4 ">Stock</th>
                        <th className="py-2 px-4 ">Today's Price</th>
                        <th className="py-2 px-4 ">Signal</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stocks.map((stock: Stock) => (
                        <tr key={stock.ticker} className="hover:bg-gray-500">
                            <td className="py-2 px-4 flex items-center">
                                <img src={stock.logo} alt={` `} className="h-6 w-12 object-contain mr-2"/>
                                {stock.ticker}</td>
                            <td className="py-2 px-4">${formatValue(stock.price)}</td>
                            <td className="py-2 px-4">{formatValue(stock.signal)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StockList;