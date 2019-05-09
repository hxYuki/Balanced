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
        'usage': 'CHARACTER(13) NOT NULL', // Entertainment, Catering, Education, Loan, Clothing, Daily Expense, 
        'circleNum': 'INTEGER',
        'circleUnit': 'CHARACTER(5)', // Month, Week, Day
        'firstTime': 'INTEGER NOT NULL',
        'nextTriggerTime': 'INTEGER',
    }
}

export {Database,TableBasicAccounting};