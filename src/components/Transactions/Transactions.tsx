import React, {useEffect, useState} from 'react';
import {getLogo, getTransactions} from '../../services/api.ts';
import TransactionsHeader from './TransactionsHeader';
import { Transaction } from "../types.ts";
import TransactionsList from "./TransactionsList.tsx";

const TransactionsPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<{ [date: string]: Transaction[] }>({});
    const [filter, setFilter] = useState<string | null>(null);
    const [logos, setLogos] = useState<{ [key: string]: string }>({});

    // fetch transactions and logos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getTransactions();
                setTransactions(data);
                const uniqueTickers = [...new Set(data.map((tx: { ticker: string; }) => tx.ticker))];
                const logoData: { [key: string]: string } = {};
                for (const ticker of uniqueTickers as string[]) {
                    logoData[ticker] = await getLogo(ticker).catch(() => 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=');
                }
                setLogos(logoData);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        fetchData();
    }, []);

    // group transactions by date
    useEffect(() => {
        const groupByDate = (data: Transaction[]) => {
            return data.reduce((acc, transaction) => {
                const date = new Date(transaction.date).toLocaleDateString();
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(transaction);
                return acc;
            }, {} as { [date: string]: Transaction[] });
        };

        if (filter) {
            setFilteredTransactions(groupByDate(transactions.filter((tx) => tx.type === filter)));
        } else {
            setFilteredTransactions(groupByDate(transactions));
        }
    }, [filter, transactions]);


    const handleFilterChange = (type: string | null) => {
        setFilter(prevFilter => (prevFilter === type ? null : type));
    };

    return (
        <div className="transactions-data">
            {/* Header */}
            <TransactionsHeader filter={filter} handleFilterChange={handleFilterChange} />

            {/* Transactions */}
            <TransactionsList filteredTransactions={filteredTransactions} logos={logos} />
        </div>
    );
};

export default TransactionsPage;