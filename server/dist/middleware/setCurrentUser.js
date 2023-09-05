"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCurrentUser = void 0;
const setCurrentUser = (req, res, next) => {
    res.locals.currentUser = req.user;
    next();
};
exports.setCurrentUser = setCurrentUser;
