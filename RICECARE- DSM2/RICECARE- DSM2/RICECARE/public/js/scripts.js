// Função para o calendario
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: '/events',
        editable: true,
        dateClick: function(info) {
            alert('Data selecionada: ' + info.dateStr);
        }
    });
    calendar.render();
    calendar.updateSize();
});



// Função para obter a previsão do tempo
async function getWeather() {
    const cityName = 'Registro';
    const apiKey = '64ef4b1fb36209c95f622ca1204a346b';

    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        const results = await fetch(apiURL);
        const json = await results.json();

        if (json.cod === 200) {
            showInfo({
                city: json.name,
                country: json.sys.country,
                temp: json.main.temp,
                tempMax: json.main.temp_max,
                tempMin: json.main.temp_min,
                description: json.weather[0].description,
                tempIcon: json.weather[0].icon,
                windSpeed: json.wind.speed,
                humidity: json.main.humidity,
            });
        } else {
            showAlert("Não foi possível localizar");
        }
    } catch (error) {
        console.error('Erro ao obter a previsão do tempo:', error);
        showAlert("Erro ao obter a previsão do tempo.");
    }
}


// Função para mostrar informações do tempo
function showInfo(json) {
    document.querySelector('#title').innerHTML = `${json.city}, ${json.country}`;
    document.querySelector('#temp_value').innerHTML = `${json.temp.toFixed(1).toString().replace('.', ',')} <sup>°</sup>`;
    document.querySelector('#temp_max').innerHTML = `${json.tempMax.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#temp_min').innerHTML = `${json.tempMin.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#temp_description').innerHTML = `${json.description} `;
    document.querySelector('#humidity').innerHTML = `${json.humidity} <sup>%</sup>`;
    document.querySelector('#wind').innerHTML = `${json.windSpeed}<sup>km/h</sup>`;
    document.querySelector('#temp_img').setAttribute('src', `http://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);
}

// Carrega a previsão do tempo automaticamente ao carregar a página
document.addEventListener('DOMContentLoaded', getWeather);

