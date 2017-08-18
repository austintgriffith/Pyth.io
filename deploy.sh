#!/bin/bash
echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"
echo "Deploying Auth...";
cd Auth;node compile Auth;node deploy Auth;
cd ..
echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"


echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"
echo "Giving account [1] permission from account [0]...";
cd Auth
node index Auth
node get Auth
cd ..
echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"
echo "Deploying Main...";
cd Main;node compile Main;node deploy Main;
cd ..
echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"


echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"
echo "Deploying Requests...";
cd Requests;node compile Requests;node deploy Requests;
cd ..
echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"


echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"
echo "Deploying Token...";
cd Token;node compile Token;node deploy Token;
cd ..
echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"

echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"
echo "Deploying basic Combiner...";
cd Combiner/basic;node compile Combiner;node deploy Combiner;
cd ../..
echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"



echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"
echo "Wire the deployed contracts back to the main...";
cd Main
node wireupAllContracts.js Main
node get.js Main
cd ..
echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"


echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"
echo "Transfer some coin to the second account...";
cd Token
node transfer Token
node balances Token
cd ..
echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"


echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"
echo "Add an open request from the second account ...";
cd Requests
node index Requests
cd ..
echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"


echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"
echo "View Token event of request add ...";
cd Token
node eventsReserve Token
cd ..
echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"

echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"
echo "View Request event of request add ...";
cd Requests
node eventsAddRequest Requests
cd ..
echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"


echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"
echo "Mine Request as account[1]...";
cd Requests
node mine Requests
cd ..
echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"


echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"
echo "View mine event...";
cd Combiner/basic
node eventsAddResponse Combiner
cd ../..
echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"


echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"
echo "View balances after mining...";
cd Token
node balances Token
cd ..
echo "-=======-=======-=======-=======-=======-=======-=======-=======-------"
