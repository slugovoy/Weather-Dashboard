let currentDate = luxon.DateTime.local().toFormat("D");
function buildURL() {
  let queryURL = "https://api.openweathermap.org/data/2.5/weather?";
  let queryParams = { appid: "b822a69b22827a30f03ca2082b6ba3a1" };

  queryParams.q = $("#searchCity").val().trim();
  if ($("#searchCity").val() === "") return;

  return queryURL + $.param(queryParams);
}
//let currentDate = luxon.DateTime.local().toFormat("D");
$("#startSearch").on("click", function (e) {
  e.preventDefault();

  $("#cityInfo").empty();
  $("#day1").empty();
  $("#day2").empty();
  $("#day3").empty();
  $("#day4").empty();
  $("#day5").empty();

  let queryURL = buildURL();
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (data) {
    let city = $("<h3>").text(data.name + "(" + currentDate + ")");
    let F = Math.floor((data.main.temp - 273.15) * 1.8 + 32);
    let tempNow = $("<p>").text("Temperature: " + F + " F");
    let humidNow = $("<p>").text("Humidity: " + data.main.humidity + " %");
    let windSpeed = $("<p>").text("Wind Speed: " + data.wind.speed + " MPH");
    let indexUV = $("<p>").text("UV Index: ");
    $("#cityInfo").append(city, tempNow, humidNow, windSpeed);
    $("#citiesNames").append($("<h5>").attr("class", "searchHistory").text(data.name));

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
      method: "GET",
    }).then(function (response) {
      let UVI = response.current.uvi;
      let indexUV = $("<p>").text("UV Index: " + UVI);
      $("#cityInfo").append(indexUV);
      if (UVI <= 3){
          indexUV.addClass("green");
      }else if(UVI > 3 && UVI < 6){
        indexUV.addClass("yellow");
      }else if(UVI > 6 && UVI < 8){
        indexUV.addClass("orange");
      }else if(UVI > 8 && UVI < 11){
        indexUV.addClass("red");
      }else{
        indexUV.addClass("violet");
      }

      for (let i = 1; i < 6; i++) {
        let F1 = Math.floor((response.daily[i].temp.day - 273.15) * 1.8 + 32);

        $("#day" + [i]).append($("<h6>").text(currentDate + [i]));
        let condition = response.daily[i].weather[0].main;
        //$("#day"+[i]).append($("<p>").attr("class", "pForForecast").text(condition));
        if (condition == "Clear") {
          $("#day" + [i]).append($("<i>").attr("class", "fas fa-sun"));
        } else if (condition == "Rain") {
          $("#day" + [i]).append(
            $("<i>").attr("class", "fas fa-cloud-showers-heavy")
          );
        } else if (condition == "Clouds") {
          $("#day" + [i]).append($("<i>").attr("class", "fas fa-cloud"));
        }

        $("#day" + [i]).append(
          $("<p>")
            .attr("class", "pForForecast")
            .text("Temp.: " + F1 + "F")
        );

        $("#day" + [i]).append(
          $("<p>")
            .attr("class", "pForForecast")
            .text("Humidity: " + response.daily[i].humidity + "%")
        );
      }
      
    });
  });
});
