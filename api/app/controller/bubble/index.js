import Cache from "../../models/cache.js";
import { AppConfig } from "../../../config/app.js";
import { takeScreenshot } from "../../services/screenshot.js";
export const GetBubbleMap = async (req, res) => {
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
            section: "bubble_map",
            key: address
        });
        if (cachedData) {
            const isCacheValid = Date.now() - new Date(cachedData.createdAt).getTime() < AppConfig.cache_duration_in_sec * 1000;
            if (isCacheValid) {
                res.json({
                    data: cachedData.data
                });
                return;
            }
        }
        const screen_shot_string_base64 = await takeScreenshot(address);
        if (screen_shot_string_base64) {
            Cache.create({
                section: "bubble_map",
                key: address,
                data: screen_shot_string_base64,
                createdAt: new Date()
            }).then(() => {
                //
            }).catch(() => {
                //
            });
        }
        res.send({
            data: screen_shot_string_base64
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
