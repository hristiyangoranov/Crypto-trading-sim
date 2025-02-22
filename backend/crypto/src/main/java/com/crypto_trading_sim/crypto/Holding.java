package com.crypto_trading_sim.crypto;

public class Holding {
    private String symbol;
    private double amount;

    public Holding(String symbol, double amount){
        this.symbol=symbol;
        this.amount=amount;
    }

    public String getSymbol(){
        return this.symbol;
    }

    public double getAmount(){
        return this.amount;
    }

    public void setAmount(double amount){
        this.amount=amount;
    }
}
