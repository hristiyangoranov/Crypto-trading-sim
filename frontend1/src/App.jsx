import { useEffect, useState } from 'react'
import './App.css'
import getBalance from './getBalance';
import getHoldings from './getHoldings';
import getTransactions from './getTransactions';
import CryptoBox from './CryptoBox';
import { Box, Grid, Typography } from '@mui/material';

class Crypto{
  constructor(symbol, price){
    this.symbol=symbol;
    this.price=price;
  }
}

function App() {

  
  const [top20Cryptos, setTop20Cryptos]=useState([]);
  const [balance, setBalance]=useState(1);
  const [holdings, setHoldings]=useState([]);
  const [transactions, setTransactions]=useState([]);

  useEffect(()=>{
    const options = {
      method: 'GET',
      headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-G3BxLGFMANa2FqHnaZzV6hLw'}
    };
    
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd', options)
      .then(res => res.json())
      .then(res => {for (let index = 0; index < 20; index++) {
        setTop20Cryptos((prev)=>{
          const newCryptos=prev;
          const newCrypto=new Crypto(res[index].symbol.toUpperCase()+"/USD",res[index].current_price);
          newCryptos[index]=newCrypto;
          return newCryptos;
        })
      }})
      .catch(err => console.error(err));


    //establish ws connection
    const socket=new WebSocket("wss://ws.kraken.com/v2");

    socket.addEventListener("open",()=>{
      const symbols=[];
      for (let index = 0; index < 20; index++) {
        if(symbols.length!=20&&top20Cryptos[index]!=undefined){
          symbols.push(top20Cryptos[index].symbol);
        }
      }
      const data = {
        method:"subscribe",
        params:{
          channel:"ticker",
          symbol:symbols
        }
      }
      socket.send(JSON.stringify(data));
    })
  
    socket.addEventListener("message",(event)=>{
      const res=JSON.parse(event.data)
      if(res.channel=="ticker"){
        const update = new Crypto(res.data[0].symbol,res.data[0].last);
        setTop20Cryptos((prev) => {
          return prev.map((val) => 
            val.symbol === update.symbol ? update : val
          );
        });
        //console.log(`Price for ${update.symbol} is now ${update.price}`);
      }
    })

    fetchData();

  },[])

  const fetchData = async ()=>{
    const balanceData = await getBalance();
      const holdingsData = await getHoldings();
      const transactionsData = await getTransactions();

      setBalance(balanceData);
      setHoldings(holdingsData || []);  // Ensure array fallback
      setTransactions(transactionsData || []);
  }

  useEffect(()=>{
  },[top20Cryptos, balance, holdings, transactions])



  function BuyButton(buysell) {
    const [showInputs, setShowInputs] = useState(false);
    const [values, setValues] = useState({ first: '', second: '' });
  
    const handleButtonClick = () => {
      setShowInputs(!showInputs);
    };
  
    const handleInputChange = (e) => {
      setValues({
        ...values,
        [e.target.name]: e.target.value
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      let cryptoprice;
      top20Cryptos.map((value)=>(value.symbol==values.first?cryptoprice=value.price:value))

      console.log(cryptoprice);

      const options = {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          symbol: values.first,
          currprice: cryptoprice, 
          amount: parseFloat(values.second)
        })
      };

      fetch(`http://localhost:8080/api/${buysell}`, options)
      .then(res=>res.json())
      .then(res=>console.log(res))

      fetchData();
    };
  
    return (
      <div>
        <button onClick={handleButtonClick}>
          {showInputs ? 'Cancel' : `${buysell} Crypto`}
        </button>
  
        {showInputs && (
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Crypto symbol:
                <input
                  type="text"
                  name="first"
                  value={values.first}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div>
              <label>
                Amount:
                <input
                  type="text"
                  name="second"
                  value={values.second}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <button  type="submit">Submit</button>
          </form>
        )}
      </div>
    );
  }

  function getCurrPriceOfCrypto(symbol){
    for (let index = 0; index < 20; index++) {
      if(top20Cryptos[index]!=undefined&&top20Cryptos[index].symbol==symbol){
        return top20Cryptos[index].price;
      }
    }
  }

  function TransactionCard (symbol, buysell, amount, profit){
    return (
    <>
    <Box sx={{
        width:250,
        height:150,
        marginY: 3,
        alignItems: 'center',
        justifyContent: 'center',
        background:"white"
    }}>
        <Typography color='black' variant="h3">{symbol}</Typography>
        <Typography color='black' variant="h5">{buysell==true?"buy":"sell"}</Typography>
        <Typography color='black' variant="h5">{amount}</Typography>
        {buysell==false ? (profit>0 ? <Typography color='green'>{profit}</Typography> : <Typography color='red'>{profit}</Typography>):<Typography></Typography>}
    </Box>

    </>)
  }

  function HoldingCard (symbol, amount, currprice){
    return (
    <>
    <Box sx={{
        width:250,
        height:150,
        marginY: 3,
        alignItems: 'center',
        justifyContent: 'center',
        background:"white"
    }}>
        <Typography color='black' variant="h3">{symbol}</Typography>
        <Typography color='black' variant="h5">{amount}</Typography>
        <Typography color='black' variant="h5">{currprice}</Typography>
    </Box>

    </>)
}


  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h3" gutterBottom>
        Your balance is ${balance.toFixed(2)}
      </Typography>
      
      {BuyButton("buy")}
      {BuyButton("sell")}
  
      <Grid container spacing={3}>
        {/* Cryptocurrencies Column */}
        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom>
            Top 20 Cryptocurrencies
          </Typography>
          {top20Cryptos.map((val) => (
            <CryptoBox
              key={`crypto-${val.symbol}`}  // Unique key prefix
              argument1={val.symbol}
              argument2={val.price}
            />
          ))}
        </Grid>
  
        {/* Holdings Column */}
        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom>
            Your Holdings
          </Typography>
          {holdings.map((val, index) => (
            HoldingCard(val.symbol, val.amount, val.boughtFor)
          ))}
        </Grid>
  
        {/* Transactions Column */}
        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom>
            Recent Transactions
          </Typography>
          {transactions.map((val, index) => (
            TransactionCard(val.symbol,val.buysell, val.amount, val.profit)
          ))}
        </Grid>
      </Grid>
    </Box>
  )
}

export default App