import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import { CorsConfig } from '../config/cors.js';
export default function (app, express) {
    app.use(helmet());
    const whitelist = CorsConfig.whitelist;
    const corsOptions = {
        origin: function (origin, callback) {
            if (origin && whitelist.indexOf(origin) !== -1)
                callback(null, true);
            else
                callback(null, false);
        },
        methods: CorsConfig.methods,
        optionsSuccessStatus: CorsConfig.optionsSuccessStatus,
        credentials: CorsConfig.credentials,
        allowedHeaders: CorsConfig.allowedHeaders
    };
    app.use(cors(corsOptions));
    app.use(compression({
        filter: (req, res) => {
            if (req.headers['x-no-compression']) {
                return false; // don't compress responses if this request header is present
            }
            return compression.filter(req, res); // fallback to standard compression
        },
    }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.use(express.json({
        limit: '50mb'
    }));
}
