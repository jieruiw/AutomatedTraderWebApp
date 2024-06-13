import {useEffect, useState} from "react";
import {getBookValue, getHistoricalData, getPortfolioValue, getLogo} from "../../services/api.ts";
import PortfolioGraph from "./PortfolioGraph.tsx";
import {HistoricalData, Holding} from "../types.ts";


const PortfolioOverview = ({holdings}: {holdings: Holding[]}) => {


    const [currentValue, setCurrentValue] = useState<number | null>(null);
    const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<string>('5y');
    const [gainsLosses, setGainsLosses] = useState<number | null>(null);
    const [percentGL, setPercentGL] = useState<number | null>(null);
    const [holdingsData, setHoldingsData] = useState<Holding[]>([]);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const value = await getPortfolioValue();
                setCurrentValue(value);
                const data = await getHistoricalData(selectedPeriod);


                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                setHistoricalData(data);

                if (data.length > 0) {
                    const firstValue = data[0].value;
                    const lastValue = data[data.length - 1].value;

                    const change = parseFloat((lastValue - firstValue).toFixed(2));
                    const percentChange = parseFloat(((change / firstValue) * 100).toFixed(2));
                    setGainsLosses(change);
                    setPercentGL(percentChange);

                } else {
                    setGainsLosses(null);
                    setPercentGL(null);
                }

                // Fetch book values and calculate all-time returns
                const updatedHoldings = await Promise.all(holdings.map(async (holding) => {
                    const bookValue = await getBookValue(holding.ticker);
                    const totalValue = holding.stock.price * holding.holdings;
                    const allTimeReturn = ((holding.stock.price - bookValue) / bookValue) * 100;
                    const logo = await getLogo(holding.ticker).catch(() => 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=');
                    return {
                        ...holding,
                        totalValue: totalValue,
                        allTimeReturn: parseFloat(allTimeReturn.toFixed(2)), // Format to 2 decimal places
                        logo
                    };
                }));

                setHoldingsData(updatedHoldings);



            } catch (error) {
                console.error('Error fetching portfolio data:', error);
            }
        };

        fetchPortfolioData();
    }, [selectedPeriod, holdings]);
    const formatValue = (value: number | null | undefined) => {
        return value !== null && value !== undefined ? value.toFixed(2) : 'N/A';
    };

    const handlePeriodChange = (period:string) => {
        setSelectedPeriod(period);
    };

    const periodMapping: { [key: string]: string } = {
        '1w': 'past week',
        '1m': 'past month',
        '3m': 'past 3 months',
        '1y': 'past year',
        '5y': 'all time',
    };


    return (
        <div className="pl-16 p-4">
            <div className="mb-4">
                <h2 className="text-5xl font-bold">${formatValue(currentValue) ?? 'Loading...'}</h2>
                <p className={`text-lg ${gainsLosses !== null && gainsLosses >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {gainsLosses !== null ? `${gainsLosses >= 0 ? '+' : ''} ${formatValue(gainsLosses)} 
                    (${percentGL !== null ? percentGL : 'Loading...'}%) ${periodMapping[selectedPeriod]}` : 'Loading...'}
                </p>
            </div>
            <PortfolioGraph data ={historicalData}>
            </PortfolioGraph>
            <div className="period-selector">
                <button onClick={() => handlePeriodChange('1w')}
                        className={`period-button ${selectedPeriod === '1w' ? 'selected' : ''}`}> 1 Week
                </button>
                <button onClick={() => handlePeriodChange('1m')}
                        className={`period-button ${selectedPeriod === '1m' ? 'selected' : ''}`}> 1 Month
                </button>
                <button onClick={() => handlePeriodChange('3m')}
                        className={`period-button ${selectedPeriod === '3m' ? 'selected' : ''}`}> 3 Months
                </button>
                <button onClick={() => handlePeriodChange('1y')}
                        className={`period-button ${selectedPeriod === '1y' ? 'selected' : ''}`}> 1 Year
                </button>
                <button onClick={() => handlePeriodChange('5y')}
                        className={`period-button ${selectedPeriod === '5y' ? 'selected' : ''}`}> All Time
                </button>
            </div>
            {/* Holdings Section */}
            <div className = "mt-8 mr-20">
                <h2 className="text-3xl font-semibold mb-4">Holdings</h2>
                <table className="min-w-full text-left rounded-3xl"
                       style={{ backgroundColor: '#262626' }}>
                    <thead>
                    <tr>
                        <th className="py-2 px-4 ">Stock</th>
                        <th className="py-2 px-4 ">Total Value</th>
                        <th className="py-2 px-4 ">Today's Price</th>
                        <th className="py-2 px-4 ">All Time Return</th>
                    </tr>
                    </thead>
                    <tbody>
                    {holdingsData.map((holding) => (
                        <tr key={holding.ticker} className="hover:bg-gray-500">
                            <td className="py-2 px-4 flex items-center">
                                <img src = {holding.logo} alt={` `} className = "h-6 w-12 object-contain mr-2" />
                                {holding.ticker}</td>
                            <td className="py-2 px-4">${formatValue(holding.totalValue)}</td>
                            <td className="py-2 px-4">${formatValue(holding.stock.price)}</td>
                            <td className={`py-2 px-4 ${holding.allTimeReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {holding.allTimeReturn >= 0 ? `+${holding.allTimeReturn}` : holding.allTimeReturn}%
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </table>

            </div>
        </div>
    );
}

export default PortfolioOverview;