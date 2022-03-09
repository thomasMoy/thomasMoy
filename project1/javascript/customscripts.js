$(document).ready(function() {
    $('#select-country').select2();

        });

$(window).on("load", function(){
    spin(); 
    getUserLocation(); 
    populateCountriesList(); 
    
})
let worldStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });

var map = L.map('map').setView([0,0], 5);



var countryCode;

let country_boundary = new L.geoJson().addTo(map);


function spin() {
  myVar = setTimeout(showPage, 3000);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("map-container").style.opacity = "100";
}

var redMarker = L.ExtraMarkers.icon({
    icon: 'fa-compass',
    markerColor: 'red',
    shape: 'circle',
    prefix: 'fa'
  });

var camMarker = L.ExtraMarkers.icon({
    icon: 'fa-video',
    markerColor: 'blue',
    shape: 'square',
    prefix: 'fa'
  });

let poi = new L.MarkerClusterGroup();
let webcams = new L.MarkerClusterGroup();

function getNews(iso2){
    $.ajax({
        type: "POST",
        url: "php/getNews.php",
        dataType: "json",
        data: {
            iso2: iso2
        },
        success: function(data) {
        
        let newsCardBody = document.getElementById('news-modal-body');
            
            while (newsCardBody.firstChild) {
                newsCardBody.removeChild(newsCardBody.firstChild);
            }

        
        let resultArray = data.data.articles;
            
        for (let i=0; i<resultArray.length; i++) {

            let image = resultArray[i].urlToImage;

            if (image) {
                image = image;
            } else {
                image = "images/RE4qVtM.jpg"
            }

            $('#news-modal-body').append(`
            <div class="card" style="width: 20rem; margin:0rem !important">
            <img src=${image} class="card-img-top" alt="">
            <div class="card-body">
              <h5 class="card-title">${resultArray[i].title}</h5>
              <p class="card-text">${resultArray[i].content}</p>
              <a href=${resultArray[i].url} class="btn btn-primary" target="_blank">Read more</a>
            </div>
          </div>
            `)
        }    
            
        

        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
        }
    });
}

function getPOI(iso2) {

    if(iso2 == 'GB'){
        iso2 = 'uk';
    
    }

    iso2 = iso2.toLowerCase();

    $.ajax({
        type: "POST",
        url: "php/getPOI.php",
        dataType: "json",
        data: {
            iso2: iso2
        },
        success: function(data) {
            

            poi.clearLayers();

            let poiArray = data.data.results;

            for (let i=0; i<poiArray.length; i++){
                let lat = data.data.results[i].coordinates.latitude;
                let lng = data.data.results[i].coordinates.longitude;
                poi.addLayer(L.marker([lat, lng], {icon: redMarker}).bindPopup( "<h4>" + data.data.results[i].name + "</h4>"
                + "<p>" + data.data.results[i].snippet + "</p>"
                ));
            }
            map.addLayer(poi);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
        }
    })
}

function getwebCams(iso2) {
    $.ajax({
        type: "POST",
        url: "php/getwebCams.php",
        dataType: "json",
        data: {
            iso2: iso2
        },
        success: function(data) {
            

            let webCamLink = data.data.result.webcams;


            for (i=0; i<webCamLink.length; i++) {
                let lat = webCamLink[i].location.latitude;
                let lng = webCamLink[i].location.longitude;
                webcams.addLayer(L.marker([lat, lng], {icon: camMarker}).bindPopup(
                    `
                    <h5>${webCamLink[i].title}</h5>
                    <iframe src=${webCamLink[i].player.day.embed}></iframe>
                    
                    `
                ));
            }
            map.addLayer(webcams);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
        }
    })
}

function getCurrentExchange(currency){
    $.ajax({
        type: "POST",
        url: "php/getCurrentExchange.php",
        dataType: "json",
        data: {
            currency: currency
        },
        success: function(data){
            
            $('#current-digit').html(data.data.rates[currency].toFixed(3));
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
        }
    })
}

