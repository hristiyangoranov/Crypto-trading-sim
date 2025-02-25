import { useEffect, useState } from 'react'
import './App.css'
import getBalance from './getBalance';
import getHoldings from './getHoldings';
import getTransactions from './getTransactions';
import CryptoBox from './CryptoBox';
import { Box, Grid, Typography, Button, TextField, Collapse, IconButton } from '@mui/material';
import { ExpandMore, ExpandLess, AttachMoney, TrendingUp, AccountBalanceWallet } from '@mui/icons-material';
import TransactionCard from './TransactionCard';
import HoldingCard from './HoldingCard';

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
    const [values, setValues] = useState({ first: "", second: "" });
  
    const handleButtonClick = () => {
      setShowInputs(!showInputs);
    };
  
    const handleInputChange = (e) => {
      setValues({
        ...values,
        [e.target.name]: e.target.value
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      var validSymbol = false;
      for (let index = 0; index < 20; index++) {
        if(top20Cryptos[index].symbol===values.first){
          validSymbol=true;
          break;
        }
      }
      if(!validSymbol){
        alert("Enter valid symbol");
        return;
      }
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

      const res = await fetch(`http://localhost:8080/api/${buysell}`, options)

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

  // function TransactionCard(symbol, buysell, amount, profit){
  //     return (
  //       <Box sx={{
  //           background: 'linear-gradient(145deg, ghostwhite 0%, #f8f8ff 100%)',
  //           height: 150,
  //           width: 250,
  //           borderRadius: '16px',
  //           display: 'flex',
  //           flexDirection: 'column',
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //           marginY: 3,
  //           boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
  //           border: '1px solid rgba(0, 0, 0, 0.05)',
  //           transition: 'all 0.3s ease-in-out',
  //           position: 'relative',
  //           overflow: 'hidden',
  //           '&:hover': {
  //               transform: 'translateY(-4px)',
  //               boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)'
  //           },
  //           '&::before': {
  //               content: '""',
  //               position: 'absolute',
  //               top: 0,
  //               left: 0,
  //               right: 0,
  //               height: '4px',
  //               background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)'
  //           }
  //       }}>
  //           <Typography variant='h4' sx={{ 
  //               color: 'black',
  //               fontWeight: 700,
  //               fontFamily: 'monospace',
  //               mb: 0.5
  //           }}>
  //               {symbol}
  //           </Typography>
            
  //           <Typography variant='subtitle2' sx={{ 
  //               color: '#666',
  //               fontWeight: 500,
  //               mt: 1,
  //               textTransform: 'uppercase'
  //           }}>
  //               {buysell==true?"buy":"sell"}
  //           </Typography>
  //           <Typography variant='h6' sx={{ 
  //               color: "black",
  //               fontWeight: 600,
  //               fontFamily: 'monospace'
  //           }}>
  //               Amount: {amount}
  //           </Typography>
  //           <Typography variant='h6' sx={{ 
  //               color: "black",
  //               fontWeight: 600,
  //               fontFamily: 'monospace'
  //           }}>
  //              {buysell==false ? (profit>0 ? <Typography color='green'>{profit.toFixed(2)}</Typography> : <Typography color='red'>{profit.toFixed(2)}</Typography>):<Typography></Typography>}
  //           </Typography>
  //       </Box>
  //     );
  // }



  // function HoldingCard (symbol, amount, currprice){
  //   return (
  //     <Box sx={{
  //         background: 'linear-gradient(145deg, ghostwhite 0%, #f8f8ff 100%)',
  //         height: 150,
  //         width: 250,
  //         borderRadius: '16px',
  //         display: 'flex',
  //         flexDirection: 'column',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         marginY: 3,
  //         boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
  //         border: '1px solid rgba(0, 0, 0, 0.05)',
  //         transition: 'all 0.3s ease-in-out',
  //         position: 'relative',
  //         overflow: 'hidden',
  //         '&:hover': {
  //             transform: 'translateY(-4px)',
  //             boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)'
  //         },
  //         '&::before': {
  //             content: '""',
  //             position: 'absolute',
  //             top: 0,
  //             left: 0,
  //             right: 0,
  //             height: '4px',
  //             background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)'
  //         }
  //     }}>
  //         <Typography variant='h4' sx={{ 
  //             color: 'black',
  //             fontWeight: 700,
  //             fontFamily: 'monospace',
  //             mb: 0.5
  //         }}>
  //             {symbol}
  //         </Typography>
          
  //         <Typography variant='subtitle2' sx={{ 
  //             color: '#666',
  //             fontWeight: 500,
  //             mt: 1,
  //             textTransform: 'uppercase'
  //         }}>
  //             Amount: {amount}
  //         </Typography>
  //         <Typography variant='h6' sx={{ 
  //             color: "black",
  //             fontWeight: 600,
  //             fontFamily: 'monospace'
  //         }}>
  //             Bought at: {currprice}
  //         </Typography>
  //     </Box>
  //   );
//}


  // return (
  //   <Box sx={{ padding: 3 }}>
  //     <Typography variant="h3" gutterBottom>
  //       Your balance is ${balance.toFixed(2)}
  //     </Typography>
      
  //     {BuyButton("buy")}
  //     {BuyButton("sell")}
  
  //     <Grid container spacing={3}>
  //       {/* Cryptocurrencies Column */}
  //       <Grid item xs={12} md={4}>
  //         <Typography variant="h5" gutterBottom>
  //           Top 20 Cryptocurrencies
  //         </Typography>
  //         {top20Cryptos.map((val) => (
  //           <CryptoBox
  //             key={`crypto-${val.symbol}`}  // Unique key prefix
  //             argument1={val.symbol}
  //             argument2={val.price}
  //           />
  //         ))}
  //       </Grid>
  
  //       {/* Holdings Column */}
  //       <Grid item xs={12} md={4}>
  //         <Typography variant="h5" gutterBottom>
  //           Your Holdings
  //         </Typography>
  //         {holdings.map((val, index) => (
  //           HoldingCard(val.symbol, val.amount, val.boughtFor)
  //         ))}
  //       </Grid>
  
  //       {/* Transactions Column */}
  //       <Grid item xs={12} md={4}>
  //         <Typography variant="h5" gutterBottom>
  //           Recent Transactions
  //         </Typography>
  //         {transactions.map((val, index) => (
  //           TransactionCard(val.symbol,val.buysell, val.amount, val.profit)
  //         ))}
  //       </Grid>
  //     </Grid>
  //   </Box>
  // )
  return (
    <Box sx={{ 
      padding: 4,
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
    }}>
      <Box sx={{ 
        maxWidth: 1600,
        margin: '0 auto',
        padding: 3,
        borderRadius: '16px',
        background: 'white',
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.05)'
      }}>
        <Box sx={{ 
          mb: 4,
          padding: 3,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            <AttachMoney sx={{ fontSize: 48, verticalAlign: 'middle', mr: -1, mt:-1 }} />
            {balance.toFixed(2)}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Portfolio Value
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex',
          gap: 3,
          mb: 4,
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {BuyButton("buy")}
          {BuyButton("sell")}
        </Box>

        <Grid container spacing={4}>
          {/* Cryptocurrencies Column */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 700,
              color: '#2d3436',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 3
            }}>
              <TrendingUp sx={{ fontSize: 32 }} />
              Top 20 Cryptocurrencies
            </Typography>
            <Box sx={{ 
              height: 'calc(100vh - 300px)',
              overflowY: 'auto',
              pr: 2
            }}>
              {top20Cryptos.map((val) => (
                <CryptoBox
                  key={`crypto-${val.symbol}`}
                  argument1={val.symbol}
                  argument2={val.price}
                />
              ))}
            </Box>
          </Grid>

          {/* Holdings Column */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 700,
              color: '#2d3436',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 3
            }}>
              <AccountBalanceWallet sx={{ fontSize: 32 }} />
              Your Holdings
            </Typography>
            <Box sx={{ 
              height: 'calc(100vh - 300px)',
              overflowY: 'auto',
              pr: 2
            }}>
              {holdings.map((val, index) => (
                HoldingCard(val.symbol, val.amount, val.boughtFor)
              ))}
            </Box>
          </Grid>

          {/* Transactions Column */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 700,
              color: '#2d3436',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 3
            }}>
              <AttachMoney sx={{ fontSize: 32 }} />
              Recent Transactions
            </Typography>
            <Box sx={{ 
              height: 'calc(100vh - 300px)',
              overflowY: 'auto',
              pr: 2
            }}>
              {transactions.map((val, index) => (
                TransactionCard(val.symbol, val.buysell, val.amount, val.profit)
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
            )
}

export default App