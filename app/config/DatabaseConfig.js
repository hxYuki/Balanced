const DatabaseConfig = {
    name:'Balanced'
    // success:()=>{},
    // failed:()=>{}
}

const TableBasicAccounting = {
    name: 'BaseTable',
    fields: {
        'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
        'amount': 'DECIMAL NOT NULL',
        'note': 'TEXT',
        'method': 'INTEGER NOT NULL', // AliPay, WeChat, Cash
        'usage': 'INTEGER NOT NULL', // Entertainment, Catering, Education, Loan, Clothing, Daily Expense 
        'tags': 'TEXT',
        'cycleCount': 'INTEGER',
        'cycleUnit': 'INTEGER', // Month, Week, Day
        'firstTime': 'INTEGER NOT NULL',
        'nextTriggerTime': 'INTEGER',
    }
}

const UsageExpenseFor = ['Entertainment','Catering','Education','Loan','Clothing','Daily Expense','Deposit'];
const UsageIncomeFor = ['Salary','Giving','Investment'];
const BaseTableFieldTitle = {
    method:['AliPay','WeChat','Cash','Credit Card','Deposit'],
    usage:[...UsageExpenseFor,...UsageIncomeFor],
    cycleUnit:['Year','Month','Week','Day']
}
const TableTags = {
    name: 'TagTable',
    fields:{
        'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
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
    DatabaseConfig,
    DBVersion,
    TableBasicAccounting,
    BaseTableFieldTitle,
    TableTags,
    AppSettings
};