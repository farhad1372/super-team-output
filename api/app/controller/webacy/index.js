import axios from "axios";
import { urlJoinP } from 'url-join-ts';
import { WebacyConfig } from "../../../config/webacy.js";
import Cache from "../../models/cache.js";
import { AppConfig } from "../../../config/app.js";
export const getThreatConsiderations = async (req, res) => {
    var _a, _b, _c, _d;
    try {
        const address = req.params.address ? String(req.params.address).trim() : "";
        if (!address || address.length <= 10) {
            res.status(400).json({
                message: "Address is required"
            });
            return;
        }
        const cachedData = await Cache.findOne({
            section: "webacy",
            key: address
        });
        if (cachedData) {
            const isCacheValid = Date.now() - new Date(cachedData.createdAt).getTime() < AppConfig.cache_duration_in_sec * 1000;
            console.log({ isCacheValid });
            if (isCacheValid) {
                res.json({
                    data: cachedData.data
                });
                return;
            }
        }
        const data = await axios.get(urlJoinP(WebacyConfig.baseUrl, ["addresses", address]), {
            headers: {
                "x-api-key": WebacyConfig.token,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        //* Save to Cache (Async)
        Cache.create({
            section: "webacy",
            key: address,
            data: data.data,
            createdAt: new Date()
        }).then(() => {
            //
        }).catch(() => {
            //
        });
        res.json({
            data: data.data
        });
        return;
    }
    catch (e) {
        if (typeof e === "object" && ((_b = (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message)) {
            res.status(400).send({
                message: (_d = (_c = e === null || e === void 0 ? void 0 : e.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message,
                reason: e
            });
            return;
        }
        res.status(500).send({
            message: "Something went wrong",
            reason: e
        });
    }
};
