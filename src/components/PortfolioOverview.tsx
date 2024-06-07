import {useEffect, useState} from "react";
import {getBookValue, getHistoricalData, getPortfolioValue} from "../services/api.ts";
const PortfolioOverview = ({holdings}) => {

    type HistoricalData = {
        _id: string;
        date: string;
        value: number;
    }
    const [currentValue, setCurrentValue] = useState<number | null>(null);
    const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<string>('5y');
    const [gainsLosses, setGainsLosses] = useState<number | null>(null);
    const [percentGL, setPercentGL] = useState<number | null>(null);
    const [holdingsData, setHoldingsData] = useState<any[]>([]);
    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const value = await getPortfolioValue();
                setCurrentValue(value);
                const data: HistoricalData[] = await getHistoricalData(selectedPeriod);
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
                    const allTimeReturn = ((holding.currentPrice - bookValue) / bookValue) * 100;
                    return {
                        ...holding,
                        bookValue,
                        allTimeReturn: allTimeReturn.toFixed(2) // Format to 2 decimal places
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
            <div className="bg-gray-700 h-[400px] w-[800px] flex items-center justify-center">
                <p className="text-gray-500">Graph Placeholder</p>
            </div>
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
            <div className = "mt-8">
                <h2 className="text-3xl font-semibold mb-4">Holdings</h2>
                <table className="min-w-full bg-transparent  text-left">
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
                            <td className="py-2 px-4">{holding.ticker}</td>
                            <td className="py-2 px-4">${formatValue(holding.totalValue)}</td>
                            <td className="py-2 px-4">${formatValue(holding.currentPrice)}</td>
                            <td className="py-2 px-4">{holding.allTimeReturn}%</td>
                        </tr>
                    ))}
                    </tbody>

                </table>

            </div>
        </div>
    );
}

export default PortfolioOverview;