package com.crypto_trading_sim.crypto;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;


public class Service {
    private static double balance=10000.00;
    private static List<Holding> holdings = new CopyOnWriteArrayList<>();
    private static List<Transaction> transactions = new CopyOnWriteArrayList<>();   

    public static ResponseEntity<String> BuyCrypto(String symbol, double currprice, double amount){
        if(balance>=amount*currprice){
            Transaction tempTransacion=new Transaction(symbol,true, amount, 0);
            transactions.addLast(tempTransacion);
        
            //check if user already has the given crypto
            Boolean alreadyBought=false;
            for (Holding holding : holdings) {
                if(holding.getSymbol().equalsIgnoreCase(symbol)){
                    alreadyBought=true;
                    holding.setAmount(holding.getAmount()+amount);
                    break;
                }
            }

            if(!alreadyBought){
                Holding tempHolding = new Holding(symbol, amount, currprice);
                holdings.addLast(tempHolding);
            }

            //set new balance
            balance=balance-amount*currprice;

            return ResponseEntity.ok("Success");
        }
        else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("not enough money");
        }
        //return not enough money
    }

    public static ResponseEntity<String> SellCrypto(String symbol, double currprice, double amount){
        
        //check if the user has the crypto
        for (Holding holding : holdings) {
            if(holding.getAmount()>=amount){
                Transaction tempTransacion=new Transaction(symbol, false, amount,  (currprice-holding.getBoughtFor())*amount);
                transactions.addLast(tempTransacion);

                //update balance
                balance=balance+currprice*amount;

                //update holdings
                if(holding.getAmount()-amount==0){
                    holdings.remove(holding);
                }
                else{
                    holding.setAmount(holding.getAmount()-amount);
                }
                return ResponseEntity.ok("");
            }
            //you dont have that much crypto to sell
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You dont have that much crypto to sell");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You dont have the crypto you are trying to sell");
        // dont have the crypto


    }

    public static double getBalance(){
        return Service.balance;
    }

    public static List<Holding> getHoldings(){
        return Service.holdings;
    }

    public static List<Transaction> getTransacions(){
        return Service.transactions;
    }

}
