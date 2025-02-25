package com.crypto_trading_sim.crypto;

public class Transaction {
    private String symbol;
    private Boolean buysell;
    private double price;
    private double amount;
    private double profit;

    public Transaction(String symbol, Boolean buysell, double price, double amount,double profit){
        this.symbol=symbol;
        this.buysell=buysell;
        this.price=price;
        this.amount=amount;
        this.profit=profit;
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

    public double getProfit(){
        return this.profit;
    }
}
