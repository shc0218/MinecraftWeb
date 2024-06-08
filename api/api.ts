import {Request, Response} from "express";

const UserDataRouter = require("./User/UserData.ts");
var express = require('express');
var router = express.Router();
router.use("/User", UserDataRouter)

module.exports = router;