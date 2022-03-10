// solar-data-obj.js

// add default values but will get overwritten
export const dataObj = {    
    scPostcode: {    
	prop:"scPostcode",
	str:"3000",
	num:3000,  
	id:"sc-postcode",
	solarHours:"4",
	directionEffect: {
	    north: 99,
	    east:84,
	    south:68,
	    west:85
	}
    },
    scFrequency: {    
	prop:"scFrequency",
	str:"Monthly",
	num:1,  
	id:"sc-frequency",
    },
    scDailyUsage: {    
	prop:"scDailyUsage",
	str:"20",
	num:20,  
	id:"sc-daily-usage",
	displayElementId:"#span-daily-usage",
    },
    scDaytimeUsage: {    
	prop:"scDaytimeUsage",
	str:"20",
	num:20,  
	id:"sc-daytime-usage",
	displayElementId:"#span-daytime-usage",
    },
    scBill: {    
	prop:"scBill",
	str:"150",
	num:150,
	id:"sc-bill" ,
	perKw:.33 ,
    },
    scSize: {    
	prop:"scSize",
	str:"6",
	num:6,
	id:"sc-size" ,
	displayElementId:"#span-size",
    },
    scPanels: {    
	prop:"scPanels",
	str:"16",
	num:16,
	id:"sc-panels" ,
    },
    scPitch: {    
	prop:"scPitch",
	str:"22",
	num:22,
	id:"sc-pitch" ,
    },
    scOrientation: {    
	prop:"scOrientation",
	str:"NORTH",
	num:"",
	id:"sc-orientation" ,
	forEffect: "north",
    },
    scSystemCost: {    
	prop:"scSystemCost",
	str:"6000",
	num:6000,
	financeYears:0,
	id:"sc-system-cost" ,
	displayElementId:"#span-system-cost",
    },
    scBattery: {    
	prop:"scBattery",
	str:"",
	num:"",
	id:"sc-battery" ,
    },
    scBatteryCost: {    
	prop:"scBatteryCost",
	str:"",
	num:"",
	id:"sc-battery-cost" ,
    },
    scFit: {    
	prop:"scFit",
	str:"0",
	num:0,
	id:"sc-feed-in-tariff",
	fits: [
	    {
		state : "VIC",
		tariff : 7.1,
	    },{
		state : "NSW",
		tariff : 7.6,
	    },{
		state : "ACT",
		tariff : 7.6,
	    },{
		state : "SA",
		tariff : 8.5,
	    },{
		state : "QLD",
		tariff : 6.6,
	    },
	]
	
    }
}


