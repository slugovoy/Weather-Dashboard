$(document).ready(function () {
    let currentDate = luxon.DateTime.local().toFormat("D");
    let sunIcon = $("<i>").attr("class", "fas fa-sun");
    let cloudsIcon = $("<i>").attr("class", "fas fa-cloud");
    let rainIcon = $("<i>").attr("class", "fas fa-cloud-showers-heavy");
    let startSearchBtn = $("#startSearch");
    let apiKey = "b822a69b22827a30f03ca2082b6ba3a1";
  
    startSearchBtn.on("click", function (e) {
      e.preventDefault();
      let citySearch = $("#searchCity").val().trim();
      $("#cityInfo").empty();
      $("#citiesNames").empty();
      $("#day1").empty();
      $("#day2").empty();
      $("#day3").empty();
      $("#day4").empty();
      $("#day5").empty();
      if (citySearch === "") return;
      getWeather(citySearch);
      history.push(citySearch);
      window.localStorage.setItem("history", JSON.stringify(history));
    });
  
    function getWeather(citySearch) {
      let queryURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        citySearch +
        "&APPID=" +
        apiKey;
  
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (data) {
        let conditionMain = data.weather[0].main;
  
        let city = $("<h3>")
          .attr("class", "cityName2")
          .text(data.name + "(" + currentDate + ")");
  
        if (conditionMain == "Clear") {
          city.append(sunIcon);
        } else if (conditionMain == "Rain") {
          city.append(rainIcon);
        } else if (conditionMain == "Clouds") {
          city.append(cloudsIcon);
        }
        let F = Math.floor((data.main.temp - 273.15) * 1.8 + 32);
        let tempNow = $("<p>").text("Temperature: " + F + " F");
        let humidNow = $("<p>").text("Humidity: " + data.main.humidity + " %");
        let windSpeed = $("<p>").text("Wind Speed: " + data.wind.speed + " MPH");
        let indexUV = $("<p>").text("UV Index: ");
        $("#cityInfo").append(city, tempNow, humidNow, windSpeed);
        makeHistory();
  
        // Second call
  
        function buildSecondURL() {
          let querySecondURL = "https://api.openweathermap.org/data/2.5/onecall?";
          let querySecondParams = { appid: "b822a69b22827a30f03ca2082b6ba3a1" };
  
          querySecondParams.lat = data.coord.lat;
          querySecondParams.lon = data.coord.lon;
  
          return querySecondURL + $.param(querySecondParams);
        }
        let secondQueryURL = buildSecondURL();
        console.log(secondQueryURL);
        $.ajax({
          url: secondQueryURL,
          method: "GET",
        }).then(function (response) {
          let UVI = response.current.uvi;
          let indexUV = $("<p>")
            .text("UV Index: ")
            .append($("<span>").attr("class", "uviColor").text(UVI));
          $("#cityInfo").append(indexUV);
          if (UVI <= 3) {
            $(".uviColor").addClass("green");
          } else if (UVI > 3 && UVI < 6) {
            $(".uviColor").addClass("yellow");
          } else if (UVI > 6 && UVI < 8) {
            $(".uviColor").addClass("orange");
          } else if (UVI > 8 && UVI < 11) {
            $(".uviColor").addClass("red");
          } else {
            $(".uviColor").addClass("violet");
          }
  
          for (let i = 1; i < 6; i++) {
            let F1 = Math.floor((response.daily[i].temp.day - 273.15) * 1.8 + 32);
  
            let dateInUNIX = response.daily[i].dt;
            let daysInRow = luxon.DateTime.fromSeconds(dateInUNIX).toFormat("D");
  
            $("#day" + [i]).append($("<h6>").text(daysInRow));
            let condition = response.daily[i].weather[0].main;
  
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
    }
    var history = JSON.parse(window.localStorage.getItem("history")) || [];
  
    function makeHistory() {
      function makeRow(text) {
        $("#citiesNames").prepend(
          $("<h5>").attr("class", "searchHistory").text(text)
        );
      }
  
      for (let i = 0; i < history.length; i++) {
        makeRow(history[i]);
      }
    }
  
    $("#clearBtn").on("click", function () {
      localStorage.clear();
      $("#citiesNames").empty();
    });
  
    if (history.length > 0) {
      getWeather(history[history.length - 1]);
    }
  
    function historyOnClick(event) {
      var h5El = event.target;
      if (event.target.matches("h5")) {
        $("#cityInfo").empty();
        $("#citiesNames").empty();
        $("#day1").empty();
        $("#day2").empty();
        $("#day3").empty();
        $("#day4").empty();
        $("#day5").empty();
        city = h5El.textContent.trim();
  
        getWeather(city);
      }
    }
    $(document).on("click", historyOnClick);
  });
