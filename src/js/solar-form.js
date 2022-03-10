import * as solarCalc from './solar-calculate.js';
import * as data from './solar-data-obj.js';

const debounce = (func, wait) => {
    let timeout;    
    return function executedFunction(...args) {
	const later = () => {
	    clearTimeout(timeout);
	    func(...args);
	};	
	clearTimeout(timeout);
	timeout = setTimeout(later, wait);
    };
};

function checkInputs(arr) {
    // make sure all inputs have value
    let hasValue = true;
    arr.forEach(function(e) {
	if(e.value.length == 0 && e.id != 'calc-button') {
	    hasValue = false;
	} 
    })
    return hasValue;    
}


const ignoreFields = ['sc-postcode','sc-orientation']
let allInputsVal = false;


document.addEventListener("DOMContentLoaded", function(event) { 

    const form = document.getElementById("solar-calc-form")
    form.addEventListener('submit', event => {
	event.preventDefault();
    });

    const dataObj = data.dataObj;
    console.log("dataObj :: ", dataObj);
    
    const formElements = form.elements;
    const formElementsArray = [].slice.call(formElements);

    const calcBtn = document.querySelector('#calc-button');
    const postcode = document.querySelector('#sc-postcode'); 
    const frequency = document.querySelector('#sc-frequency'); 
    const bill = document.querySelector('#sc-bill'); 
    const usage	= document.querySelector('#sc-daily-usage'); 
    const perKw = document.querySelector('#sc-kw');
    const daytimeUsage = document.querySelector('#sc-daytime-usage'); 
    const size = document.querySelector('#sc-size'); 
    const panels = document.querySelector('#sc-panels'); 
    const pitch	= document.querySelector('#sc-pitch'); 
    const orientation = document.querySelector('#sc-orientation'); 
    const cost = document.querySelector('#sc-system-cost'); 
    const finance = document.querySelector('#sc-finance-years');
    const battery = document.querySelector('#sc-battery'); 
    const batteryCost = document.querySelector('#sc-battery-cost');
    const feedInTariff = document.querySelector('#sc-feed-in-tariff');
    const stcs = document.querySelector('#sc-stcs');
    const panelOutlay = document.querySelector('.solar-panels');
    const financeYears = document.querySelector('#sc-finance-years');
    const pricePerKwSpan = document.querySelector('#span-current-price-kw');
    const systemCostSpan = document.querySelector('#span-system-cost');

    const changeEvent = new Event('change');

    // dont update these fields in debouncer

    // add default values from dataObj

    frequency.nextElementSibling.innerText = dataObj.scFrequency.str;
    bill.nextElementSibling.innerText = dataObj.scBill.str;
    usage.nextElementSibling.innerText = dataObj.scDailyUsage.str;
    perKw.nextElementSibling.innerText = dataObj.scBill.perKw;
    daytimeUsage.nextElementSibling.innerText = dataObj.scDaytimeUsage.num;
    size.nextElementSibling.innerText = dataObj.scSize.num;
    panels.nextElementSibling.innerText = dataObj.scPanels.num;
    orientation.nextElementSibling.innerText = dataObj.scPitch.num;
    cost.nextElementSibling.innerText = dataObj.scSystemCost.num;

    // pricePerKwSpan.innerText = dataObj.scBill.perKw; 
    // systemCostSpan.innerText = dataObj.scSystemCost.num; 

    
    updatePanels(dataObj.scPanels.num);
    
    
    var returnedFunction = debounce(function(e) {
	if(e.target.value != undefined) {
	    if(!ignoreFields.includes(e.target.id)) {
		e.target.nextElementSibling.innerText = e.target.value;
	    }
	}    
	solarCalc.calculate(dataObj);
    }, 500);

    // fire debounce on every elements 'input' event
    formElementsArray.forEach(function(e) {
	e.addEventListener('input', returnedFunction);
    });

    // without debounce
    // formElementsArray.forEach(function(e) {
    //     e.addEventListener('input', (event) => {	
    // 	console.log(solarCalc.dataObj);
    // 	// calcBtn.click();
    //     })	
    // });
    
    bill.addEventListener('input',function(event) {    
	dataObj.scBill.str = this.value;
	dataObj.scBill.num = parseInt(this.value);
	event.target.nextElementSibling.innerText = this.value;
    })

    usage.addEventListener('change',function(event) {    
	dataObj.scDailyUsage.str = this.value;
	dataObj.scDailyUsage.num = parseInt(this.value);
	event.target.nextElementSibling.innerText = this.value;    
    })

    daytimeUsage.addEventListener('change',function(event) {    
	dataObj.scDaytimeUsage.str = this.value;
	dataObj.scDaytimeUsage.num = parseInt(this.value);
	// event.target.nextElementSibling.innerText = this.value;    
    })

    finance.addEventListener('change',function(event) {    
	dataObj.scSystemCost.financeYears = this.value;
	event.target.nextElementSibling.innerText = this.value;    
    })
    
    postcode.addEventListener('input',(event) => {
	if(event.target.checkValidity()) {
	    let val = parseInt(event.target.value);
	    if (val < 8000) {
		dataObj.scPostcode.str = "TAS"
		dataObj.scPostcode.solarHours = "3.7"
		dataObj.scPostcode.directionEffect.north = 97;
		dataObj.scPostcode.directionEffect.east = 81;
		dataObj.scPostcode.directionEffect.south = 62;
		dataObj.scPostcode.directionEffect.west = 80;
	    }
	    if (val < 7000) {
		dataObj.scPostcode.str = "WA"
		dataObj.scPostcode.solarHours = "5.3"
		dataObj.scPostcode.directionEffect.north = 99;
		dataObj.scPostcode.directionEffect.east = 86;
		dataObj.scPostcode.directionEffect.south = 70;
		dataObj.scPostcode.directionEffect.west = 86;
	    }
	    if (val < 6000) {
		dataObj.scPostcode.str = "SA"
		dataObj.scPostcode.solarHours = "4.7"
		dataObj.scPostcode.directionEffect.north = 99;
		dataObj.scPostcode.directionEffect.east = 84;
		dataObj.scPostcode.directionEffect.south = 69;
		dataObj.scPostcode.directionEffect.west = 86;
	    }
	    if (val < 5000) {
		dataObj.scPostcode.str = "QLD"
		dataObj.scPostcode.solarHours = "5"
		dataObj.scPostcode.directionEffect.north = 100;
		dataObj.scPostcode.directionEffect.east = 88;
		dataObj.scPostcode.directionEffect.south = 74;
		dataObj.scPostcode.directionEffect.west = 87;
	    }
	    if (val < 4000) {
		dataObj.scPostcode.str = "VIC"
		dataObj.scPostcode.solarHours = "4.1"
		dataObj.scPostcode.directionEffect.north = 99;
		dataObj.scPostcode.directionEffect.east = 83;
		dataObj.scPostcode.directionEffect.south = 67;
		dataObj.scPostcode.directionEffect.west = 86;
	    }
	    if (val < 3000) {
		dataObj.scPostcode.str = "NSW"
		dataObj.scPostcode.solarHours = "5.1"
		dataObj.scPostcode.directionEffect.north = 99;
		dataObj.scPostcode.directionEffect.east = 84;
		dataObj.scPostcode.directionEffect.south = 68;
		dataObj.scPostcode.directionEffect.west = 85;
	    }
	    if (val < 2915) {
		dataObj.scPostcode.str = "ACT"
		dataObj.scPostcode.solarHours = "5.1"
		dataObj.scPostcode.directionEffect.north = 99;
		dataObj.scPostcode.directionEffect.east = 84;
		dataObj.scPostcode.directionEffect.south = 68;
		dataObj.scPostcode.directionEffect.west = 85;
	    }
	    if (val < 2900) {
		dataObj.scPostcode.str = "NSW"
		dataObj.scPostcode.solarHours = "5.1"
		dataObj.scPostcode.directionEffect.north = 99;
		dataObj.scPostcode.directionEffect.east = 84;
		dataObj.scPostcode.directionEffect.south = 68;
		dataObj.scPostcode.directionEffect.west = 85;
	    }
	    if (val < 2618) {
		dataObj.scPostcode.str = "ACT"
		dataObj.scPostcode.solarHours = "5.1"
		dataObj.scPostcode.directionEffect.north = 99;
		dataObj.scPostcode.directionEffect.east = 84;
		dataObj.scPostcode.directionEffect.south = 68;
		dataObj.scPostcode.directionEffect.west = 85;
	    }
	    if (val < 2600) {
		dataObj.scPostcode.str = "NSW"
		dataObj.scPostcode.solarHours = "5.1"
		dataObj.scPostcode.directionEffect.north = 99;
		dataObj.scPostcode.directionEffect.east = 84;
		dataObj.scPostcode.directionEffect.south = 68;
		dataObj.scPostcode.directionEffect.west = 85;
	    }
	    if (val < 1000) {
		dataObj.scPostcode.str = "NT"
		dataObj.scPostcode.solarHours = "6"
		dataObj.scPostcode.directionEffect.north = 100;
		dataObj.scPostcode.directionEffect.east = 94;
		dataObj.scPostcode.directionEffect.south = 82;
		dataObj.scPostcode.directionEffect.west = 92;
	    }
	    event.target.nextElementSibling.innerText = dataObj.scPostcode.str;
	}
    });

    postcode.addEventListener('change',(event) => {
	
	var f = dataObj.scFit.fits.filter(function(el) {
	    return el.state == dataObj.scPostcode.str;
	});

	if (f[0] != undefined) {
	    dataObj.scFit.str = f[0].state;
	    dataObj.scFit.num = f[0].tariff;
	    feedInTariff.value = f[0].tariff;
	    feedInTariff.nextElementSibling.innerText = f[0].tariff; 
	} else {
	    dataObj.scFit.str = "";
	    dataObj.scFit.num = "";
	    feedInTariff.nextElementSibling.innerText = ""; 
	    feedInTariff.value = null; 
	}
    })

    frequency.addEventListener('change',function(event) {    
	// <option value="monthly-1">Monthly</option>
	dataObj.scFrequency.str = this.value;
	dataObj.scFrequency.num = parseInt(event.target.options[event.target.options.selectedIndex].dataset.freqCount);
	event.target.nextElementSibling.innerText = dataObj.scFrequency.str;    
    })

    battery.addEventListener('change',function(event) {
	console.log(event)
	// <option value="Tesla Powerwall 2" data-battery-kw="6.5" data-battery-price="14000">Tesla Powerwall 2</option>
	
	dataObj.scBattery.str = this.value;
	dataObj.scBattery.num = event.target.options[event.target.options.selectedIndex].dataset.batteryKw;
	dataObj.scBatteryCost.num = event.target.options[event.target.options.selectedIndex].dataset.batteryPrice;
	
	if(dataObj.scBatteryCost.num != undefined) {
	    event.target.nextElementSibling.innerText = dataObj.scBattery.str;    
	    batteryCost.nextElementSibling.innerText = dataObj.scBatteryCost.num;
	    batteryCost.value = dataObj.scBatteryCost.num;
	} else {
	    batteryCost.nextElementSibling.innerText = "";
	    batteryCost.value = "";
	}
    })

    function updatePanels(p) {
	panels.value = p;    
	panels.dispatchEvent(changeEvent);
	setTimeout(function() {
	    let difference =  p - document.querySelectorAll('.solar-panel-outlay span').length;
	    let num = Math.abs(difference)
	    for(var i = 0; i < num; i++) {
		difference < 0 ? panelOutlay.removeChild(panelOutlay.lastElementChild) : panelOutlay.insertAdjacentHTML("afterBegin", "<span></span>")
	    }
	    panels.nextElementSibling.innerText = p;
	},500);    
    }
    
    function updateCost(c) {
	cost.value = c * 1000;    
	cost.dispatchEvent(changeEvent);
    }

    cost.addEventListener('input',function(event) {    	
	dataObj.scSystemCost.str = this.value;
	dataObj.scSystemCost.num = this.value;
	event.target.nextElementSibling.innerText = this.value;    
	console.log(dataObj.scSystemCost)
    })

    cost.addEventListener('change',function(event) {    	
	dataObj.scSystemCost.str = this.value;
	dataObj.scSystemCost.num = this.value;
	event.target.nextElementSibling.innerText = this.value;    
	console.log(dataObj.scSystemCost)
    })
    
    // set size and update panels
    size.addEventListener('input',(event) => {    
	dataObj.scSize.str = event.target.value;
	dataObj.scSize.num = event.target.value;
	event.target.nextElementSibling.innerText = event.target.value;
	updateCost(event.target.value);
    })

    size.addEventListener('change',(event) => {    
	let p = Math.round(event.target.value * 1000 / 370);    
	setTimeout(function() {
	    updatePanels(p);
	    updateCost(event.target.value);
	},500);    
    })

    // add panels as range is slid
    panels.addEventListener('input',(event) => {    
	if(event.target.value < document.querySelectorAll('.solar-panel-outlay span').length) {
	    panelOutlay.removeChild(panelOutlay.lastElementChild);
	} else {    
	    panelOutlay.insertAdjacentHTML("afterBegin", "<span></span>")
	}        
	dataObj.scPanels.str = event.target.value;
	dataObj.scPanels.num = event.target.value;

	// update size
	var kw = Math.round(event.target.value * 370 / 1000);
	size.value = event.target.value;
	size.nextElementSibling.innerText = kw; 
	size.value = kw;
	updateCost(kw);	
    })

    // make sure panels count is correct once slider released
    panels.addEventListener('change',(event) => {    
	setTimeout(function() {
	    let difference = dataObj.scPanels.num - document.querySelectorAll('.solar-panel-outlay span').length;
	    let num = Math.abs(difference)
	    let kw = Math.round(dataObj.scPanels.num * 370 / 1000);
	    for(var i = 0; i < num; i++) {
		difference < 0 ? panelOutlay.removeChild(panelOutlay.lastElementChild) : panelOutlay.insertAdjacentHTML("afterBegin", "<span></span>")
	    }
	},500);    

    });

    pitch.addEventListener('input',(event) => {    
	dataObj.scPitch.str = event.target.value;
	dataObj.scPitch.num = event.target.value;
	event.target.nextElementSibling.innerText = event.target.value;
    })

    orientation.addEventListener('input',(event) => {
	dataObj.scOrientation.str = event.target.value; 
	let val = parseInt(event.target.value);    
	if (val <= 360) {
	    dataObj.scOrientation.str = "NORTH"
	    dataObj.scOrientation.forEffect = "north"
	}
	if (val < 337) {
	    dataObj.scOrientation.str = "NORTH WEST"
	    dataObj.scOrientation.forEffect = "north"
	}
	if (val < 292) {
	    dataObj.scOrientation.str = "WEST"
	    dataObj.scOrientation.forEffect = "west"
	}
	if (val < 247) {
	    dataObj.scOrientation.str = "SOUTH WEST"
	    dataObj.scOrientation.forEffect = "west"
	}
	if (val < 202) {
	    dataObj.scOrientation.str = "SOUTH"
	    dataObj.scOrientation.forEffect = "south"
	}
	if (val < 157) {
	    dataObj.scOrientation.str = "SOUTH EAST"
	    dataObj.scOrientation.forEffect = "south"	
	}
	if (val < 112) {
	    dataObj.scOrientation.str = "EAST"
	    dataObj.scOrientation.forEffect = "east"
	}
	if (val < 67) {
	    dataObj.scOrientation.str = "NORTH EAST"
	    dataObj.scOrientation.forEffect = "east"
	}
	if (val < 22) {
	    dataObj.scOrientation.str = "NORTH"
	    dataObj.scOrientation.forEffect = "north"
	}
	panelOutlay.style.transform = "rotate(" +  event.target.value + "deg)";
	event.target.nextElementSibling.innerText = dataObj.scOrientation.str;
    });

    // run calculations
    calcBtn.addEventListener('click',() => {
	setTimeout(() => {
	    solarCalc.calculate(dataObj);
	},500)    
    })

    const chartTabs = document.querySelectorAll('.sc-charts-tab');
    const charts = document.querySelectorAll('.sc-charts-chart');

    [...chartTabs].forEach((t) => {

	t.classList.remove('active-chart');

	t.addEventListener('click',function() {
	    [...charts].forEach((c) => {
		c.classList.remove('active-chart')
	    })
	    let chart = document.querySelector('.' + t.dataset.chartTab);
	    chart.classList.toggle('active-chart');
	})	
    })
    
});


// var targets = document.querySelectorAll('.input-value-display');

// var observer = new MutationObserver(function(mutations) {
//     mutations.forEach(function(mutation) {
//         console.log(mutation.target);	
//     });
// });

// var config = { attributes: true, childList: true, characterData: true }

// targets.forEach(function(e) {
//     console.log(e);	    
//     observer.observe(e, config);
// });

// later, you can stop observing
// observer.disconnect();
