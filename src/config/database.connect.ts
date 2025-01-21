import mongoose from "mongoose";

/**
 * Connects to the MongoDB database with the URI in the MONGO_DB environment variable.
 * If the MONGO_DB environment variable is not set, it throws an error.
 * It returns a Promise that resolves with a boolean value of true when the connection is established.

 * connection is successful, or rejects with an error if the connection
 * fails.
 *

 * Connects to the MongoDB database with the URI in the `MONGO_DB`
 * environment variable. If the variable is not set, it throws an error.
 */
const connectDB = async (): Promise<Boolean> => {
  return await new Promise((resolve, reject) => {
    const URI = process.env.MONGO_DB || "";
    // console.log(URI);
    if (URI == "") {
      throw new Error("mongod db uri not found!");
    }
    mongoose
      .connect(URI)
      .then(() => {
        console.log("DB Connected!");
        resolve(true);
      })
      .catch(reject);
  });
};
export default connectDB;
