const Database = {
    name:'Balanced',
    // success:()=>{},
    // failed:()=>{}
}

const TableBasicAccounting = {
    name: 'BaseTable',
    fields: {
        'id': 'INTEGER PRIMARY NOT NULL AUTOINCREAMENT',
        'amount': 'DECIMAL NOT NULL',
        'note': 'TEXT',
        'method': 'CHARACTER(6)', // AliPay, WeChat, Cash
        'usage': 'CHARACTER(13) NOT NULL', // Entertainment, Catering, Education, Loan, Clothing, Daily Expense 
        'tags': 'TEXT',
        'cycleCount': 'INTEGER',
        'cycleUnit': 'CHARACTER(5)', // Month, Week, Day
        'firstTime': 'INTEGER NOT NULL',
        'nextTriggerTime': 'INTEGER',
    }
}
const BaseTableFieldTitle = {
    method:['AliPay','WeChat','Cash'],
    usage:['Entertainment','Catering','Education','Loan','Clothing','Daily Expense'],
    cycleUnit:['Year','Month','Week','Day']
}

const TableTags = {
    name: 'TagTable',
    fields:{
        'id': 'INTEGER PRIMARY NOT NULL AUTOINCREAMENT',
        'title': 'TEXT',
    }
}

const AppSettings = {
    name: 'SettingsTable',
    fields:{
        'location': 'CHARACTER(15)',
        'today': 'INTEGER'
    }
}

const DBVersion = '1.0.0';
export {
    Database,
    DBVersion,
    TableBasicAccounting,
    BaseTableFieldTitle,
    TableTags,
    AppSettings
};