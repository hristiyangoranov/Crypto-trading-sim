import { useEffect, useState } from 'react'
import './App.css'
import getBalance from './getBalance';
import getHoldings from './getHoldings';
import getTransactions from './getTransactions';

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
        if(symbols.length!=20){
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

    setBalance(getBalance().then(b=>{return b}));

    setHoldings(getHoldings().then(x=>{return x}));

    setTransactions(getTransactions().then(x=>{return x}));

  },[])

  useEffect(()=>{
  },[top20Cryptos])


  function BuyButton() {
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
          buysell:false,
          price: cryptoprice, 
          amount: parseFloat(values.second)
        })
      };

      fetch("http://localhost:8080/api/buy", options)
      .then(res=>res.json())
      .then(res=>console.log(res))

      setBalance(getBalance().then(b=>{return b}));

      setHoldings(getHoldings().then(x=>{return x}));

      setTransactions(getTransactions().then(x=>{return x}));
    };
  
    return (
      <div>
        <button onClick={handleButtonClick}>
          {showInputs ? 'Cancel' : 'Buy Crypto'}
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



  return (
    <>
      <h1>Your balance is ${balance}</h1>
      {BuyButton()}
      {top20Cryptos.map((val) => (
          <div key={val.symbol}>
              <h1>{val.symbol}</h1>
              <h2>{val.price}</h2>
          </div>
      ))}
    </>
  )
}

export default App
// import { useEffect, useState } from 'react'
// import './App.css'

// function App() {
//   const [top20Cryptos, setTop20Cryptos] = useState([]);
//   const [socket, setSocket] = useState(null);

//   // Fetch initial data
//   useEffect(() => {
//     const options = {
//       method: 'GET',
//       headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-G3BxLGFMANa2FqHnaZzV6hLw' }
//     };

//     fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=20', options)
//       .then(res => res.json())
//       .then(res => {
//         const cryptos = res.slice(0, 20).map(coin => ({
//           symbol: coin.symbol.toUpperCase() + "/USD",
//           price: coin.current_price,
//           icon: coin.image,
//           change24h: coin.price_change_percentage_24h
//         }));
//         setTop20Cryptos(cryptos);
//       })
//       .catch(err => console.error(err));
//   }, []);

//   // WebSocket connection (runs AFTER top20Cryptos is populated)
//   useEffect(() => {
//     if (top20Cryptos.length === 0) return;

//     const ws = new WebSocket("wss://ws.kraken.com/v2");

//     ws.addEventListener("open", () => {
//       const symbols = top20Cryptos.map(crypto => crypto.symbol);
//       const subscription = {
//         method: "subscribe",
//         params: {
//           channel: "ticker",
//           symbol: symbols
//         }
//       };
//       ws.send(JSON.stringify(subscription));
//     });

//     ws.addEventListener("message", (event) => {
//       const res = JSON.parse(event.data);
//       if (res.channel === "ticker" && res.data?.[0]) {
//         setTop20Cryptos(prev => 
//           prev.map(val => val.symbol === res.data[0].symbol ? 
//             { ...val, price: res.data[0].last } : val
//           )
//         );
//       }
//     });

//     ws.addEventListener("error", (error) => {
//       console.error("WebSocket error:", error);
//     });

//     setSocket(ws);

//     return () => {
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.close();
//       }
//     };
//   }, [top20Cryptos]); // Re-run when top20Cryptos updates

//   return (
//     <div className="app-container">
//       <h1 className="header">Top 20 Cryptocurrencies</h1>
//       <div className="crypto-grid">
//         {top20Cryptos.map((crypto) => (
//           <div key={crypto.symbol} className="crypto-card">
//             <div className="crypto-header">
//               <img src={crypto.icon} alt={crypto.symbol} className="crypto-icon" />
//               <h2 className="crypto-symbol">{crypto.symbol}</h2>
//             </div>
//             <div className="price-container">
//               <span className="price-label">Price:</span>
//               <span className="price-value">
//                 ${crypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
//               </span>
//             </div>
//             {crypto.change24h && (
//               <div className={`price-change ${crypto.change24h >= 0 ? 'positive' : 'negative'}`}>
//                 {crypto.change24h.toFixed(2)}%
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;