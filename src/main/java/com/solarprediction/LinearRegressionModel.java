package com.solarprediction;

import org.apache.commons.math3.stat.regression.SimpleRegression;

import java.util.List;

public class LinearRegressionModel {
    private SimpleRegression regression;

    public LinearRegressionModel() {
        this.regression = new SimpleRegression();
    }

    public void trainModel(List<SolarData> data) {
        for (SolarData entry : data) {
            regression.addData(entry.getRadiation(), entry.getPowerOutput());
        }
    }

    public double predict(double radiation) {
        return regression.predict(radiation);
    }
}