package com.solarprediction;

import org.springframework.web.bind.annotation.*;
import java.io.InputStream;
import java.util.*;

@RestController
@RequestMapping("/api")
public class PredictionController {

    private final LinearRegressionModel model;

    public PredictionController() {
        model = new LinearRegressionModel();

        try {
            InputStream is = getClass()
                    .getClassLoader()
                    .getResourceAsStream("solar_data.csv");

            if (is == null) {
                System.err.println("❌ solar_data.csv NOT FOUND");
            } else {
                List<SolarData> trainingData = CSVReader.readCSV(is);
                model.trainModel(trainingData);
                System.out.println("✅ Model trained with " + trainingData.size() + " records");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/predict")
    public Map<String, Object> predict(@RequestBody PredictionRequest request) {

        Map<String, Object> response = new HashMap<>();

        try {
            double radiation = request.getRadiation();
            System.out.println("🔆 Radiation received: " + radiation);

            double predictedPower = model.predict(radiation);

            response.put("powerOutput", predictedPower);
            System.out.println("⚡ Predicted Power Output: " + predictedPower);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "Prediction failed");
        }

        return response;
    }
}
