// on appel la map
let map = L.map('map').setView([45.4338900, 4.3900000], 7);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibG80MmZyIiwiYSI6ImNsMnB0aG5xdzBhcmYzYnFnZ3h1NWl0YzcifQ.18kIMtplqESntLmUXGJOrQ', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibG80MmZyIiwiYSI6ImNsMnB0aG5xdzBhcmYzYnFnZ3h1NWl0YzcifQ.18kIMtplqESntLmUXGJOrQ'
}).addTo(map);

// on place le cercle de ma formation
let circle = L.circle([45.4994, 4.24], {
    color: 'green',
    fillColor: '#f02',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);
circle.bindPopup("Mon lieu de formation DWWM");

// on place des marqueurs sur la map
let saintEtienne = L.marker([45.4338900, 4.3900000]).addTo(map);
let lyon = L.marker([45.764043, 4.835659]).addTo(map);
let valence = L.marker([44.9333, 4.8922]).addTo(map);

// on déclare les villes et le string pour la fin de l'url dans la fonction getWeather
saintEtienne.addEventListener('click', function () {
    getWeather('saint-Etienne-42');
});

lyon.addEventListener('click', function () {
    getWeather('lyon');
});

valence.addEventListener('click', function () {
    getWeather('valence-26');
});

// on appel l'api de la méteo avec AJAX dans cette fonction
function getWeather(endUrl) {

    let request = new XMLHttpRequest();
    // si c'est un tableau insertion de la lattitude puis de la logitude
    if (Array.isArray(endUrl)) {
        request.open('GET', `https://www.prevision-meteo.ch/services/json/lat=${endUrl[0]}lng=${endUrl[1]}`)
        // sinon le nom de la ville correspondante sur l'api
    } else {
        request.open('GET', `https://prevision-meteo.ch/services/json/${endUrl}`);
    }

    request.send();
    request.onreadystatechange = function () {
        // On check que tout est OK ( faire 2 if pour éviter les problèmes)
        if (this.readyState === 4) {
            if (this.status === 200) {
                const responseParsed = JSON.parse(request.responseText);
                insertValue(responseParsed);
            }
        }
    }
};


// on insert dans le DOM les infos dans cette fonction
function insertValue(nameCity) {

    // On RESET les div des resultats à chaque tour
    let allResultJ = document.querySelector('#resultT')
    allResultJ.innerHTML = ""
    let allResultW = document.querySelector('#resultW')
    allResultW.innerHTML = ""

    // selection de la div pour inserer
    let divResult = document.querySelector('#resultT')
    // creation de la div qui contient tout
    let newDivJ = document.createElement('div')
    // je lui et une classe 
    newDivJ.classList = 'card mb-5 col-3 mx-auto'
    // je crée un titre
    let titleCity = document.createElement('h3');
    // je créé un <p>
    let paraJ1 = document.createElement('p');
    // je crée l'image
    let imgWeatherDay = document.createElement('img');
    // je crée un span
    let dateSpan = document.createElement('span');
    // je créé un HR
    let insertHr = document.createElement('hr');

    // je donne des valeurs aux éléments
    titleCity.textContent = 'Actuellement';
    paraJ1.innerHTML = `Il fait ${nameCity.current_condition.tmp} degrés.`;
    imgWeatherDay.src = nameCity.current_condition.icon_big;
    dateSpan.innerHTML = `Le ${nameCity.current_condition.date} à ${nameCity.current_condition.hour} pour ${nameCity.city_info.name}`
    // j'insère dans les div en question

    divResult.append(newDivJ);
    newDivJ.append(titleCity, paraJ1, imgWeatherDay, insertHr, dateSpan);


    // on boucle dans l'api avec une for each
    for (let propriete in nameCity) {
        if (/fcst_day_[1-4]/.test(propriete)) {

            // je lui et une classe de l'endoit d'insertion'
            let divResult = document.querySelector('#resultW');
            // selection de la div pour inserer
            let newDivW = document.createElement('div')
            newDivW.classList = 'card mb-5 col-3 mx-auto'
            // je crée un titre
            let titleCityPlus = document.createElement('h4');
            // je crée le <p> ou j'injecterqi le résulat
            let paraJplusMin = document.createElement('p');
            let paraJplusMax = document.createElement('p');
            // je crée l'image
            let imgWeather = document.createElement('img');

            // je donne des valeurs aux éléments
            titleCityPlus.innerHTML = nameCity[propriete].day_long;
            paraJplusMin.innerHTML = `MIN: ${nameCity[propriete].tmin}c°`;
            paraJplusMax.innerHTML = `MAX : ${nameCity[propriete].tmax}c°`;
            imgWeather.src = nameCity[propriete].icon_big;

            // j'insere dans les div 
            divResult.appendChild(newDivW)
            newDivW.append(titleCityPlus, paraJplusMin, paraJplusMax, imgWeather);
        }
    }
};

// pour recuperer les villes au click (value des button avec boucle forEach) => renvoi dans la fonction getWeather
let buttonWeather = document.querySelectorAll('#buttonWeather button');
buttonWeather.forEach(function (button) {
    button.addEventListener('click', function () {

        getWeather(this.value)
    })
})

// pour recuperer les latitudes et longitudes au clique => écoute de map au clique
map.addEventListener('click', function (markers) {
    let target = markers.latlng
    let newMarker = L.marker([markers.latlng.lat, markers.latlng.lng]).addTo(map);
    getWeather([markers.latlng.lat, markers.latlng.lng]);
})