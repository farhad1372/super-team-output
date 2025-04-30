import Cache from "../../models/cache.js";
import { AppConfig } from "../../../config/app.js";
import { TokenData } from "../../services/tokenData.js";
export const MakeTokenData = async (req, res) => {
    var _a, _b, _c, _d;
    try {
        const address = req.params.address ? String(req.params.address).trim() : "";
        if (!address || address.length <= 10) {
            res.status(400).json({
                message: "Address is required",
            });
            return;
        }
        const cachedData = await Cache.findOne({
            section: "coingecko",
            key: address,
        });
        if (cachedData) {
            console.log("sssssssssssssss 11");
            const isCacheValid = Date.now() - new Date(cachedData.createdAt).getTime() < AppConfig.cache_duration_in_sec * 1000;
            console.log("sssssssssssssss 22");
            if (isCacheValid) {
                console.log("sssssssssssssss 33");
                res.json({
                    data: cachedData.data,
                });
                return;
            }
        }
        console.log("sssssssssssssss 44");
        const token_data = new TokenData(address);
        const data = await token_data.getDataFromCoingecko(true);
        if (!data.success) {
            res.status(400).send({ message: data.message });
            return;
        }
        Cache.create({
            section: "coingecko",
            key: address,
            data: data === null || data === void 0 ? void 0 : data.data,
            createdAt: new Date(),
        })
            .then(() => {
            //
        })
            .catch(() => {
            //
        });
        res.send({
            data: data === null || data === void 0 ? void 0 : data.data,
        });
        return;
    }
    catch (e) {
        if (typeof e === "object" && ((_b = (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message)) {
            res.status(400).send({
                message: (_d = (_c = e === null || e === void 0 ? void 0 : e.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message,
                reason: e,
            });
            return;
        }
        res.status(500).send({
            message: "Something went wrong",
            reason: e,
        });
    }
};
