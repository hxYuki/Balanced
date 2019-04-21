/**
 * Encapsulation for sqlite module
 * 
 * @author HissYu(Yu Haixin)
 */

import sqlite from 'react-native-sqlite-storage'

sqlite.enablePromise(false);

sqlite.DEBUG(true); // NOTE: Delete this before release


export default class Sqlite {
    constructor(database_config) {
        this.db;
        this.dbConfig = database_config;
        this._tableName = "";
        this._tableField = "";
        this._tableWhere = "";
        this.afterQuery();

        
        if (this.dbConfig) {
            this.whenSuccess = this.dbConfig.success ? this.dbConfig.success : (action) => {
                console.log(action + " success");
            };
            delete this.dbConfig.success;

            this.whenFailed = this.dbConfig.failed ? this.dbConfig.failed : (action, err) => {
                console.log(action + " failed");
                console.log('ERR: ',err);
            };
            delete this.dbConfig.failed;
            
            this.open();
        }
    }

    afterQuery(){
        this._tableName = "";
        this._tableField = ["*"];
        this._tableWhere = [""];
    }

    open() {
        // let DB;
        this.db = sqlite.openDatabase(this.dbConfig, () => {
            this.whenSuccess('open');
        }, (er) => {
            this.whenFailed('open', err);
        });
        // this.db = sqlite.openDatabase(this.dbConfig).catch(err=>{this.whenFailed('open',err)});
        
    }

    close() {
        this.db.close(() => {
            this.db = null;
            this.whenSuccess("close");
        },err => {
            this.whenFailed("close",err);
        });

    }

    /**
     * indicate table's name
     * @param {String} table_name 
     */
    in(table_name) {
        this._tableName = table_name;
        return this;
    }
    /**
     * indicate shown fields
     * @param {[String]} fields 
     */
    field(fields) {
        this._tableField = typeof fields === 'string' ? [fields] : fields;
        return this;
    }
    /**
     * filtrate data to shown
     * @param {[String]} condition 
     */
    where(condition) {
        this._tableWhere = typeof condition === 'string' ? [condition] : condition;
        return this;
    }

    // tableExists(table_name){
    //     let sql = '.tables'
    //     this.db.executeSql(sql).then(rec=>{
    //         console.log(rec);
    //     }).catch(err=>this.whenFailed('show',err))
    // }

    async createTable(table_config) {
        let fields = table_config.fields;
        
        let f=[];
        for(let k in fields){
            f.push(`${k} ${fields[k]}`);
        }

        let sql = `CREATE TABLE IF NOT EXISTS ${table_config.name}(${f.join(',')});`;
        

        this.db.executeSql(sql,[],() => {
            this.whenSuccess("creation");
            // this.in(table_config.name);
        },err => {
            this.whenFailed("creation",err);
        });
        
        
    }

    dropTable(table_name) {
        let sql = `DROP TABLE ${table_name}`;

        this.db.executeSql(sql,[],() => {
            this.whenSuccess("drop");
        },err => {
            this.whenFailed("drop",err);
        });
    }

    insert(inserted_data) {
        let fields = [];
        let values = [];
        // console.log(inserted_data);
        for(let k in inserted_data){
            fields.push(k);
            values.push(inserted_data[k]);
        }
        let sql = `INSERT INTO ${this._tableName} (${fields.join(',')}) VALUES (${fields.map(v=>v&&'?').join(',')});`;
        this.afterQuery();
        
        this.db.executeSql(sql,values,(res) => {
            this.whenSuccess("insert");
            
            return res.insertId;
        },err => {
            this.whenFailed("insert",err);
        });
    }

    select(receiver) {        
        if(!this._tableWhere.toString()) this._tableWhere=['1'];
        let sql=`SELECT ${this._tableField.join(',')} FROM ${this._tableName} WHERE ${this._tableWhere.join(' AND ')};`;
        this.afterQuery();
        
        // let ret;

        this.db.executeSql(sql,[],(res) => {
            receiver(res.rows.raw());
            this.whenSuccess("select");
        },err => {
            this.whenFailed("select",err);
        });

        // return ret;
    }

    update(updated_data) {
        if(!this._tableWhere.toString()) {
            this.whenFailed("update","condition cannot be null");
            return false;
        }
        let fields=[]; let values=[];
        for(let k in updated_data){
            fields.push(k);
            values.push(updated_data[k]);
        }
        let sql=`UPDATE ${this._tableName} SET ${fields.map((val)=>(val+'='+'?')).join(',')} WHERE ${this._tableWhere.join(' AND ')};`;
        this.afterQuery();
        
        this.db.executeSql(sql,values,(res) => {
            this.whenSuccess("update");
            
            return res.rowsAffected;
        },err => {
            this.whenFailed("update",err);
        });
    }

    delete() {
        if(!this._tableWhere.toString()) {
            this.whenFailed("delete","condition cannot be null");
            return false;
        }
        let sql=`DELETE FROM ${this._tableName} WHERE ${this._tableWhere.join(' AND ')};`;
        this.afterQuery();
        
        this.db.executeSql(sql,[],(res) => {
            this.whenSuccess("delete");
            
            return res.row;
        },err => {
            this.whenFailed("delete",err);
        });
    }
}