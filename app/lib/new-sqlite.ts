/**
 * Encapsulation for sqlite module
 * 
 * @author HissYu(Yu Haixin)
 */

import sqlite from 'react-native-sqlite-storage'

sqlite.enablePromise(true);
sqlite.DEBUG(true); // NOTE: Delete this before release
type ActionName = String
type ErrorMessage = Object
type SuccessCallback = (action: ActionName) => {}
type FailedCallback = (action: ActionName, error: ErrorMessage) => {}
type DatabaseConfig = {
    name: String,
    success: SuccessCallback,
    failed: FailedCallback
}
type TableConfig = {
    name: String,
    fields: {}
}

let whenSuccess=(action:string)=>{}
let whenFailed=(action:string,err:ErrorMessage)=>{}

export default class Sqlite{
    db:sqlite.SQLiteDatabase;
    dbConfig: DatabaseConfig;
    _tableName: string;
    _tableField: string[];
    _tableWhere: string[];
    _tableOffset: number;
    _tableLimit: number;
    _tableOrderBy:string[];
    _tableOrderWay: string;
    _tableGroupBy: string[];

    constructor(dbConfig:DatabaseConfig){
        this.dbConfig = dbConfig;
        this._tableName = "";
        this._tableField = [];
        this._tableWhere = [];
        this._tableOffset = 0;
        this._tableLimit = 0;
        this._tableOrderBy = [];
        this._tableOrderWay = 'ASC';
        this._tableGroupBy = [];
        this.afterQuery();

        if (this.dbConfig) {
            whenSuccess = this.dbConfig.success ? this.dbConfig.success : (action) => {
                console.log(action + " success");
            };
            delete this.dbConfig.success;

            whenFailed = this.dbConfig.failed ? this.dbConfig.failed : (action, err) => {
                console.log(action + " failed");
                console.log('ERR: ', err);
            };
            delete this.dbConfig.failed;

            this.open();
        }
    }
    /**
     * Clear query conditions
     */
    afterQuery() {
        this._tableName = "";
        this._tableField = ["*"];
        this._tableWhere = [""];
        this._tableOffset = 0;
        this._tableLimit = 0;
        this._tableOrderBy = [];
        this._tableOrderWay = 'ASC';
        this._tableGroupBy = [];
    }
    /**
     * Open database
     */
    async open() {
        this.db = sqlite.openDatabase(this.dbConfig)
            .then(db=>{
                whenSuccess('open')
                return db;
            })
            .catch(err => {
                whenFailed('open', err)
            });
    }
}