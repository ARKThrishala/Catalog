import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.util.HashMap;
import java.util.Map;

public class ShamirSecretSharing {

    public static void main(String[] args) {
        String jsonInput = """
            {
                "keys": {
                    "n": 4,
                    "k": 3
                },
                "1": {
                    "base": "10",
                    "value": "4"
                },
                "2": {
                    "base": "2",
                    "value": "111"
                },
                "3": {
                    "base": "10",
                    "value": "12"
                },
                "6": {
                    "base": "4",
                    "value": "213"
                }
            }
        """;

        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(jsonInput, JsonObject.class);
        JsonObject keys = jsonObject.getAsJsonObject("keys");
        int n = keys.get("n").getAsInt();
        int k = keys.get("k").getAsInt();

        // Map to store decoded points
        Map<Double, Double> points = new HashMap<>();

        // Decode each point
        for (Map.Entry<String, JsonElement> entry : jsonObject.entrySet()) {
            if (!entry.getKey().equals("keys")) {
                JsonObject point = entry.getValue().getAsJsonObject();
                int base = point.get("base").getAsInt();
                String value = point.get("value").getAsString();
                double x = Double.parseDouble(entry.getKey());
                double y = decodeValue(value, base);
                points.put(x, y);
            }
        }

        // Calculate the constant term
        double c = calculateConstantTerm(points, k);
        System.out.println("The constant term (c) of the polynomial is: " + c);
    }

    // Function to decode a value from a given base
    private static double decodeValue(String value, int base) {
        return Integer.parseInt(value, base);
    }

    // Function to calculate the constant term from given points using Lagrange interpolation
    private static double calculateConstantTerm(Map<Double, Double> points, int k) {
        double c = 0;

        for (Map.Entry<Double, Double> entry : points.entrySet()) {
            double x = entry.getKey();
            double y = entry.getValue();
            c += y * lagrangeBasis(points, x);
        }
        
        return c;
    }

    // Lagrange basis polynomial
    private static double lagrangeBasis(Map<Double, Double> points, double x) {
        double basis = 1;

        for (double xi : points.keySet()) {
            if (xi != x) {
                basis *= (0 - xi) / (x - xi);
            }
        }

        return basis;
    }
}
