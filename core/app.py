from flask import Flask, render_template, request, abort
import os, requests, datetime
from appConstant import GET_STOCK_DATA_URL

app = Flask (__name__, template_folder=".")
cleanStockData = {}
stockPriceData = {}
validStocks = ["AAPL", "MRNA", "TSLA"]

@app.route('/', methods=['GET'])
def index():
    try:
        return render_template('/static/html/index.html', GET_STOCK_DATA_URL=GET_STOCK_DATA_URL)

    except Exception as e:
        print("Error: ", e)
        return '401 not found'
    
@app.route('/viewstockdata', methods=['GET'])
def stockDataView():
        try:
            stockTickerSymbol = request.args.get('ticker')
            stockTickerSymbol = stockTickerSymbol.upper()
            if (stockTickerSymbol not in validStocks or stockTickerSymbol == "" or stockTickerSymbol == None):
                abort(400)
            return render_template('/static/html/viewStockData.html', GET_STOCK_DATA_URL=GET_STOCK_DATA_URL)
        except Exception as e:
            print("Error in view stock data ", e)
            abort(400)

'''
@app.route('/getstockdata/<int:count>', methods=['POST'])
def post_example(count):
    try:
        data = request.get_json()  # Assuming JSON data is being sent
        requestedTicker = data['ticker'].upper()
        maxDataPointsLimit = data['limit']
        # count = 2, LIMIT = 10 means give me second data point from historical data of 10 data points
        priceDataByCount = cleanStockData[requestedTicker][:maxDataPointsLimit][maxDataPointsLimit - count]
        response = {"time": priceDataByCount[0], "price": priceDataByCount[1], "message1": "testMessage1Val"}
        return response
    except Exception as e:
        print("Error occured!!!!")
        print(e)
        abort(500)
'''        

@app.route('/getstockdata', methods=['POST'])
def post_example(count):
    try:
        x = datetime.datetime.now()
        print("Received post request at time: ", x)
        data = request.get_json()  # Assuming JSON data is being sent
        requestTicker = data['ticker'].upper()
        getStockDataFromAPI(requestTicker)

        response = {"price": stockPriceData[requestTicker]['price_data'], "mergePercent": stockPriceData[requestTicker]['merge_percent']}
        return response
    except Exception as e:
        print("Error occured!!!!")
        print(e)
        abort(500)


def getStockDataFromAPI(tickerSymbol):
    global stockPriceData
    API_KEY = '?apikey=lUGv2j9JaVQBb1tO29m3IYEs2zzwwJ3c'
    API_URL = 'https://financialmodelingprep.com/api/v3/quote-short/' + tickerSymbol
    
    r = requests.get(API_URL + API_KEY)
    print("==================== FETCHING STOCK DATA FROM API ============= ")
    response_data = r.json()
    
    if(len(response_data) > 0):
        currentPrice = response_data[0]["price"]
    else:
        Exception("API response incorrect or empty")
    
    if tickerSymbol in stockPriceData.keys():
        prevPriceData = stockPriceData[tickerSymbol]['price_data']
        prevPrice = prevPriceData[-1]
        prevPriceData.append(currentPrice)

        stockPriceData['price_data'] = prevPriceData
        stockPriceData['merge_percent'] = calcMergePercentage(currentPrice, prevPrice, stockPriceData['merge_percent'])
        stockPriceData['current_price'] = currentPrice
    else:
        stockPriceData[tickerSymbol] = {'price_data': [currentPrice], 'merge_percent': 0, 'current_price': currentPrice}

def calcMergePercentage(currentPrice, prevPrice, prevMergePercent):
    percentageChange = round(((currentPrice - prevPrice) / prevPrice) * 100, 4)

    if((prevMergePercent > 0 and percentageChange > 0) or (prevMergePercent < 0 and percentageChange < 0)):
        return round(prevMergePercent + percentageChange, 4)
    elif (percentageChange == 0): 
        return prevMergePercent # No change, return previous merge %
    else: 
        return percentageChange # Opposite signs, reset merge % to current % change
     
def getStockDataFromAPIAlphaVintage(tickerSymbol):
    print("==================== FETCHING STOCK DATA FROM API ============= ")
    global cleanStockData
    #API_KEY = 'H9Z110ZU197HNAJP'
    #API_KEY = 'GYME5LG7Y36YLLAU'
    API_KEY = 'KWJ889ZG83J807SX'
    # replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
    url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&adjusted=false&symbol='+tickerSymbol+'&interval=1min&apikey='+API_KEY

    #url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&adjusted=false&symbol=TSLA&interval=1min&apikey='+API_KEY
    #print("URL is " + url)
    r = requests.get(url)
    data = r.json()

    print("STOCK IS ", tickerSymbol)
    print("DATA is", data)
    tickerFetched = "";
    rawCloseData = None

    for key in data.keys():
        if("Meta Data" in key):
            for key2 in data[key].keys():
                if("Symbol" in key2):
                    tickerFetched = data[key][key2] 	
                    break

        elif("Time Series" in key):	
            rawCloseData = data[key]
            break

    closeJsonKeyName = ""
    for key1 in rawCloseData.keys():
        for key2 in rawCloseData[key1].keys():
            if("close" in key2):
                closeJsonKeyName = key2	
                break

    cleanStockDataList = []
    for key in rawCloseData.keys():
        pair = [key, rawCloseData[key][closeJsonKeyName]]
        cleanStockDataList.append(pair)

    if(len(tickerFetched.strip()) != 0):
        cleanStockData[tickerFetched] = cleanStockDataList

if __name__ == '__main__':
    for ticker in validStocks:
        break
        getStockDataFromAPI(ticker)
    print("==== starting app .... =======")
    app.run(debug=True, port=8000)
