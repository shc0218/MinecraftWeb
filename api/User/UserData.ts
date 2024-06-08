import {Request, Response} from "express";
import {Db} from "../Tools/db"
import {sleep} from "../Tools/Sleep"

var express = require('express');
var router = express.Router();
const TableName: string = "OnlineUserData";

router.post("/set", (req: Request, res: Response) => {
        const dataBase: Db = new Db();
        if (
            Object.keys(req.body).includes('UUID') &&
            Object.keys(req.body).includes('UserId') &&
            Object.keys(req.body).includes('UserHealth') &&
            Object.keys(req.body).includes('UserLevel') &&
            Object.keys(req.body).includes('UserHungryLevel') &&
            Object.keys(req.body).includes('UserLocation')
        ){
            dataBase.ConnectDb()
            dataBase.CreateTable(TableName)
            sleep(0.1)
            dataBase.InsertData(
                TableName,
                req.body["UUID"],
                req.body["UserId"],
                req.body["UserHealth"],
                req.body["UserLevel"],
                req.body["UserHungryLevel"],
                req.body["UserLocation"]
            )
            sleep(0.1)
            dataBase.DisconnectDb()
            res.status(200).send({status: "success"});
        } else {
            res.status(411).send({error: "Invalid Request"});
        }

    }
);

router.post("/getAll", async (req: Request, res: Response) => {
    const dataBase: Db = new Db();
    dataBase.ConnectDb()
    const UserData: any = await dataBase.GetAllData(TableName)
    dataBase.DisconnectDb()
    res.send(UserData);
})

router.post("/getUser", async (req: Request, res: Response) => {
    const dataBase: Db = new Db();
    if (Object.keys(req.body).includes('UUID')) {
        dataBase.ConnectDb()
        const UserData: any = await dataBase.GetUserData(TableName, req.body["UUID"]);
        dataBase.DisconnectDb()
        res.status(200).send(UserData);
    } else {
        res.status(411).send({error: "Invalid Request"});
    }

})

router.post("/update", (req: Request, res: Response) => {
        const dataBase: Db = new Db();
        if (
            Object.keys(req.body).includes('UUID') &&
            Object.keys(req.body).includes('UserId') &&
            Object.keys(req.body).includes('UserHealth') &&
            Object.keys(req.body).includes('UserLevel') &&
            Object.keys(req.body).includes('UserHungryLevel') &&
            Object.keys(req.body).includes('UserLocation')
        ){
            dataBase.ConnectDb()
            dataBase.UpdateData(
                TableName,
                req.body["UUID"],
                req.body["UserId"],
                req.body["UserHealth"],
                req.body["UserLevel"],
                req.body["UserHungryLevel"],
                req.body["UserLocation"]
            )
            sleep(0.1)
            dataBase.DisconnectDb();
            res.status(200).send({status: "success"});
        } else {
            res.status(411).send({error: "Invalid Request"});
        }
    }
);
router.post("/delete", (req: Request, res: Response) => {
    const dataBase: Db = new Db();
    if (Object.keys(req.body).includes('UUID')) {
        dataBase.ConnectDb();
        dataBase.DeleteData(TableName, req.body["UUID"]);
        sleep(0.1);
        dataBase.DisconnectDb();
    } else {
        res.status(411).send({error: "Invalid Request"});
    }
})

module.exports = router;