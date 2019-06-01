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
// type SqliteClass={
//     db:SqliteDatabase,

// }

let whenSuccess=()=>{}
let whenFailed=()=>{}

export default class Sqlite {
    constructor(database_config: DatabaseConfig) {
        this.db;
        this.dbConfig = database_config;
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
        this.db = await sqlite.openDatabase(this.dbConfig).catch(err => {
            whenFailed('open', err)
        });
    }

    /**
     * Close database
     */
    async close() {
            await this.db;
            try {
                this.db.close().then(() => {
                    this.db = null;
                    whenSuccess("close");
                });
            } catch (err) {
                whenFailed("close", err);
            }
        }

        /**
         * indicate table's name
         * @param {String} table_name 
         */
        in (table_name) {
            this._tableName = table_name;
            return this;
        }
    /**
     * indicate shown fields
     * @param {[String]} fields 
     */
    field(...fields) {
        fields = fields[0] instanceof Array ? fields[0] : fields;
        this._tableField = fields;
        return this;
    }
    /**
     * filtrate data to shown
     * @param {[String]} condition 
     */
    where(...condition) {
        condition = condition[0] instanceof Array ? condition[0] : condition;
        this._tableWhere = condition;
        return this;
    }
    limit(limit, offset = 0) {
        this._tableOffset = offset;
        this._tableLimit = limit;
        return this;
    }
    orderedBy(columnsAndOrder:string) {
        // columnsAndOrder = columnsAndOrder[0] instanceof Array ? columnsAndOrder[0] : columnsAndOrder;
        // const reg = /asc|ASC|desc|DESC/;
        // if (columnsAndOrder[columnsAndOrder.length - 1].match(reg)) {
        //     this._tableOrderWay = columnsAndOrder.splice(columnsAndOrder.length - 1, 1)[0];
        // }
        this._tableOrderBy = columnsAndOrder;
        return this;
    }
    groupBy(...columns) {
        columns = columns[0] instanceof Array ? columns[0] : columns;
        this._tableGroupBy = columns;
        return this;
    }

    // tableExists(table_name){
    //     let sql = '.tables'
    //     this.db.executeSql(sql).then(rec=>{
    //         console.log(rec);
    //     }).catch(err=>whenFailed('show',err))
    // }

    /**
     * Create new table
     * @param {TableConfig} table_config Configuration of table to create
     */
    async createTable(table_config: TableConfig) {
        let fields = table_config.fields;

        let f = [];
        for (let k in fields) {
            f.push(`${k} ${fields[k]}`);
        }

        const sql = `CREATE TABLE IF NOT EXISTS ${table_config.name}(${f.join(',')});`;

        await this.db;
        try {
            this.db.executeSql(sql).then(() => {
                whenSuccess("creation");
            })
        } catch (err) {
            whenFailed("creation", err);
        }
    }
    /**
     * drop specific table
     * @param {String} table_name name of table to drop
     */
    async dropTable(table_name) {
        const sql = `DROP TABLE ${table_name}`;

        await this.db;
        try {
            this.db.executeSql(sql).then(() => {
                whenSuccess("drop");
            });
        } catch (err) {
            whenFailed("drop", err);
        }
    }
    /**
     *  insert given data and return its(their) ID or false (when failed)
     * @param {Object|[Object]} inserted_data lines of data
     * @returns {Promise<false> | Promise<Number|[Number]>} failed | inserted item's(items') id
     */
    async insert(inserted_data) {
        const data = inserted_data instanceof Array ? inserted_data : [inserted_data];
        // console.log('11111111',this._tableName);
        const tName = this._tableName;
        await this.db;
        try {
            let results = [];
            await this.db.transaction(tx => {
                data.forEach((v, i) => {
                    let fields = [];
                    let values = [];

                    for (let k in v) {
                        fields.push(k);
                        values.push(v[k]);
                    }
                    // console.log('222222',this._tableName);
                    
                    const sql = `INSERT INTO ${tName} (${fields.join(',')}) VALUES (${fields.map(v=>v&&'?').join(',')});`;

                    tx.executeSql(sql, values).then(res => {
                        results.push(res[1].insertId);
                    }).catch(err => {
                        whenFailed(`insert[${i}]`, err);
                    });
                });
            });

            this.afterQuery();

            results = results.length === 1 ? results[0] : results;
            
            return results;
        } catch (err) {
            whenFailed('all inserts', err);
            return false;
        }
    }

