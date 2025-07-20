"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./src/routes/user"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// MongoDB connection
const mongoDb = "mongodb://127.0.0.1:27017/testdb";
mongoose_1.default.connect(mongoDb);
mongoose_1.default.Promise = Promise;
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use('/api', user_1.default);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
