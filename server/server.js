const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 8080;

app.use(cors());

app.get("/api/home", (_req, res) => {
  res.json({
    countryStats: [
      { country: "Australia", avgCo2: 17.1 },
      { country: "China", avgCo2: 7.38 },
      { country: "Germany", avgCo2: 9.44 },
      { country: "India", avgCo2: 1.91 },
      { country: "Singapore", avgCo2: 8.56 },
      { country: "South Africa", avgCo2: 6.95 },
      { country: "United Kingdom", avgCo2: 5.5 },
      { country: "United States", avgCo2: 15.5 },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
