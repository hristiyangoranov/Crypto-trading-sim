import { useEffect, useState } from 'react'
import './App.css'
import getBalance from './getBalance';
import getHoldings from './getHoldings';
import getTransactions from './getTransactions';
import CryptoBox from './CryptoBox';
import { Box, Grid, Typography, Button, TextField, Collapse, IconButton } from '@mui/material';
import TransactionCard from './TransactionCard';
import HoldingCard from './HoldingCard';
import { ExpandMore, ExpandLess, AttachMoney, TrendingUp, TrendingDown, AccountBalanceWallet } from '@mui/icons-material';

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



  function TradeButton(buysell) {
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
  
      const response = await fetch(`http://localhost:8080/api/${buysell}`, options)
      
      const result=await response.text()
      if(!response.ok){
        alert(result);
      }
      fetchData();
    };
  
    const buttonColor = buysell === "buy" ? "success" : "error";
    const buttonIcon = buysell === "buy" ? <TrendingUp /> : <TrendingDown />;
  
    return (
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color={buttonColor}
          startIcon={buttonIcon}
          onClick={handleButtonClick}
          sx={{
            borderRadius: '8px',
            textTransform: 'capitalize',
            fontWeight: 'bold',
            px: 3,
            py: 1,
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
            }
          }}
        >
          {showInputs ? 'Cancel' : `${buysell} Crypto`}
        </Button>
  
        <Collapse in={showInputs}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: 2,
              p: 3,
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            <TextField
              fullWidth
              label="Crypto Symbol"
              name="first"
              value={values.first}
              onChange={handleInputChange}
              variant="outlined"
              placeholder="e.g. BTC/USD"
              InputProps={{
                sx: { borderRadius: '8px' }
              }}
              required
            />
            
            <TextField
              fullWidth
              label="Amount"
              name="second"
              value={values.second}
              onChange={handleInputChange}
              variant="outlined"
              type="number"
              InputProps={{
                sx: { borderRadius: '8px' }
              }}
              required
            />
            
            <Button
              type="submit"
              variant="contained"
              color={buttonColor}
              sx={{
                mt: 1,
                borderRadius: '8px',
                py: 1.2,
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              Submit Order
            </Button>
          </Box>
        </Collapse>
      </Box>
    );
  }

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
          {TradeButton("buy")}
          {TradeButton("sell")}
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