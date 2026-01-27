(function () {
  "use strict";

  /* ===== Chart colors (muted, dashboard-like) ===== */
  var COLOR_TEMP = "#c2410c";
  var COLOR_TEMP_BG = "rgba(194, 65, 12, 0.08)";
  var COLOR_HUM = "#0369a1";
  var COLOR_HUM_BG = "rgba(3, 105, 161, 0.08)";
  var COLOR_TREND = "#6366f1";
  var COLOR_TREND_BG = "rgba(99, 102, 241, 0.08)";

  var WEATHER_MAX_POINTS = 20;
  var WEATHER_POLL_MS = 60 * 1000;
  var AXIS_FONT_SIZE = 12;
  var LEGEND_FONT_SIZE = 11;

  /* ===== Load chart (trend) ===== */
  var chartCanvas = document.getElementById("loadChart");
  var loadChart = null;

  if (chartCanvas) {
    var ctx = chartCanvas.getContext("2d");
    loadChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [{
          label: "Load (MW)",
          data: [],
          borderColor: COLOR_TREND,
          backgroundColor: COLOR_TREND_BG,
          tension: 0.35,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 5,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: {
            display: true,
            labels: { font: { size: LEGEND_FONT_SIZE } },
          },
        },
        scales: {
          x: {
            title: { display: true, text: "Time", font: { size: AXIS_FONT_SIZE } },
            ticks: { font: { size: AXIS_FONT_SIZE }, maxRotation: 45 },
          },
          y: {
            title: { display: true, text: "MW", font: { size: AXIS_FONT_SIZE } },
            ticks: { font: { size: AXIS_FONT_SIZE } },
            suggestedMin: 2500,
            suggestedMax: 9500,
          },
        },
      },
    });
  }

  function addLoadPoint(mw) {
    if (!loadChart) return;
    var now = new Date().toLocaleTimeString();
    loadChart.data.labels.push(now);
    loadChart.data.datasets[0].data.push(mw);
    if (loadChart.data.labels.length > 20) {
      loadChart.data.labels.shift();
      loadChart.data.datasets[0].data.shift();
    }
    loadChart.update();
  }

  /* ===== Weather charts ===== */
  var weatherTempChart = null;
  var weatherHumidityChart = null;
  var weatherChartsRevealed = false;

  var scaleOpts = {
    x: {
      title: { display: true, text: "Time", font: { size: AXIS_FONT_SIZE } },
      ticks: { font: { size: AXIS_FONT_SIZE }, maxRotation: 45 },
    },
    y: {
      title: { display: true, text: "°C", font: { size: AXIS_FONT_SIZE } },
      ticks: { font: { size: AXIS_FONT_SIZE } },
      suggestedMin: 0,
      suggestedMax: 50,
    },
  };

  var scaleOptsHum = {
    x: {
      title: { display: true, text: "Time", font: { size: AXIS_FONT_SIZE } },
      ticks: { font: { size: AXIS_FONT_SIZE }, maxRotation: 45 },
    },
    y: {
      title: { display: true, text: "%", font: { size: AXIS_FONT_SIZE } },
      ticks: { font: { size: AXIS_FONT_SIZE } },
      suggestedMin: 0,
      suggestedMax: 100,
    },
  };

  function createWeatherCharts() {
    var tempEl = document.getElementById("weatherTempChart");
    var humEl = document.getElementById("weatherHumidityChart");
    if (tempEl) {
      weatherTempChart = new Chart(tempEl.getContext("2d"), {
        type: "line",
        data: {
          labels: [],
          datasets: [{
            label: "Temperature (°C)",
            data: [],
            borderColor: COLOR_TEMP,
            backgroundColor: COLOR_TEMP_BG,
            tension: 0.35,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 5,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: { legend: { labels: { font: { size: LEGEND_FONT_SIZE } } } },
          scales: scaleOpts,
        },
      });
    }
    if (humEl) {
      weatherHumidityChart = new Chart(humEl.getContext("2d"), {
        type: "line",
        data: {
          labels: [],
          datasets: [{
            label: "Humidity (%)",
            data: [],
            borderColor: COLOR_HUM,
            backgroundColor: COLOR_HUM_BG,
            tension: 0.35,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 5,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: { legend: { labels: { font: { size: LEGEND_FONT_SIZE } } } },
          scales: scaleOptsHum,
        },
      });
    }
  }

  function addWeatherPoint(temp, humidity, timeLabel) {
    if (weatherTempChart) {
      weatherTempChart.data.labels.push(timeLabel);
      weatherTempChart.data.datasets[0].data.push(temp);
      if (weatherTempChart.data.labels.length > WEATHER_MAX_POINTS) {
        weatherTempChart.data.labels.shift();
        weatherTempChart.data.datasets[0].data.shift();
      }
      weatherTempChart.update();
    }
    if (weatherHumidityChart) {
      weatherHumidityChart.data.labels.push(timeLabel);
      weatherHumidityChart.data.datasets[0].data.push(humidity);
      if (weatherHumidityChart.data.labels.length > WEATHER_MAX_POINTS) {
        weatherHumidityChart.data.labels.shift();
        weatherHumidityChart.data.datasets[0].data.shift();
      }
      weatherHumidityChart.update();
    }
    if (!weatherChartsRevealed) {
      weatherChartsRevealed = true;
      var waiting = document.getElementById("weather-waiting");
      var wrap = document.getElementById("weather-charts-wrap");
      if (waiting) waiting.classList.add("hidden");
      if (wrap) {
        wrap.classList.remove("no-data");
        wrap.classList.add("has-data");
      }
    }
  }

  function fetchLiveWeather() {
    fetch("/live-weather")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.temperature != null && d.humidity != null) {
          var lbl = typeof d.timestamp === "string" && /^\d{1,2}:\d{2}:\d{2}$/.test(d.timestamp)
            ? d.timestamp
            : new Date().toLocaleTimeString();
          addWeatherPoint(d.temperature, d.humidity, lbl);
        }
      })
      .catch(function () {});
  }

  createWeatherCharts();
  fetchLiveWeather();
  setInterval(fetchLiveWeather, WEATHER_POLL_MS);

  /* ===== Forecast UI ===== */
  var dateInput = document.getElementById("date");
  var predictedBox = document.getElementById("predicted-load");
  var predictedMw = predictedBox && predictedBox.querySelector(".predicted-mw");
  var predictedUnit = predictedBox && predictedBox.querySelector(".predicted-unit");
  var forecastSection = document.getElementById("forecast-section");
  var chartSection = document.getElementById("chart-section");

  function setPrediction(value, isError) {
    if (!predictedMw || !predictedUnit) return;
    predictedMw.textContent = value;
    predictedBox.classList.toggle("has-value", !isError);
    predictedBox.classList.remove("show");
    if (!isError) predictedBox.classList.add("show");
  }

  function showOutputAndChart() {
    if (forecastSection) {
      forecastSection.classList.remove("hidden");
      forecastSection.classList.add("revealed");
    }
    if (chartSection) {
      chartSection.classList.remove("hidden");
      chartSection.classList.add("revealed");
    }
  }

  function hideOutputAndChart() {
    if (forecastSection) {
      forecastSection.classList.add("hidden");
      forecastSection.classList.remove("revealed");
    }
    if (chartSection) {
      chartSection.classList.add("hidden");
      chartSection.classList.remove("revealed");
    }
  }

  function scrollToResults() {
    if (forecastSection) forecastSection.scrollIntoView({ behavior: "smooth" });
    setTimeout(function () {
      if (chartSection) chartSection.scrollIntoView({ behavior: "smooth" });
    }, 350);
  }

  document.getElementById("predict-btn").addEventListener("click", function () {
    var payload = {
      date: dateInput.value,
      temperature: parseFloat(document.getElementById("temperature").value),
      humidity: parseFloat(document.getElementById("humidity").value),
      daytype: document.getElementById("daytype").value.toLowerCase(),
      season: document.getElementById("season").value.toLowerCase(),
    };

    fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.predicted_load !== undefined) {
          var mw = Math.round(data.predicted_load);
          setPrediction(mw, false);
          addLoadPoint(mw);
          showOutputAndChart();
          scrollToResults();
        } else {
          setPrediction(data.error || "Prediction error", true);
        }
      })
      .catch(function (err) {
        console.error(err);
        setPrediction("Server error", true);
      });
  });

  document.getElementById("reset-btn").addEventListener("click", function () {
    setPrediction("--", true);
    hideOutputAndChart();
  });
})();
