import express from "express";
import cors from "cors";
import { config as configDotenv } from "dotenv";
import bodyParser from "body-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import { networkInterfaces } from 'os';
import connectToDatabase from "./src/Utils/db.js";
import prerender from "prerender-node";

// Routes
import UserRoutes from "./src/Routes/UserRoutes.js";
import BadgeRoutes from './src/Routes/BadgeRoutes.js';
import ActivityRoutes from './src/Routes/ActivityRoutes.js';
import ProfileRoutes from './src/Routes/ProfileRoutes.js';
import TesterRoutes from './src/Routes/TesterRoutes.js';
import AdminRoutes from './src/Routes/AdminRoutes.js';
import SubscriptionRoutes from './src/Routes/SubscriptionRoutes.js';
import ReferralRoutes from './src/Routes/ReferralRoutes.js';
import RewardRoutes from './src/Routes/RewardRoutes.js';
import OpenAIRoutes from './src/Routes/OpenAIRoutes.js';
import parentCoachRoutes from './src/Routes/parentCoachRoutes.js';
import cohortRoutes from './src/Routes/cohortRoutes.js';
import funnelRoutes from './src/Routes/funnelRoutes.js';

// Controllers
import { checkTrialStatuses, handleStripeWebhook } from "./src/Controllers/SubscriptionController.js";

// Cron
import cron from 'node-cron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

configDotenv();

// Connect to DB
connectToDatabase(process.env.MONGODB_URL);

// Initialize app
const app = express();

// Production settings
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Prerender
app.use(prerender.set("prerenderToken", process.env.PRERENDER_TOKEN));

// CORS
app.use(cors());

// Stripe webhook
app.post('/api/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Cron job
cron.schedule('0 0 * * *', () => {
    console.log('Checking trial statuses...');
    checkTrialStatuses();
});

// Test & Health routes
app.get('/api/test', (req, res) => {
    res.status(200).json({ 
        message: 'Server is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        server: 'online',
        database: 'connected',
        cors: 'enabled',
        auth: 'JWT Bearer tokens only'
    });
});

// Routes
app.use('/api', UserRoutes);
app.use('/api', BadgeRoutes);
app.use('/api', ActivityRoutes);
app.use('/api', ProfileRoutes);
app.use('/api', TesterRoutes);
app.use('/api', AdminRoutes);
app.use('/api', SubscriptionRoutes);
app.use('/api', ReferralRoutes);
app.use('/api', RewardRoutes);
app.use('/api', OpenAIRoutes);
app.use("/api", parentCoachRoutes);
app.use("/api", cohortRoutes);
app.use("/api", funnelRoutes);

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

export default app;
