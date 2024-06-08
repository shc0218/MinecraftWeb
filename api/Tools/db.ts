import {Database, sqlite3} from "sqlite3";
import {sleep} from "./Sleep";

const Sql: sqlite3 = require('sqlite3').verbose();
export class Db {
    db: Database = new Sql.Database("")
    ConnectDb() {
        this.db = new Sql.Database('./db.db');
    }
    CreateTable(TableName: string) {
        this.db.run(`CREATE TABLE IF NOT EXISTS ${TableName} (
        UUID TEXT UNIQUE , 
        UserName TEXT UNIQUE, 
        UserHealth INT, 
        UserLevel INT, 
        UserHungryLevel INT, 
        UserLocation TEXT);`
        );
    }
    InsertData(TableName: string, UUID: string, UserName: string, UserHealth: number, UserLevel: number, UserHungryLevel: number, UserLocation: Array<number>) {
        this.db.run(
            `INSERT INTO ${TableName} (UUID, UserName, UserHealth, UserLevel, UserHungryLevel, UserLocation)
                SELECT '${UUID}', '${UserName}', ${UserHealth}, ${UserLevel}, ${UserHungryLevel}, '[${UserLocation}]'
                WHERE NOT EXISTS (SELECT 1 FROM ${TableName} WHERE UUID = '${UUID}');`
        );
    }
    UpdateData(TableName: string, UUID: string, UserName: string, UserHealth: number, UserLevel: number, UserHungryLevel: number, UserLocation: Array<number>) {
        this.db.run(
            `UPDATE ${TableName} SET 
                UserName = '${UserName}', 
                UserHealth = ${UserHealth}, 
                UserLevel = ${UserLevel}, 
                UserHungryLevel = ${UserHungryLevel}, 
                UserLocation = '[${UserLocation}]' 
                WHERE UUID = '${UUID}';`
        );
    }
    GetAllData(TableName: string) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM ${TableName}`, [], (err: any, rows: any[]) => {
                let result: any = []
                rows.forEach((row: any) => {
                    let UserLocation: Array<any> = row["UserLocation"].replace("[", "").replace("]", "").split(",")
                    UserLocation.forEach((element: any) => {
                        UserLocation[UserLocation.indexOf(element)] = parseInt(element);
                    })
                    result.push({
                        "UUID": row["UUID"],
                        "UserName": row["UserName"],
                        "UserHealth": row["UserHealth"],
                        "UserLevel": row["UserLevel"],
                        "UserHungryLevel": row["UserHungryLevel"],
                        "UserLocation": UserLocation,
                    });
                });
                resolve(result);
            });
        });
    }
    GetUserData(TableName: string, UUID: string) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM ${TableName} WHERE UUID = '${UUID}';`, [], (err: any, rows: any) => {
                rows.forEach((row: any) => {
                    let UserLocation: Array<any> = row["UserLocation"].replace("[", "").replace("]", "").split(",")
                    UserLocation.forEach((element: any) => {
                        UserLocation[UserLocation.indexOf(element)] = parseInt(element);
                        resolve({
                            "UUID": row["UUID"],
                            "UserName": row["UserName"],
                            "UserHealth": row["UserHealth"],
                            "UserLevel": row["UserLevel"],
                            "UserHungryLevel": row["UserHungryLevel"],
                            "UserLocation": UserLocation,
                        });
                    })
                });
            });
        });
    }
    DeleteData(TableName: string, UUID: string) {
        this.db.run(
            `DELETE FROM ${TableName} WHERE UUID = '${UUID}';`
        );
    }


    DisconnectDb() {
        this.db.close()
    }
}
