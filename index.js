const express = require ("express");
const cors = require("cors");
const mongoose = require("mongoose");
const UserRegistrationRouter = require("./Routers/UserRegisterationRouter")
const UserOtpVerfication = require("./Routers/UserOtpVerificationRouter")
const CompleteRegistrationRouter = require("./Routers/CompleteRegistrationRouter")


const bodyParser = require('body-parser');

const app = express();

require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());





const PORT = 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());


app.use("/api/v1",UserRegistrationRouter);
app.use("/api/v1",UserOtpVerfication);
app.use("/api/v1",CompleteRegistrationRouter);








app.get('/', (req, res) => {
    res.send('Hello from Express');
  });












const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://shahabsaqib220:Pakistan1122@cluster0.2nxi7.mongodb.net/",{
           
        })
        console.log("MongoDb Connected");
    
        
    } catch (error) {
        console.error("Eorror While Connecting", error)
        
    }

}

// Start server and connect to DB
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
  });


