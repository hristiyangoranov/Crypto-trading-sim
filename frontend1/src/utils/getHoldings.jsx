export default function getHoldings(){
    const options = {
        method: 'GET',
        headers: {accept: 'application/json'}
    };

    return fetch("http://localhost:8080/api/getHoldings", options)
    .then(res=>res.json())
    .then(res=>{
        console.log(res);
        return res;
    });
}