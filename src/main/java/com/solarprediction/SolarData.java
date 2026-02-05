package com.solarprediction;

public class SolarData {
    private double radiation;
    private double powerOutput;

    public SolarData(double radiation, double powerOutput) {
        this.radiation = radiation;
        this.powerOutput = powerOutput;
    }

    public double getRadiation() {
        return radiation;
    }

    public double getPowerOutput() {
        return powerOutput;
    }
}
