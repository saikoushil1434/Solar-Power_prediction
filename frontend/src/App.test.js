import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

// ✅ Mock axios safely
jest.mock("axios", () => ({
  post: jest.fn(() =>
    Promise.resolve({
      data: { powerOutput: 245.5 }, // backend mock response
    })
  ),
}));

test("renders Solar Power Predictor heading", () => {
  render(<App />);
  const heading = screen.getByText(/Solar Power Predictor/i);
  expect(heading).toBeInTheDocument();
});

test("accepts radiation input and displays prediction", async () => {
  render(<App />);

  const input = screen.getByPlaceholderText(/Enter solar radiation/i);
  fireEvent.change(input, { target: { value: "850" } });

  const button = screen.getByText(/Predict Power Output/i);
  fireEvent.click(button);

  // Wait for result display
  const result = await waitFor(() =>
    screen.getByText(/245.50 kW/i)
  );

  expect(result).toBeInTheDocument();
});