function isPublicHoliday(countryCode) {
    let todayDate = new Date();
    let year = todayDate.getFullYear();
    let month = todayDate.getMonth()+1;
    let day = todayDate.getDate();

    $.ajax({
        type: "POST",
        url: "php/getPublicHoliday.php",
        dataType: "json",
        data: {
            countryCode: countryCode,
            year: year,
            month: month,
            day: day
        },
        success: function(data){
            
            
            if(data.data.length === 0){
                $("#public-holiday").html("No");
            } else {
                $("#public-holiday").html(data.data[0].name);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
        }
    })
}

let wikipedia = new L.MarkerClusterGroup();

function getWiki(north, east, south, west){
    $.ajax({
        type: "POST",
        url: "php/getWiki.php",
        dataType: "json",
        data: {
            north: north,
            south: south,
            west: west,
            east: east
        },
        success: function(data){
            wikipedia.clearLayers();

            for (let i=0; i<data.data.length; i++){
                let lat = data.data[i].lat;
                let lng = data.data[i].lng;
                wikipedia.addLayer(L.marker([lat, lng], {icon: redMarker}).bindPopup( "<img src='" +
                data.data[i].thumbnailImg +
                "' width='100px' height='100px' alt='" +
                data.data[i].title +
                "'><br><b>" +
                data.data[i].title +
                "</b><br><a href='https://" +
                data.data[i].wikipediaUrl +
                "' target='_blank'>Wikipedia Link</a>"));
            }
            
            map.addLayer(wikipedia);

        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
        }
    })

}


function getBorder(countryCode){

    function boundryColor() {
        return {
          fillColor: "green",
          weight: 1,
          opacity: 0.1,
          color: "white",
          fillOpacity: 0.6,
        };
      }
    $.ajax({
        type: "GET",
        url: "php/getBorders.php",
        dataType: "json",
        data: {
            country_Code: countryCode
        },
        success: function(data) {

            country_boundary.clearLayers();
            country_boundary.addData(data).setStyle(boundryColor());
            const bounds = country_boundary.getBounds();
            map.fitBounds(bounds);
            let mapEast = bounds.getEast();
            let mapWest = bounds.getWest();
            let mapSouth = bounds.getSouth();
            let mapNorth = bounds.getNorth();
            getWiki(mapNorth, mapEast, mapSouth, mapWest);
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
        }
        
    });
    
}

function getWeather(lat, lng){
    $.ajax({
        url: "php/getWeather.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: lat,
            lng: lng
        },
        success: function(result) {

            function addTrailingZeros(returnedMilliTime) {
                let stringTime = returnedMilliTime.toString();
                let timeWithZeros = stringTime + "000";
                let newTimeNumWithZeros = parseInt(timeWithZeros);
                return newTimeNumWithZeros;
            }

            let ForecastDayOne = addTrailingZeros(result.data.daily[1].dt);
            let ForecastDayTwo = addTrailingZeros(result.data.daily[2].dt);
            let ForecastDayThree = addTrailingZeros(result.data.daily[3].dt);

            let dayOne = new Date(ForecastDayOne).toString('dddd, MMMM dd');
            let dayTwo = new Date(ForecastDayTwo).toString('dddd, MMMM dd');
            let dayThree = new Date(ForecastDayThree).toString('dddd, MMMM dd');

                
        
                $('#weather-icon').attr("src", 'https://openweathermap.org/img/wn/' + result.data.current.weather[0].icon + '@2x.png')
                $('#weather-desc').html(result.data.current.weather[0].description.toUpperCase());
                $('#temperature').html(result.data.current.temp.toFixed() + '&#8451;');
                $('#feels-like').html(result.data.current.feels_like.toFixed() + '&#8451;');
                $('#day-one-day').html(dayOne);
                $('#day-two-day').html(dayTwo);
                $('#day-three-day').html(dayThree);
                $('#day-one-icon').attr("src", 'https://openweathermap.org/img/wn/' + result.data.daily[1].weather[0].icon + '@2x.png');
                $('#day-one-temp').html(result.data.daily[1].temp.day.toFixed() + '&#8451;');
                $('#day-two-icon').attr("src", 'https://openweathermap.org/img/wn/' + result.data.daily[2].weather[0].icon + '@2x.png');
                $('#day-two-temp').html(result.data.daily[2].temp.day.toFixed() + '&#8451;');
                $('#day-three-icon').attr("src", 'https://openweathermap.org/img/wn/' + result.data.daily[3].weather[0].icon + '@2x.png');
                $('#day-three-temp').html(result.data.daily[3].temp.day.toFixed() + '&#8451;');
                $('#day-one-desc').html(result.data.daily[1].weather[0].description.toUpperCase());
                $('#day-two-desc').html(result.data.daily[2].weather[0].description.toUpperCase());
                $('#day-three-desc').html(result.data.daily[3].weather[0].description.toUpperCase());
                



        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
        },

        
    }); 
}




