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

