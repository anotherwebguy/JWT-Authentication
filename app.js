import express from "express";
import connect from "./config/database.js";
import User from "./model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "./middleware/auth.js";
import dotenv from 'dotenv';
dotenv.config()

// Connect to database
connect();

const app = express();

app.use(express.json());

// Logic goes here
app.post("/register", async (req, res) => {
// our register logic goes here...
   try {
        const { name, email, password } = req.body;

        if (!(email && password && name)) {
            res.status(400).send("All input is required");
        }
        
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }
        
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
            token: "",
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Login
app.post("/login", async(req, res) => {
// our login logic goes here
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).send("All input is required");
        }

        // Validate if user exist in our database
        const user = await User.findOne ({ email });   

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            // save user token
            user.token = token;

            // user
            res.status(200).json(user);
        } else res.status(400).send("Invalid Credentials");
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }

});

app.get("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

// This should be the last route else any after it won't work
app.use("*", (req, res) => {
    res.status(404).json({
      success: "false",
      message: "Page not found",
      error: {
        statusCode: 404,
        message: "You reached a route that is not defined on this server",
      },
    });
});

export default app;