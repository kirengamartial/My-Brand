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
exports.checkUser = exports.checkAuth = void 0;
const Users_1 = __importDefault(require("../model/Users"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const checkAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).redirect('/');
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decodedInfo) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err.message);
            return res.status(500).send("Internal Server Error");
        }
        try {
            const user = yield Users_1.default.findById(decodedInfo.id);
            if (!user || !user.isAdmin) {
                return res.redirect("back");
            }
            next();
        }
        catch (error) {
            console.error("Error retrieving user:", error);
            return res.status(500).send("Internal Server Error");
        }
    }));
};
exports.checkAuth = checkAuth;
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decodedinfo) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                res.locals.user = null;
                next();
            }
            else {
                let user = yield Users_1.default.findById(decodedinfo.id);
                res.locals.user = user;
                next();
            }
        }));
    }
    else {
        res.locals.user = null;
        next();
    }
};
exports.checkUser = checkUser;
