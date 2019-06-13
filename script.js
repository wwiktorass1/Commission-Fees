var fs = require('fs');
var promisify = require('util').promisify;
const request = require('request');

var fileName = process.argv[2];
const readFileAsync = promisify(fs.readFile);

const getInputData = async () => {
    const res = await readFileAsync(fileName);

    return JSON.parse(res);
}

function getConfig(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, response, body) {
            if (error) return reject(error);
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                reject(e);
            }
        });
    });
}

getInputData().then(data => {
    calculateFees(data.data).then(data => {
        printCommisions(data);
    })
        .catch(err => console.log(err));
})
    .catch(err => console.log(err));


async function calculateFees(list) {

    let cashInConf = await getConfig("http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in");
    let cashOutNaturalConf = await getConfig("http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural");
    let cashOutJuridicalConf = await getConfig("http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical");

    let commissions = [];
    let daysToMonday = { 0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 };
    let currentWeek = new Date("0");
    let ONE_DAY = 1000 * 60 * 60 * 24;
    let usersWeekLimits = {};

    for (let i = 0; i < list.length; i++) {
        if (list[i].type == 'cash_in') {
            let cashInComm = getCashInComm(list[i]);
          //  console.log(list[i]);
            commissions.push({ "user_id": list[i].user_id, "date": list[i].date, "user_type": list[i].user_type, "type": list[i].type, "amount": list[i].operation.amount, "comm": cashInComm });
        }
        else if (list[i].user_type == 'juridical') {
            let cashOutJuridicalComm = getCashOutJuridicalComm(list[i]);
            commissions.push({ "user_id": list[i].user_id, "date": list[i].date, "user_type": list[i].user_type, "type": list[i].type, "amount": list[i].operation.amount, "comm": cashOutJuridicalComm });
        }
        else {
            let operationDate = new Date(list[i].date);

            if (Math.round(Math.abs(operationDate.getTime() - currentWeek.getTime()) / ONE_DAY) > 7) {

                let monday = operationDate.getDate() - daysToMonday[operationDate.getDay()];
                currentWeek = new Date(operationDate.setDate(monday));
                usersWeekLimits = {};
            }

            if (!(list[i].user_id in usersWeekLimits)) {
                usersWeekLimits[list[i].user_id] = cashOutNaturalConf.week_limit.amount;
            }
            let residualLimit = usersWeekLimits[list[i].user_id];

            let taxableAmount = (list[i].operation.amount < residualLimit) ? 0 : list[i].operation.amount - residualLimit;
            let newResidual = (list[i].operation.amount < residualLimit) ? residualLimit - list[i].operation.amount : 0;
            usersWeekLimits[list[i].user_id] = newResidual;
            let operationComm = taxableAmount * cashOutNaturalConf.percents * 0.01;  

            commissions.push({ "user_id": list[i].user_id, "date": list[i].date, "user_type": list[i].user_type, "type": list[i].type, "amount": list[i].operation.amount, "comm": Math.ceil(operationComm*100)*0.01 });

        }
    };

    return commissions;


    function getCashInComm(operationObj) {
        let comm = (operationObj.operation.amount * cashInConf.percents * 0.01 <= cashInConf.max.amount) ? operationObj.operation.amount * cashInConf.percents * 0.01 : Number(cashInConf.max.amount);
        return Math.ceil(comm*100)*0.01;

    }

    function getCashOutJuridicalComm(operationObj) {

        let comm = (operationObj.operation.amount * cashOutJuridicalConf.percents * 0.01 >= cashOutJuridicalConf.min.amount) ? operationObj.operation.amount * cashOutJuridicalConf.percents * 0.01 : Number(cashOutJuridicalConf.min.amount);
        return Math.ceil(comm*100)*0.01;
    }

}

function printCommisions(commList) {
    commList.map(e => console.log(e.comm));
  
}




