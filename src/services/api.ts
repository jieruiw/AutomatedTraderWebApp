import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api', // Adjust this based on your backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getPortfolioValue = async () => {
    console.log("Fetching Portfolio Value...");
    const response = await apiClient.get('/portfolio/value');
    console.log("Portfolio value fetched: " + response.data.value);
    return response.data.value;
};


type HistoricalData = {
    _id: string;
    date: string;
    value: number;
}
export const getHistoricalData = async (period: string):Promise<HistoricalData[]> => {
    const response = await apiClient.get('/portfolio/history', {
        params: { period }
    });
    console.log("Portfolio history fetched: " + response.data);
    return response.data;
};


export const getHoldings = async () => {
    const response = await apiClient.get('/portfolio');
    console.log("Portfolio holdings fetched. ");
    return response.data;
};

export const getBookValue = async (ticker: string) => {
    const response = await apiClient.get(`/portfolio/bookvalue/${ticker}`);
    return response.data.bookValue;
};

export const getLogo = async (ticker: string) => {
    const response = await apiClient.get(`https://api.api-ninjas.com/v1/logo?ticker=${ticker}`, {
        headers: {'X-Api-Key' : '4Vh53TCr/mDyKVQUMdvEiA==C1bJXQz2wnPkJdTY'}
    });
    return response.data[0]?.image;
};
