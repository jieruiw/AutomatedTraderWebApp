export type HistoricalData = {
    date: Date;
    newDate: Date;
    _id: string;
    value: number;
}

export type RawHistoricalData = {
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
    holdings: number;

}

export type Transaction = {
    _id: string;
    ticker: string;
    date: string;
    quantity: number;
    price: number;
    type: string;
};

export type Stock = {
    logo: string | undefined;
    signal: number;
    ticker: string;
    price: number;
}