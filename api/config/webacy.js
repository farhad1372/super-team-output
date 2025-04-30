import dotenv from "dotenv";
dotenv.config();
export const WebacyConfig = {
    baseUrl: process.env.WEBACY_BASE_URL || "https://api.webacy.com",
    token: process.env.WEBACY_TOKEN || "9vyfuhcM1v5pCakBtUMEfaROK3EUuR2S2s0mpfQJ",
};
