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

function getCurrentExchange(currency){
    $.ajax({
        type: "POST",
        url: "php/getCurrentExchange.php",
        dataType: "json",
        data: {
            currency: currency
        },
        success: function(data){
        
            $('.exchange-rate').html(data.data.rates[currency]);
            

            
        }
    })
}

function isPublicHoliday(countryCode) {
    let todayDate = new Date();
    let year = todayDate.getFullYear();
    console.log(year);
    let month = todayDate.getMonth()+1;
    console.log(month);
    let day = todayDate.getDate();
    console.log(day);

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
            console.log(data);
            
            if(data.data.length === 0){
                $(".public-holiday-boolean").html("No");
            } else {
                $(".public-holiday-boolean").html("Yes");
                $(".public-holiday-name").html(data.data[0].name);
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
                wikipedia.addLayer(L.marker([lat, lng]).bindPopup( "<img src='" +
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

function getWeather(capitalCity){
    $.ajax({
        url: "php/getWeather.php",
        type: 'POST',
        dataType: 'json',
        data: {
            capital_City: capitalCity
        },
        success: function(result) {

                $('.weather-icon').attr("src", 'https://openweathermap.org/img/wn/' + result.weather[0].icon + '@2x.png')
                $('.weather-description').html(result.weather[0].description.toUpperCase());
                $('.temperature').html(result.main.temp.toFixed() + '&#8451;');

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
            $('.countryName').html(result[0].name.common);
            $('#country-name-small-screen').html(result[0].name.common);
            $('.capital').html(result[0].capital);
            $('.population').html(numberWithCommas(result[0].population));
            $('.currency').html(currency);
            $('.currency-code').html(currency);
            $('.countryFlag').attr("src",result[0].flags.png);
            $('.wikipedia-link').attr("href", "https://en.wikipedia.org/wiki/" + result[0].name.common);
            $('.wikipedia-link').html("Click for " + result[0].name.common + " on Wikipedia" );
            let latlng = result[0].capitalInfo.latlng;
            map.setView(latlng);
            getBorder(countryCode);
            $('.weather-city').html("Weather in " + result[0].capital);
            getWeather(result[0].capital.toString());
            getCovid(countryCode);
            let iso2 = result[0].cca2;
            isPublicHoliday(iso2);
            getCurrentExchange(currency);
            
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

let easyButtons = [
    
  L.easyButton('<i class="material-icons" style="font-size:18px; padding-bottom: 3px; display: inline-flex; vertical-align: middle;">coronavirus</i>', function(){
    $('#covid-modal').modal('show');
  }),

  L.easyButton( '<i class="material-icons" style="font-size:18px; padding-bottom: 3px; display: inline-flex; vertical-align: middle;">thermostat</i>', function(){
    $('#weather-modal').modal('show');
  }),

  L.easyButton( '<i class="material-icons" style="font-size:18px; padding-bottom: 3px; display: inline-flex; vertical-align: middle;">currency_exchange</i>', function(){
    $('#exchange-modal').modal('show');
  })

];


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
            L.marker(latlng).addTo(map);
            
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
                        let userCountry = result.data.results[0].components["country"];
                        $('#select-country').prepend(`<option value="${countryCode}" selected>${userCountry}</option>`);
                        
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
            
            for(let i = 0; i < data['data'].length; i++){
                $('#select-country').append(`<option value="${data['data'][i]['properties']['iso_a3']}">${data['data'][i]['properties']['name']}</option>`);
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
