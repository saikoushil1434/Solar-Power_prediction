import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Sun, Zap, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// ✅ BACKEND URL (local + production safe)
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8081";

function App() {
  const [radiation, setRadiation] = useState("");
  const [powerOutput, setPowerOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPowerOutput(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/predict`,
        {
          radiation: parseFloat(radiation),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.powerOutput !== undefined) {
        const predicted = Number(response.data.powerOutput);
        setPowerOutput(predicted);
        setHistory((prev) => [
          ...prev,
          { radiation: parseFloat(radiation), powerOutput: predicted },
        ]);
      } else {
        setError("Invalid response from backend");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to predict at the moment ⚠️");
    } finally {
      setLoading(false);
    }
  };

  const getBackground = () => {
    if (!radiation) return "from-yellow-100 to-orange-100";
    const val = parseFloat(radiation);
    if (val < 500) return "from-blue-100 to-blue-300";
    if (val < 1000) return "from-yellow-200 to-orange-200";
    return "from-orange-300 to-red-300";
  };

  return (
    <div
      className={`flex flex-col justify-center items-center min-h-screen transition-all bg-gradient-to-r ${getBackground()} p-6`}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-center items-center gap-2 mb-2">
          <Sun className="text-amber-600 w-10 h-10 animate-spin-slow" />
          <h1 className="text-4xl font-extrabold text-amber-700 drop-shadow-lg">
            Solar Power Predictor
          </h1>
        </div>
        <p className="text-gray-700 text-lg">
          Estimate your power output based on solar radiation ☀️
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-md text-center border border-amber-200"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <label
  htmlFor="radiation"
  className="block text-lg font-semibold text-gray-700 mb-2"
>
  Enter Solar Radiation (W/m²)
</label>

<input
  id="radiation"
  name="radiation"
  type="number"
  step="any"
  value={radiation}
  onChange={(e) => setRadiation(e.target.value)}
  placeholder="e.g. 1361"
  required
  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
/>


        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          className="mt-5 w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-60 flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Predicting...
            </>
          ) : (
            <>
              Predict Power Output <Zap className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </motion.form>

      {error && (
        <motion.p className="mt-4 text-red-700 font-medium">
          {error}
        </motion.p>
      )}

      {powerOutput !== null && !isNaN(powerOutput) && (
        <motion.div className="mt-10 p-6 bg-amber-100 rounded-2xl shadow-xl w-full max-w-3xl text-center">
          <p className="text-xl font-semibold">Predicted Power Output</p>
          <h2 className="text-5xl font-extrabold text-amber-700 mt-2">
            ⚡ {powerOutput.toFixed(2)} kW
          </h2>

          {history.length > 0 && (
            <ResponsiveContainer width="100%" height={300} className="mt-6">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="radiation" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="powerOutput"
                  stroke="#f59e0b"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default App;
