// import * as solarChart from './solar-chart.js';
// import * as solarCompareChart from './solar-compare-chart.js';
import * as solarSavingsChart from './solar-savings-chart.js';
import * as common from './common.js';

function retailData(retailerInflation,yearlyBill) {

    var rate;
    var amount; 
    var rarr = []
    
    rate = retailerInflation;
    amount = yearlyBill;
        
    for(var i = 1; i <= 26; i++){	
	amount = amount * (1.0 + rate);	
	rarr.push(common.formatNum(amount,2))
    }

    return rarr;
}


function solarData(annualFit, systemCost, repayYears, yearlyBill, offGridPercent) {

    // power outside of 8am - 6pm timeframe comes from grid 
    // let offGridPercent = (100 - onGridPercent) / 100;

    let onGridPower = yearlyBill * offGridPercent;    
    let sysCostPerYear = systemCost / repayYears;
    let sarr = []
    let paybackYears = [];
    
    for(var i = 1; i <= 26; i++){

	let amount = 0;

	if (systemCost > 0) {
	    amount = sysCostPerYear;
	    systemCost -= sysCostPerYear;
	    paybackYears.push(i)
	} else {
	    amount = amount - annualFit;
	}

	sarr.push(common.formatNum(amount + onGridPower,2))	    

    }

    // length of payback years array
    document.querySelector('#span-payback-timeframe').innerText = paybackYears.length;
    
    return sarr;
}

// function solarSavings(annualFit, systemCost, repayYears, yearlyBill, onGridPercent) {
function solarSavings(dailyProd,
		      dailyUsage,
		      currentPriceKw,
		      onGridPercent,
		      offGridPercent,
		      fit,
		      yearlyBill,
		      retailerInflation,
		      systemCost,
		      retailArr) {

    let f = 0;
    let a = 0;

    if( dailyProd > dailyUsage) {
	f = (dailyProd - dailyUsage) * fit / 100;
	a = (dailyProd - dailyUsage) * currentPriceKw;
    } else {
	let gridPower = dailyUsage - dailyProd
	a = (parseInt(dailyProd) + parseInt(gridPower)) * currentPriceKw
    }
    
    console.log("a :: ",a);
    console.log("f :: ",f);
    
    // let monthly = (dailyProd * currentPriceKw) * 30;
    // let yearly = monthly * 12;
    let paybackYears = [];
    let sarr = [];
    let amount = 0;
    
    for(let i = 0; i <= 25; i++){
	
	amount += (a * 365) * onGridPercent;
	sarr.push(common.formatNum(amount + fit))

	if (systemCost > 0) {
	    systemCost -= amount;
	    paybackYears.push(i)
	}
    }

    document.querySelector('#span-payback-timeframe').innerText = paybackYears.length;
    console.log(sarr)
    return sarr;    
}

export function calculate(dataObj) {

    console.log('dataObj',dataObj);
    
    localStorage.setObject('dataObj', dataObj);

    let chartData = {
    	solar: [],
	retailer: [],
    };

    // chartData.retailer = totalsArr(5,25,chartData.retailer);    
    // common.asyncLocalStorage.getItem('dataObj').then(function(d) {

    function addResultSpans(d,value) {
	if(d.displayElementId) {
	    document.querySelector(d.displayElementId).innerText = d.str;
	}
    }
        
    // let bill = dataObj.scBill.num;
    let freq = dataObj.scFrequency.num;
    let monthlyBill = parseInt(dataObj.scBill.num / dataObj.scFrequency.num); 
    let yearlyBill = parseInt(monthlyBill) * 12;; 
    let retailerInflation = 0.025; 
    let gridConnectionFee = 30;
    let afterConnection = monthlyBill - gridConnectionFee; 
    let kwPerDay = afterConnection / .25;
    let kwPerMonth = kwPerDay * 30;
    let kwPerYear = kwPerDay * 360; 
    let emissionsSaved = "";    
    
    let systemSize = dataObj.scSize.num
    let financeYears = dataObj.scSystemCost.financeYears
    let decadeSolar = ((systemSize * 4) * 3650) * .02;

    // north, west, east, south values: 1-100 so dive by 100
    let orientationEffect = dataObj.scPostcode.directionEffect[dataObj.scOrientation.forEffect] / 100;

    console.log("orientationEffect :: ",orientationEffect);
    
    let dailyProd = common.formatNum((systemSize * dataObj.scPostcode.solarHours) * orientationEffect, 2);

    emissionsSaved = common.formatNum((dailyProd * 9125) / 1000, 2);
    
    
    let annualSavingsFit = common.formatNum(dailyProd * dataObj.scFit.num,2);

    let systemCost = dataObj.scSystemCost.num; 
    
    if(dataObj.scBatteryCost.num > 0) {
	// document.querySelector('#span-system-cost').previousElementSibling.innerText = "";
	systemCost = parseInt(systemCost) + parseInt(dataObj.scBatteryCost.num);
	console.log("sys cost with battery ", systemCost);
    }
        
    addResultSpans(dataObj.scSize);
    addResultSpans(dataObj.scDailyUsage);

    // no matching obj for daily solar prod
    document.querySelector('#span-system-cost').innerText = systemCost;
    document.querySelector('#span-daily-solar-production').innerText = dailyProd;
    document.querySelector('#span-annual-savings-fit').innerText = annualSavingsFit;
    document.querySelector('#span-emissions-saved').innerText = emissionsSaved + " tonnes";
    document.querySelector('#span-inflation').innerText = retailerInflation * 100;

    // divide the cost of the system, including tax rebates and financial incentives,
    // by the annual amount you'll save on utility bills    

    // let financedYears = 15; 
    let offGridPercent = (100 - dataObj.scDaytimeUsage.num) / 100;
    let onGridPercent = dataObj.scDaytimeUsage.num / 100;

    chartData.retailer = retailData(retailerInflation,yearlyBill);
    chartData.solar = solarData(annualSavingsFit,systemCost,financeYears,yearlyBill,offGridPercent);

    chartData.solar = solarSavings(dailyProd,
				   dataObj.scDailyUsage.num,
				   dataObj.scBill.perKw,
				   onGridPercent,
				   offGridPercent,
				   annualSavingsFit,
				   yearlyBill,
				   retailerInflation,
				   systemCost,
				   chartData.retailer)

    
    solarSavingsChart.updateConfigByMutating(solarSavingsChart.myChart, chartData.solar);

    // solarCompareChart.updateConfigByMutating(solarCompareChart.myChart, chartData.solar, chartData.retailer);
    
    return;

}


// OLD FUNCTIONS

// function getAnnualSolarWithInflation(bill,fit) {
//     let adjusted = 0;
//     let total = 0;
    
//     for (var j = 0; j <= 12; j++) {
// 	bill = bill + adjusted; 
// 	total += bill;
//     }
    
//     adjusted = total * .025;
//     total += adjusted;
//     total = total - fit;
    
//     return common.formatNum(total,2)
// }

// function totalsArr(step,total,results) {

//     var steps = total/step;
    
//     let arr = []
//     for (var i = 0; i <= steps; i++) {
// 	arr.push(results[i]);
//     }
//     return arr;
// }

// function getAnnualRetailWithInflation(bill) {

//     let adjusted = 0;
//     let total = 0;
    
//     for (var j = 0; j <= 12; j++) {
// 	bill = bill + adjusted; 
// 	total += bill;
//     }
    
//     adjusted = total * .025;
//     total += adjusted;    
//     return common.formatNum(total,2)
// }
