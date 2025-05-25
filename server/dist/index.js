"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const vehicleRoutes_1 = __importDefault(require("./routes/vehicleRoutes"));
const migrator_1 = require("drizzle-orm/better-sqlite3/migrator");
const db_1 = require("./db");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/vehicles', vehicleRoutes_1.default);
// Initialize database and run migrations
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Run migrations
        const migrationsFolder = path_1.default.join(process.cwd(), 'drizzle');
        (0, migrator_1.migrate)(db_1.db, { migrationsFolder });
        console.log('Database migrations completed successfully');
    }
    catch (error) {
        console.error('Database migration error:', error);
    }
});
// Start server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield initializeDatabase();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Using SQLite database: ${path_1.default.join(process.cwd(), 'fleet-management.db')}`);
    });
});
startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
// Graceful shutdown
const gracefulShutdown = () => {
    db_1.sqlite.close();
    process.exit(0);
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
