package com.crypto_trading_sim.crypto;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;


public class Service {
    private static double balance=10000.00;
    private static List<Holding> holdings = new CopyOnWriteArrayList<>();
    private static List<Transaction> transactions = new CopyOnWriteArrayList<>();   

    public static void BuyCrypto(String symbol, double currprice, double amount){
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
        }
        //return not enough money
    }

    public static void SellCrypto(String symbol, double currprice, double amount){
        
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
                break;
            }
            //you dont have that much crypto to sell
        }
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
