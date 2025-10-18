import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route";
import { errorHandler } from "./middleware/error_handler";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api", userRoutes);

// middleware global d’erreurs en dernier
app.use(errorHandler);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
