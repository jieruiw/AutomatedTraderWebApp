import { useParams } from 'react-router-dom';

const StockDetails = () => {
    const { ticker } = useParams<{ ticker: string }>();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Stock Details for {ticker}</h1>
            <p>Stock details content goes here...</p>
        </div>
    );
}

export default StockDetails;