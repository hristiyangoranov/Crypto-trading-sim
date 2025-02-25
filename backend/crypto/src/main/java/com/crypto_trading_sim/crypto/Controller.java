package com.crypto_trading_sim.crypto;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class Controller {
    
    @PostMapping("/buy")
    public double buy(@RequestBody Req request){
        Service.BuyCrypto(request.symbol, request.currprice, request.amount);
        return Service.getBalance();
    }

    @PostMapping("/sell")
    public void sell(@RequestBody Req request){
        Service.SellCrypto(request.symbol, request.currprice, request.amount);
    }

    @GetMapping("/getBalance")
    public double getBalance(){
        return Service.getBalance();
    }

    @GetMapping("/getHoldings")
    public List<Holding> getHoldings(){
        return Service.getHoldings();
    }
    
    @GetMapping("/getTransactions")
    public List<Transaction> getTransactions(){
        return Service.getTransacions();
    }
}
