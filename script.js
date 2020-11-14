let currentDate = luxon.DateTime.local().toFormat("D");
function buildURL() {
  let queryURL = "https://api.openweathermap.org/data/2.5/weather?";
  let queryParams = { appid: "b822a69b22827a30f03ca2082b6ba3a1" };

  queryParams.q = $("#searchCity").val().trim();
  if ($("#searchCity").val() === "") return;

  return queryURL + $.param(queryParams);
}
let currentDate = luxon.DateTime.local().toFormat("D");
$("#startSearch").on("click", function (e) {
  e.preventDefault();
  let queryURL = buildURL();
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (data) {
    console.log(queryURL);
    let city = $("<h3>").text(data.name + "(" + currentDate + ")");
    let F = Math.floor((data.main.temp - 273.15) * 1.8 + 32);
    let tempNow = $("<p>").text("Temperature: " + F + " F");
    let humidNow = $("<p>").text("Humidity: " + data.main.humidity + " %");
    let windSpeed = $("<p>").text("Wind Speed: " + data.wind.speed + " MPH");
    let indexUV = $("<p>").text("UV Index: ");
    $("#cityInfo").append(city, tempNow, humidNow, windSpeed);
    $("#citiesNames").append($("<h5>").text(data.name));

    // Second call

    function buildSecondURL() {
        let querySecondURL = "https://api.openweathermap.org/data/2.5/onecall?";
        let querySecondParams = { appid: "b822a69b22827a30f03ca2082b6ba3a1" };
      
        querySecondParams.lat = data.coord.lat;
        querySecondParams.lon = data.coord.lon;
        console.log(querySecondParams);
      
      
        return querySecondURL + $.param(querySecondParams);
      }

      let secondQueryURL = buildSecondURL();
      $.ajax({
          url: secondQueryURL,
          method: "GET"
      }).then(function(response){
          console.log(secondQueryURL);
          let indexUV = $("<p>").text("UV Index: " + response.current.uvi); 
          $("#cityInfo").append(indexUV);


          for (let i = 1; i < 6; i++) {
              $("#cityForecast").append($("<h4>").text(currentDate + [i]))
              
          }

      })


  });
});
