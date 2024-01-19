import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

import {Doughnut} from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const Doughnutchart = () => {
    const data = {
       labels: ['Calories consumed', 'Calories remaining'],
       datasets: [{
        label: 'Food tracker',
        data: [1560, 440],
        backgroundColor: ['black', 'white'],
        borderColor: ['black', 'white']
       }]
    }

    const options = {}
}

export default Doughnutchart

