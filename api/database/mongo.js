// import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();
const MONGO_URL = "mongodb+srv://farhad:<KTRjOcoilyWv5cyh>@superteam.ueat2qt.mongodb.net";
// const MONGO_URL = "mongodb://localhost:27017/superteam";
export const mongoConnection = function (mongoose) {
    async function connectToMongo() {
        try {
            await mongoose.connect(MONGO_URL, {
            // auth: {
            //     username: "farhad",
            //     password: "KTRjOcoilyWv5cyh"
            // }
            });
        }
        catch (e) {
            console.error('mongoose connection err:', e);
        }
    }
    mongoose.connection.on('connected', () => {
        console.info('Connected to MongoDB!');
    });
    mongoose.connection.on('reconnected', () => {
        console.info('MongoDB reconnected!');
    });
    mongoose.connection.on('error', (error) => {
        console.error(`Error in MongoDb connection: ${error}`);
        mongoose.disconnect();
    });
    mongoose.connection.on('disconnected', () => {
        console.error(`MongoDB disconnected! Reconnecting in ${Number(process.env.MONGO_RECONNECT_INTERVAL) / 1000}s...`);
        setTimeout(() => connectToMongo(), Number(process.env.MONGO_RECONNECT_INTERVAL));
    });
    return {
        connectToMongo,
    };
};
