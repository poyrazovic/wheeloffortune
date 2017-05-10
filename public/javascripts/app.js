let data = localStorage.getItem('wheelOfFortuneData');

data = data ? $.parseJSON(data) : {
    titles: '',
    photos: '',
    colors: '',
    values: ''
    };
console.log(data);
const $wheelOfFortune = $('#wheel-of-fortune');

let wheelOfFortune = new Chart($wheelOfFortune[0], {
    type: 'pie',
    data: {
        labels: ["kişi 1", "Kişi 2", "Kişi 3", "Kişi 4", "Kişi 5", "Kişi 6", "Kişi 7", "Kişi 8", "Kişi 9", "Kişi 10"],
        datasets: [
            {
                fill: true,
                backgroundColor: [
                    '#9400D3',
                    '#7900af',
                    '#4B0082',
                    '#0000FF',
                    '#00FF00',
                    '#FFFF00',
                    '#bfbf00',
                    '#FF7F00',
                    '#bb5e00',
                    '#FF0000'
                ],
                data: [10,10,10,10,10,10,10,10,10,10]
            }
        ]
    }
});


