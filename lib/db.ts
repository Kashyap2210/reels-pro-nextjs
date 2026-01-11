import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;
console.log("MONGODB_URL", MONGODB_URL);

if (!MONGODB_URL) {
  throw new Error("Please define MongoDB URL in the env file.");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached && cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: true,
      maxPoolSize: 10,
    };
    cached.promise = mongoose
      .connect(MONGODB_URL, options)
      .then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.log("Error during connection", error);
    cached.promise = null;
    throw new Error("Check DataBase File");
  }

  return cached.conn;
}
