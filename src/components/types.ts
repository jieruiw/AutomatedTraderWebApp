export type HistoricalData = {
    date: Date;
    _id: string;
    value: number;
}

export type Holding = {
    logo: string | undefined;
    totalValue:number;
    allTimeReturn: number;
    ticker: string;
    stock: {
        signal: number;
        ticker: string;
        price: number;
    }
    holdings: number

}
