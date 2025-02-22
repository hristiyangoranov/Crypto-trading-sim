export default function getBalance(){
    const options = {
        method: 'GET',
        headers: {accept: 'application/json'}
    };
    var temp;

    return fetch("http://localhost:8080/api/getBalance", options)
    .then(res=>res.json())
    .then(res=>{
        return res;
    });
}