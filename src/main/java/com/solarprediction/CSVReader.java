package com.solarprediction;

import java.io.*;
import java.util.*;

public class CSVReader {

    public static List<SolarData> readCSV(InputStream inputStream) {
        List<SolarData> dataList = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            br.readLine(); // Skip header

            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");

                if (values.length >= 4) {
                    try {
                        double area = Double.parseDouble(values[1].trim());
                        double irradiance = Double.parseDouble(values[2].trim());
                        double efficiency = Double.parseDouble(values[3].trim());

                        // Power = area × irradiance × efficiency
                        double powerOutput = area * irradiance * efficiency;

                        dataList.add(new SolarData(irradiance, powerOutput));

                    } catch (NumberFormatException e) {
                        // Skip invalid rows safely
                    }
                }
            }

            System.out.println("📊 Loaded " + dataList.size() + " training samples from CSV");

        } catch (Exception e) {
            e.printStackTrace();
        }

        return dataList;
    }
}
