const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

const analyzeRoutes = require('./routes/analyze');

dotenv.config();

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'https://nutriai-black.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(express.json());

app.use(analyzeRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));