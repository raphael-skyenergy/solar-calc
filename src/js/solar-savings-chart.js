// chart

const yearsSavingsOverTime = 25
var yearLabelsSavingsOverTime = Array.apply(0,new Array(yearsSavingsOverTime)).map(function(_,i){ return i+1 });

const ctxSavingsOverTime = document.getElementById('sc-solar-savings-chart').getContext('2d');
export const myChart = new Chart(ctxSavingsOverTime, {
    type: 'line',
    data: {
        labels: yearLabelsSavingsOverTime,
        datasets: [
	    {
		label: 'Solar savings over time',
		backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
		],
		borderColor: [
                    'rgba(54, 162, 235, 1)',
		],
		borderWidth: 1
            },
	]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            },
            x: {
                beginAtZero: true
            }
        }
    }
});

export function updateConfigByMutating(chart,savingsData) {
    chart.data.datasets[0].data = [];
    chart.data.datasets[0].data.push(...savingsData);
    chart.update();
}
