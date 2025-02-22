package com.crypto_trading_sim.crypto;

public class Transaction {
    private String symbol;
    private Boolean buysell;
    private double price;
    private double amount;

    public Transaction(String symbol, Boolean buysell, double price, double amount){
        this.symbol=symbol;
        this.buysell=buysell;
        this.price=price;
        this.amount=amount;
    }

    public String getSymbol(){
        return this.symbol;
    }

    public Boolean getBuysell(){
        return buysell;
    }

    public double getPrice(){
        return this.price;
    }

    public double getAmount(){
        return this.amount;
    }
}
