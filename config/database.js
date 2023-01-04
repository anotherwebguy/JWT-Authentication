import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const { MONGO_URI } = process.env;

const connect = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Successfully connected to database");
    } catch (error) {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
    }
};

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

db.once("open", function () {
    console.log("Connected to MongoDB");
});

export default connect;