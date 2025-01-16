import mongoose from "mongoose";

const connectDB = async (): Promise<Boolean> => {
  return await new Promise((resolve, reject) => {
    const URI = process.env.MONGO_DB || "";
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
