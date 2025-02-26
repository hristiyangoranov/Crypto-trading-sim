import getBalance from "./getBalance";
import getHoldings from "./getHoldings";
import getTransactions from "./getTransactions";

export default async function fetchData(setBalance, setHoldings, setTransactions){
    const balanceData = await getBalance();
    const holdingsData = await getHoldings();
    const transactionsData = await getTransactions();
    
    setBalance(balanceData);
    setHoldings(holdingsData || []);  // Ensure array fallback
    setTransactions(transactionsData || []);
    
}