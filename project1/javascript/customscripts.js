$(document).ready(function() {
    $('#select-country').select2();
        });

$(window).on("load", function(){
    spin(); 
    getUserLocation(); 
    populateCountriesList(); 
    getCovid();
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

let poi = new L.MarkerClusterGroup();

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
            console.log(data);

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

        }
    })

}


function getBorder(countryCode){
    $.ajax({
        type: "GET",
        url: "php/getBorders.php",
        dataType: "json",
        data: {
            country_Code: countryCode
        },
        success: function(data) {

            country_boundary.clearLayers();
            country_boundary.addData(data);
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


            
            function getDay(millitime) {
            let date = new Date(millitime);
            let day;
            switch (date.getDay()) {

                case 0:
                    day = "Sunday";
                break;

                case 1:
                    day = "Monday";
                break;

                case 2:
                    day = "Tuesday";
                break;

                case 3:
                    day = "Wednesday";
                break;

                case 4:
                    day = "Thursday";
                break;

                case 5:
                    day = "Friday";
                break;

                case 6:
                    day = "Saturday";
                break;

                }
                   return day; 
                }

                let dayOne = getDay(ForecastDayOne);
                let dayTwo = getDay(ForecastDayTwo);
                let dayThree = getDay(ForecastDayThree);
        
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
            // your error code
        },

        
    }); 
}


/**Populate list for user to select country */

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
            $('#population').html(numberWithCommas(result[0].population));
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
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
        }
    });
}

function getCovid(countryCode) {
    let newStartDate = new Date();
    let newEndDate = new Date();
    let endDateMilli = newEndDate.setDate(newEndDate.getDate() - 2);
    let startDateMilli = newStartDate.setDate(newStartDate.getDate() - 3);
    
    function convertDate(dateInMilli){
        var date = new Date(dateInMilli); // Date 2011-05-09T06:08:45.178Z
        var year = date.getFullYear();
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var day = ("0" + date.getDate()).slice(-2);
        
        return `${year}-${month}-${day}`;

    }

    let startDate = convertDate(startDateMilli);
    let endDate = convertDate(endDateMilli);

    $.ajax({
        type: "POST",
        url: "php/getCovid.php",
        dataType: "json",
        data: {
            start_Date: startDate,
            end_Date: endDate,
        },
        success: function(data) {

            let infections = data.data[startDate][countryCode]['confirmed'];
            let deaths = data.data[startDate][countryCode]['deaths'];
            var date = new Date(startDate);

            $('.total-infections').html(numberWithCommas(infections));
            $('.total-deaths').html(numberWithCommas(deaths));
            $('.covid-data-date').html(date.toDateString());
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(errorThrown + ' ' + jqXHR + ' ' + textStatus);
        }
        
    });
}

let covidButton = L.easyButton('<i class="material-icons" style="font-size:18px; padding-bottom: 3px; display: inline-flex; vertical-align: middle;">coronavirus</i>', function(){
    $('#covid-modal').modal('show');
  });

let weatherButton = L.easyButton( '<i class="material-icons" style="font-size:18px; padding-bottom: 3px; display: inline-flex; vertical-align: middle;">thermostat</i>', function(){
    $('#weather-modal').modal('show');
  });

let exchangeButton = L.easyButton( '<i class="material-icons" style="font-size:18px; padding-bottom: 3px; display: inline-flex; vertical-align: middle;">currency_exchange</i>', function(){
    $('#exchange-modal').modal('show');
  });
    
let countryInfoButton =  L.easyButton( '<i class="material-icons" style="font-size:18px; padding-bottom: 3px; display: inline-flex; vertical-align: middle;">info</i>', function(){
    $('#countryinformation-modal').modal('show');
  });

  weatherButton.button.style.backgroundColor = 'yellow';
  covidButton.button.style.backgroundColor = 'red';
  exchangeButton.button.style.backgroundColor = 'green';
  countryInfoButton.button.style.backgroundColor = 'blue';

let easyButtons = [covidButton, weatherButton, exchangeButton, countryInfoButton];


L.easyBar(easyButtons).addTo(map);


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
                    // your error code
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
