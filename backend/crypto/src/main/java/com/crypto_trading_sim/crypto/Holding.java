package com.crypto_trading_sim.crypto;

import org.springframework.boot.context.properties.BoundConfigurationProperties;

public class Holding {
    private String symbol;
    private double amount;
    private double boughtFor;

    public Holding(String symbol, double amount, double boughtFor){
        this.symbol=symbol;
        this.amount=amount;
        this.boughtFor=boughtFor;
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

    public double getBoughtFor(){
        return this.boughtFor;
    }
}
