/*function getStockData(data = {}, count) {
    console.log("IN JS- URL POST" + POST_STOCK_DATA_URL)
    const fetchPromise = fetch(POST_STOCK_DATA_URL + "/" + count, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      });
    fetchPromise.then(response => {
        console.log("1")
        console.log(response)
        //console.log(response.json())
        return response.json();
    }).then((resp) => {
        console.log("2s")
        console.log(resp)

        var table = document.getElementById("viewStockDataTable")
        var row = table.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        cell1.innerHTML = resp.time
        cell2.innerHTML = resp.price

        if (prevPrice == 0) {
            cell3.innerHTML = "-";
            cell3.style='text-align:center';
            cell4.innerHTML = "-";
            cell4.style='text-align:center';
        } else {
            let percentageChange = parseFloat((((cell2.innerHTML - prevPrice) / prevPrice) * 100).toFixed(4));
            cell3.innerHTML = percentageChange

            if(mergePercentage > 0 && percentageChange > 0) {
                mergePercentage = parseFloat(((mergePercentage + percentageChange).toFixed(4)));
                cell4.style='color:green';
            } else if (mergePercentage < 0 && percentageChange < 0) {
                mergePercentage = parseFloat(((mergePercentage + percentageChange).toFixed(4)));
                cell4.style='color:red';
            } else if (percentageChange == 0) {
                console.log("")
            } else {
                mergePercentage = percentageChange;
            }

            if(mergePercentage > 0) {
                cell4.style='color:green';
            } else {
                cell4.style='color:red';
            }
            cell4.innerHTML = mergePercentage;
        }
        prevPrice = cell2.innerHTML
    }).catch((error) => {
        console.log("Error caught");
        console.log(error);
        console.log(error.message);
    })
}

function refreshTableWithStockData() {
    getStockData({ticker: curTickerSymbol, limit: STOCK_DATA_TOTAL_DATAPOINTS}, datapt_idx)
    datapt_idx = datapt_idx + 1
    if(datapt_idx > NUMBER_OF_DATAPOINTS) {
        clearInterval(intervalId); // Stop the interval when counter reaches 10
    }
} */

function getStockData(data) {
    //console.log("IN JS- URL POST" + POST_STOCK_DATA_URL)
    const fetchPromise = fetch(POST_STOCK_DATA_URL, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      });
    fetchPromise.then(response => {
        return response.json();
    }).then((resp) => {
        return resp;
    }).catch((error) => {
        console.log("Error caught");
        console.log(error);
        console.log(error.message);
    })
}

function refreshStockData(data = {}) {
    
    var resp =  getStockData({ticker: curTickerSymbol})
    var table = document.getElementById("viewStockDataTable")
    var row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    cell1.innerHTML = resp.time
    cell2.innerHTML = resp.price

    if (prevPrice == 0) {
        cell3.innerHTML = "-";
        cell3.style='text-align:center';
        cell4.innerHTML = "-";
        cell4.style='text-align:center';
    } else {
        let percentageChange = parseFloat((((cell2.innerHTML - prevPrice) / prevPrice) * 100).toFixed(4));
        cell3.innerHTML = percentageChange

        if(mergePercentage > 0 && percentageChange > 0) {
            mergePercentage = parseFloat(((mergePercentage + percentageChange).toFixed(4)));
            cell4.style='color:green';
        } else if (mergePercentage < 0 && percentageChange < 0) {
            mergePercentage = parseFloat(((mergePercentage + percentageChange).toFixed(4)));
            cell4.style='color:red';
        } else if (percentageChange == 0) {
            console.log("")
        } else {
            mergePercentage = percentageChange;
        }

        if(mergePercentage > 0) {
            cell4.style='color:green';
        } else {
            cell4.style='color:red';
        }
        cell4.innerHTML = mergePercentage;
    }
    prevPrice = cell2.innerHTML
}

function initStockDataTable() {
    var table = document.getElementById("viewStockDataTable");
    var row = table.insertRow();
    for (let i = 0; i < stockList.length; i++) {
        var cell = row.insertCell(i);
        cell.innerHTML = stockList[i];
    }
}
var POST_STOCK_DATA_URL="/getstockdata"
var stockList = ["AAPL", "MSFT", "NVDA", "TSLA", "AMD", "ABNB", "META", "MRNA"]
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var curTickerSymbol = urlParams.get('ticker').toUpperCase();

// Display the ticker value
document.getElementById("viewStockDataHeader").innerText = document.getElementById("viewStockDataHeader").innerText + " " + curTickerSymbol;
//document.getElementById("viewStockDataTableHeader").innerHTML = curTickerSymbol;

initStockDataTable()

// STOCK_DATA_TOTAL_DATAPOINTS=30;
// NUMBER_OF_DATAPOINTS = 20;
// datapt_idx = 1;
// var prevPrice = 0;
// var mergePercentage = 0;
//var intervalId = setInterval(refreshStockData, 60 * 1000);



