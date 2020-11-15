$(document).ready(function () {
    // Declaring the variables for icons and current day
    let currentDate = luxon.DateTime.local().toFormat("D");
    let sunIcon = $("<i>").attr("class", "fas fa-sun");
    let cloudsIcon = $("<i>").attr("class", "fas fa-cloud");
    let rainIcon = $("<i>").attr("class", "fas fa-cloud-showers-heavy");
    let startSearchBtn = $("#startSearch");
    let apiKey = "b822a69b22827a30f03ca2082b6ba3a1";

    // function to start search on click
  
    startSearchBtn.on("click", function (e) {
      e.preventDefault();
    //   Get value from user's input
      let citySearch = $("#searchCity").val().trim();

    //   Clear fields before placing info to prevent doubling
      $("#cityInfo").empty();
      $("#citiesNames").empty();
      $("#day1").empty();
      $("#day2").empty();
      $("#day3").empty();
      $("#day4").empty();
      $("#day5").empty();

    //   If user didn't request info but pushed search button
      if (citySearch === "") return;

    //   Else fire the function
      getWeather(citySearch);
    //   And push city name to the local storage
      history.push(citySearch);
      window.localStorage.setItem("history", JSON.stringify(history));
    });

//   Generate weather's data function
    function getWeather(citySearch) {

        // Generate URL
      let queryURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        citySearch +
        "&APPID=" +
        apiKey;
  
        // First call to get search by name
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (data) {
        
        // Variable to get weather's condition
        let conditionMain = data.weather[0].main;
  
        // Creating element for city name
        let city = $("<h3>")
          .attr("class", "cityName2")
          .text(data.name + "(" + currentDate + ")");

        //   Conditions for displaing icon depending on data from server
  
        if (conditionMain == "Clear") {
          city.append(sunIcon);
        } else if (conditionMain == "Rain") {
          city.append(rainIcon);
        } else if (conditionMain == "Clouds") {
          city.append(cloudsIcon);
        }

        // Creating element to display different data
        let F = Math.floor((data.main.temp - 273.15) * 1.8 + 32);
        let tempNow = $("<p>").text("Temperature: " + F + " F");
        let humidNow = $("<p>").text("Humidity: " + data.main.humidity + " %");
        let windSpeed = $("<p>").text("Wind Speed: " + data.wind.speed + " MPH");

        // Append element to the page
        $("#cityInfo").append(city, tempNow, humidNow, windSpeed);
        makeHistory();
  
        // SECOND CALL

        // Function to build URL for second request
  
        function buildSecondURL() {
          let querySecondURL = "https://api.openweathermap.org/data/2.5/onecall?";

        //   Create object to keep keys for URL
          let querySecondParams = { appid: "b822a69b22827a30f03ca2082b6ba3a1" };
          querySecondParams.lat = data.coord.lat;
          querySecondParams.lon = data.coord.lon;
  
        //   Return URL
          return querySecondURL + $.param(querySecondParams);
        }
        // Variable to fire previous function
        let secondQueryURL = buildSecondURL();
       
        // Second request
        $.ajax({
          url: secondQueryURL,
          method: "GET",
        }).then(function (response) {

            // Variable to keep request for specific data
          let UVI = response.current.uvi;

        //   Create element for UV index
          let indexUV = $("<p>")
            .text("UV Index: ")
            .append($("<span>").attr("class", "uviColor").text(UVI));

            // Append created element to the text area
          $("#cityInfo").append(indexUV);

        //   Conditions for displaing color depending on data from server
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
  
        //   Loop for display 5-day forecast
          for (let i = 1; i < 6; i++) {

            // Variables for the loop
            let F1 = Math.floor((response.daily[i].temp.day - 273.15) * 1.8 + 32);
            let dateInUNIX = response.daily[i].dt;
            let daysInRow = luxon.DateTime.fromSeconds(dateInUNIX).toFormat("D");
    
            // Create element for the date
            $("#day" + [i]).append($("<h6>").text(daysInRow));
            let condition = response.daily[i].weather[0].main;
  
            // Conditions for displaing icon depending on data from server
            if (condition == "Clear") {
              $("#day" + [i]).append($("<i>").attr("class", "fas fa-sun"));
            } else if (condition == "Rain") {
              $("#day" + [i]).append(
                $("<i>").attr("class", "fas fa-cloud-showers-heavy")
              );
            } else if (condition == "Clouds") {
              $("#day" + [i]).append($("<i>").attr("class", "fas fa-cloud"));
            }
  
            // Create element for the temperature
            $("#day" + [i]).append(
              $("<p>")
                .attr("class", "pForForecast")
                .text("Temp.: " + F1 + "F")
            );
  
            // Create element for the humidity
            $("#day" + [i]).append(
              $("<p>")
                .attr("class", "pForForecast")
                .text("Humidity: " + response.daily[i].humidity + "%")
            );
          }
        });
      });
    }

    // Variable for local storage
    var history = JSON.parse(window.localStorage.getItem("history")) || [];
  
    // Function to append city names to the history box
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
  
    // Function to clear history box and local storage
    $("#clearBtn").on("click", function () {
      localStorage.clear();
      $("#citiesNames").empty();
    });
  
    if (history.length > 0) {
      getWeather(history[history.length - 1]);
    }
  

    // Function to display previous data if you click city name in history box
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

    // Event listener for previous funstion
    $(document).on("click", historyOnClick);
  });
