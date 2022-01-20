$('#buttonrun1').on('click', function() {

    $('#timezoneRes').show();
    $('#weatherRes').hide();
    $('#oceanRes').hide();


    $.ajax({
      url: "libs/php/getTimeZone.php",
      type: 'POST',
      dataType: 'json',
      data: {
        longitude: $('#long').val(),
        latitude: $('#lat').val()
      },
      success: function(result) {
  
        console.log(JSON.stringify(result));
  
        if (result.status.name == "ok") {
  
          $('#sunrise').html(result.data.sunrise);
          $('#sunset').html(result.data.sunset);
          $('#country').html(result.data.countryName);
          $('#timeZone').html(result.data.timezoneId);
          $('#timeNow').html(result.data.time);
  
        }
      
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // your error code
      }
    }); 
  
});

$('#buttonrun2').on('click', function() {

    $('#weatherRes').hide();
    $('#timezoneRes').hide();
    $('#oceanRes').show();

  $.ajax({
    url: "libs/php/getOcean.php",
    type: 'POST',
    dataType: 'json',
    data: {
      longitudea: $('#long1').val(),
      latitudea: $('#lat1').val()
    },
    success: function(result) {

      console.log(JSON.stringify(result));
  
    if (result.status.name == "ok") {

        $('#ocean').html(result.data.ocean.name);
  

      }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // your error code
    }
  }); 

});

      $('#buttonrun3').on('click', function() {

      $('#oceanRes').hide();
      $('#timezoneRes').hide();
      $('#weatherRes').show();
      

        $.ajax({
          url: "libs/php/getWeather.php",
          type: 'POST',
          dataType: 'json',
          data: {
            icaoCode: $('#selAirport').val()
          },
          success: function(result) {

            console.log(JSON.stringify(result));
        
          if (result.status.name == "ok") {

              $('#airName').html(result.data.weatherObservation.stationName);
              $('#windSp').html(result.data.weatherObservation.windSpeed);
              $('#temp').html(result.data.weatherObservation.temperature);
              $('#windDir').html(result.data.weatherObservation.windDirection);
            }
          
          },
          error: function(jqXHR, textStatus, errorThrown) {
            // your error code
          }
        }); 

      });


      