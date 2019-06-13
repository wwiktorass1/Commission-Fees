# Commission Fees Calculator
Bank users can go to a branch to cash in and/or cash out from Bank account. There are also commission fees for both cash in and cash out. Only supported currency is EUR.

Open Visual studio code program, go to folder with project. Install request: "npm install request". input.json shoud be in same folder.

Enter command: node feesCalculator.js <file_name>.json


## Example Data

➜  cat input.json<br />
[
    { "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type": "cash_in", "operation": { "amount": 200.00, "currency": "EUR" } },<br />
    { "date": "2016-01-06", "user_id": 2, "user_type": "juridical", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } },
    { "date": "2016-01-06", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 30000, "currency": "EUR" } },<br />
     { "date": "2016-01-07", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 1000.00, "currency": "EUR" } },<br />
    { "date": "2016-01-07", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100.00, "currency": "EUR" } },<br />
    { "date": "2016-01-10", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100.00, "currency": "EUR" } },<br />
    { "date": "2016-01-10", "user_id": 2, "user_type": "juridical", "type": "cash_in", "operation": { "amount": 1000000.00, "currency": "EUR" } },<br />
    { "date": "2016-01-10", "user_id": 3, "user_type": "natural", "type": "cash_out", "operation": { "amount": 1000.00, "currency": "EUR" } },<br />
    { "date": "2016-02-15", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } },
]


➜  feesCalculator.js input.json

0.06<br />
0.90<br />
87.00<br />
3.00<br />
0.30<br />
0.30<br />
5.00<br />
0.00<br />
0.00<br />


