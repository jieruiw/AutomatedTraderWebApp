import { useEffect, useState } from 'react';
import { getHoldings } from '../../services/api.ts';
import PortfolioOverview from './PortfolioOverview.tsx';

const Portfolio = () => {
    const [holdings, setHoldings] = useState([]);

    useEffect(() => {
        const fetchHoldings = async () => {
            try {
                const data = await getHoldings();
                setHoldings(data);
            } catch (error) {
                console.error('Error fetching holdings:', error);
            }
        };

        fetchHoldings();
    }, []);

    return (
        <div className="container mx-auto mt-8">
            <PortfolioOverview holdings={holdings} />
        </div>
    );
};

export default Portfolio;