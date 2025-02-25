package com.crypto_trading_sim.crypto;

public class Transaction {
    private String symbol;
    private Boolean buysell;
    private double amount;
    private double profit;

    public Transaction(String symbol, Boolean buysell, double amount, double profit){
        this.symbol=symbol;
        this.buysell=buysell;
        this.amount=amount;
        this.profit=profit;
    }

    public String getSymbol(){
        return this.symbol;
    }

    public Boolean getBuysell(){
        return buysell;
    }

    public double getAmount(){
        return this.amount;
    }

    public double getProfit(){
        return this.profit;
    }
}
