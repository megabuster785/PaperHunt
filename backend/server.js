const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const cors=require('cors');
const connectDB=require('./config/db');
const paperRoutes = require('./routes/papers');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const path = require('path');


// loading environment variables
dotenv.config();

// connecting to mongodb
connectDB();

const app=express();
app.use(cors({origin:'http://localhost:3000', credentials:true}));
app.use(express.json());
app.use('/api/papers', paperRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.get('/',(req,res)=>{
    res.send('PaperHunt backend is running');
});

app.use("/api/papers",require("./routes/papers"));

const PORT=process.env.PORT||5000;
app.listen(PORT,()=>console.log(`server started on port ${PORT}`));