function getCountryInfo(countryCode) {
    $.ajax({
        type: "POST",
        url: "php/getCountryInfo.php",
        dataType: "json", 
        data: {
            country_Code: countryCode
        },
        success: function(result) {

            let currency = Object.keys(result[0].currencies)[0];

            let currencyName = result[0].currencies[Object.keys(result[0].currencies)[0]].name.toUpperCase();
            let symbol = result[0].currencies[Object.keys(result[0].currencies)[0]].symbol;
            $('#current-symbol').html(symbol);
            $('.currency-name').html(currencyName);
            $('.countryName').html(result[0].name.common);
            $('#country-name-small-screen').html(result[0].name.common);
            $('.capital').html(result[0].capital);
            $('#population').html(result[0].population);
            $('.currency').html(currency);
            $('.currency-code').html(currency);
            $('#countryFlag').attr("src",result[0].flags.png);
            $('#wikipedia-link').attr("href", "https://en.wikipedia.org/wiki/" + result[0].name.common);
            $('#wikipedia-link').html(result[0].name.common + " on Wikipedia");
            let latlng = result[0].capitalInfo.latlng;
            let lat = latlng[0];
            let lng = latlng[1];
            map.setView(latlng);
            getBorder(countryCode);
            $('.weather-city').html("Weather in " + result[0].capital);
            getWeather(lat, lng);
            getCovid(countryCode);
            let iso2 = result[0].cca2;
            isPublicHoliday(iso2);
            getCurrentExchange(currency);
            getPOI(iso2);
            getNews(iso2);
            getwebCams(iso2);
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
        }
    });
}

function getCovid(countryCode) {
    
    let startDate = Date.today().addDays(-3).toString("yyyy-MM-dd");
    let endDate = Date.today().addDays(-2).toString("yyyy-MM-dd");


    $.ajax({
        type: "POST",
        url: "php/getCovid.php",
        dataType: "json",
        data: {
            start_Date: startDate,
            end_Date: endDate,
            countryCode: countryCode
        },
        success: function(data) {
            let covidInfo = data.data.data[startDate][countryCode];
            
            let infections = covidInfo.confirmed;
            let deaths = data.data.data[startDate][countryCode].deaths;
            

            $('.total-infections').html(infections);
            $('.total-deaths').html(deaths);
            $('.covid-data-date').html(new Date().addDays(-3).toString('dddd, MMMM dd'));
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
        }
        
    });
}

let countryInfoButton =  L.easyButton( '<i class="material-icons" style="font-size:18px; padding-bottom: 3px; display: inline-flex; vertical-align: middle;">info</i>', function(){
    $('#countryinformation-modal').modal('show');
  }, 'Country Information');

let covidButton = L.easyButton('<i class="material-icons" style="font-size:18px; padding-bottom: 3px; display: inline-flex; vertical-align: middle;">coronavirus</i>', function(){
    $('#covid-modal').modal('show');
  }, 'Covid-19 Figures');

let weatherButton = L.easyButton( '<i class="material-icons" style="font-size:18px; padding-bottom: 3px; display: inline-flex; vertical-align: middle;">thermostat</i>', function(){
    $('#weather-modal').modal('show');
  }, 'Weather Forecast');

let exchangeButton = L.easyButton( '<i class="material-icons" style="font-size:18px; padding-bottom: 3px; display: inline-flex; vertical-align: middle;">currency_exchange</i>', function(){
    $('#exchange-modal').modal('show');
  }, 'Exchange Rates');

let newsButton = L.easyButton( '<i class="material-icons" style="font-size:18px; padding-bottom: 3px; display: inline-flex; vertical-align: middle;">newspaper</i>', function(){
    $('#news-modal').modal('show');
  }, 'Latest News');
    



countryInfoButton.addTo(map);
covidButton.addTo(map);
weatherButton.addTo(map);
exchangeButton.addTo(map);
newsButton.addTo(map);

/**Prompting user to accept use of their location */
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            var latlng = new L.LatLng(latitude, longitude);
            map.setView(latlng, 5);
            map.addLayer(worldStreetMap);
            
            $.ajax({
                url: "php/getUserCountry.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    latLng: `${latitude},${longitude}`
                },
                success: function(result) {
    
                    if (result.status.name == "ok") {
                    
                        countryCode = result.data.results[0].components["ISO_3166-1_alpha-3"];
                        let iso2 = result.data.results[0].components["ISO_3166-1_alpha-2"];
                        let userCountry = result.data.results[0].components["country"];
                        $('#select-country').prepend(`<option value="${countryCode}" selected>${userCountry}</option>`);
                        getPOI(iso2);
                        getBorder(countryCode);
                        getCountryInfo(countryCode);
                        getCovid(countryCode);
                    }
                
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
                } 
                
            });

            
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function populateCountriesList() {

    $.ajax({
        type: "GET",
        url: "php/populateCountriesList.php",
        dataType: "json",
        success: function(data) {
    
            for(let i = 0; i < data.length; i++){
                $('#select-country').append(`<option value="${data[i][1]}">${data[i][0]}</option>`);
            }
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
        }
    });
}

$('#select-country').change(function(){
    getCountryInfo(this.value);
})








    
    































/**jQuery */