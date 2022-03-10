// chart

const years = 25
var yearLabels = Array.apply(0,new Array(years)).map(function(_,i){ return i+1 });

const ctx = document.getElementById('sc-compare-chart').getContext('2d');
export const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: yearLabels,
        datasets: [
	    {
		label: 'Solar cost over time',
		// data: [1200, 1900, 300, 500, 200, 300],
		backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
		],
		borderColor: [
                    'rgba(54, 162, 235, 1)',
		],
		borderWidth: 1
            },
	    {
		label: 'Energy retailer over time',
		// data: [600, 1200, 700, 600, 400, 1200],
		backgroundColor: [
                    'rgba(235, 164, 54, 0.2)',
		],
		borderColor: [
                    'rgba(235, 164, 54, 1)',
		],
		borderWidth: 1
            },
	]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

export function updateConfigByMutating(chart,solarData,gridData) {
    chart.data.datasets[0].data = [];
    chart.data.datasets[0].data.push(...solarData);

    chart.data.datasets[1].data = [];
    chart.data.datasets[1].data.push(...gridData);

    chart.update();
}