    /**
     * select data
     * @returns {Promise<false> | Promise<DataArray>}
     */
    async select() {
        if (!this._tableWhere.toString()) this._tableWhere = ['1'];

        const limit = this._tableLimit === 0 ? '' : ` LIMIT ${this._tableLimit}`;
        const offset = this._tableOffset === 0 ? '' : ` OFFSET ${this._tableOffset}`;
        const orderBy = !this._tableOrderBy.toString() ? '' : ` ORDER BY ${this._tableOrderBy}`;
        const groupBy = !this._tableGroupBy.toString() ? '' : ` GROUP BY ${this._tableGroupBy.join(',')}`;

        const sql = `SELECT ${this._tableField.join(',')} FROM ${this._tableName} WHERE ${this._tableWhere.join(' AND ')}${groupBy}${orderBy}${limit}${offset};`;
        this.afterQuery();

        // let ret;
        // while(!this.db){
        //     await this.open();
        //     console.log('reopening DB');
            
        // }
        await this.db
        try {
            const result = await this.db.executeSql(sql,[]).then(res => {
                whenSuccess("select");
                // console.log('res:',);
                return res[0].rows.raw();
            }).catch(err => {
                whenFailed("select", err);
                return false;
            })

            return result.length===0?false:result;
        } catch (err) {
            whenFailed("select", err);
            return false;
        }
    }

    /**
     *  update given data and return its ID or false (when failed)
     * @param {Object} updated_data single line of data
     * @returns {Promise<false> | Promise<Number>} failed | affected rows' count
     */
    async update(updated_data) {
        if (!this._tableWhere.toString()) {
            whenFailed("update", "condition cannot be null");
            return false;
        }
        let fields = [];
        let values = [];
        for (let k in updated_data) {
            fields.push(k);
            values.push(updated_data[k]);
        }
        const sql = `UPDATE ${this._tableName} SET ${fields.map((val)=>(val+'='+'?')).join(',')} WHERE ${this._tableWhere.join(' AND ')};`;
        this.afterQuery();

        await this.db;
        try {
            const result = await this.db.executeSql(sql).then(res => {
                whenSuccess("update");

                return res[0].rowsAffected;
            }).catch(err => {
                whenFailed("update", err);
                return false;
            })

            return result;
        } catch (err) {
            whenFailed("update", err);
            return false;
        }
    }

    /**
     * delete certain line
     * @returns {Promise<false> | Promise<Number>} failed | affected rows' count
     */
    async delete() {
        if (!this._tableWhere.toString()) {
            whenFailed("delete", "condition cannot be null");
            return false;
        }
        const sql = `DELETE FROM ${this._tableName} WHERE ${this._tableWhere.join(' AND ')};`;
        this.afterQuery();
        await this.db;
        try {
            const result = await this.db.executeSql(sql).then(res => {
                whenSuccess("delete");

                return res[0].rowsAffected;
            }).catch(err => {
                whenFailed("delete", err);
                return false;
            })

            return result;
        } catch (err) {
            whenFailed("delete", err);
            return false;
        }
    }
    /**
     * Method for complex functionalities
     * @param {String} sql Sql statement you want to execute, `?` for parameter holder
     * @param {Array<Any>} params parameter should be given in same order
     */
    async execRaw(sql:string,params:any[]=[]){
        try {
            const result = await this.db.executeSql(sql,params).then(res => {
                whenSuccess("exec");
                return res;
            }).catch(err => {
                whenFailed("exec", err);
                return false;
            })

            return result;
        } catch (err) {
            whenFailed("exec", err);
            return false;
        }
    }
}