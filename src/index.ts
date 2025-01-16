import express, { Express, Request } from "express";
import connectDB from "./config/database.connect";
import { loadConfig } from "./config/config.env";
import route from "./routes";
import { IUser } from "./common/dto/user.dto";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

const app = express();
declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Add the user field to the Request interface, which will be of type IUser
    }
  }
}
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "swagger_output.json"), "utf8")
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", (req, res) => {
  res.send("WELCOME TO CAR RENTAL SERVICE");
});
app.use(express.json());
const init = async () => {
  loadConfig();
  await connectDB();
  const PORT = process.env.PORT || 4000;
  app.use("/api", route);
  app.listen(PORT, () => {
    console.log("Server Start at port " + PORT);
  });
};
init();
