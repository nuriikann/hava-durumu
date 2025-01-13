const fetchCityImage = async (city) => {
    const unsplashAccessKey = "oWzqn68Y0no1fIKyPwSxmNyyP_uLUr27ibKFct7QsYs"; // Buraya Unsplash Access Key'inizi yazın
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)}&client_id=${unsplashAccessKey}&per_page=1`;

    try {
        const response = await fetch(unsplashUrl);
        if (!response.ok) throw new Error("Resim bulunamadı.");
        const data = await response.json();
        return data.results[0]?.urls?.regular || null; // İlk görselin URL'si
    } catch (error) {
        console.error("Şehir resmi alınamadı:", error);
        return null; // Görsel bulunamazsa null döner
    }
};

const input = document.querySelector("#city-input");

// Şehir önerilerini getirme
input.addEventListener("input", async () => {
    const query = input.value.trim();

    const suggestionsList = document.querySelector("#suggestions");
    const searchUrl = "https://api.weatherapi.com/v1/search.json";
    const weatherApiKey = "58fd5ec9d93442b5aa2103353240412";
    if (query.length > 2) {
        try {
            const response = await fetch(`${searchUrl}?key=${weatherApiKey}&q=${query}`);
            const suggestions = await response.json();

            // Öneri listesini temizle
            suggestionsList.innerHTML = "";

            // Yeni önerileri ekle
            suggestions.forEach((city) => {
                const listItem = document.createElement("li");
                listItem.textContent = `${city.name}, ${city.country}`;
                listItem.classList.add("list-group-item", "list-group-item-action");
                listItem.style.cursor = "pointer";

                // Liste öğesine tıklanınca arama kutusuna şehir adını yaz
                listItem.addEventListener("click", () => {
                    input.value = city.name; // Şehir adını input'a yaz
                    suggestionsList.innerHTML = ""; // Öneri listesini temizle
                });

                suggestionsList.appendChild(listItem);
            });
        } catch (error) {
            console.error("Öneriler alınırken bir hata oluştu:", error);
        }
    } else {
        suggestionsList.innerHTML = ""; // Öneri listesini temizle
    }
});

const fetchWeatherForecast = async (city) => {
    const weatherApiKey = "58fd5ec9d93442b5aa2103353240412"; // API anahtarınız
    const forecastApiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${encodeURIComponent(city)}&days=7`;

    try {
        const response = await fetch(forecastApiUrl);
        if (!response.ok) throw new Error("7 günlük hava tahmini alınamadı.");
        return await response.json();
    } catch (error) {
        console.error("7 günlük hava tahmini API hatası:", error);
        return null;
    }
};

const createWeatherCardAndChart = async (city) => {
    const forecastData = await fetchWeatherForecast(city); // 7 günlük tahmin
    if (!forecastData) return;

    // Tahmin verilerinden ilk günün hava durumu
    const todayForecast = forecastData.forecast.forecastday[0];
    const currentTemp = todayForecast.day.avgtemp_c;
    const conditionText = todayForecast.day.condition.text;
    const conditionIcon = todayForecast.day.condition.icon;

    // Şehir resmi al
    const cityImage = await fetchCityImage(city);

    // **Kart oluşturma**
    const cardContainer = document.querySelector("#weather-card-container");
    cardContainer.innerHTML = `
        <div class="card border-info border-3" style="width: 18rem;">
            <img src="${cityImage || 'https://via.placeholder.com/300'}" class="card-img-top" alt="${city}">
            <div class="card-body">
                <h5 class="card-title">${city}</h5>
                <p class="card-text">
                    Şu anki Sıcaklık: ${currentTemp}°C<br>
                    Hava: ${conditionText}
                </p>
            </div>
        </div>
    `;

    // **Grafik oluşturma**
    const days = forecastData.forecast.forecastday.map((day) =>
        new Date(day.date).toLocaleDateString("tr-TR", { weekday: "short" })
    );
    const temperatures = forecastData.forecast.forecastday.map((day) => day.day.avgtemp_c);
    const humidity = forecastData.forecast.forecastday.map((day) => day.day.avghumidity);

    const ctx = document.getElementById("forecastChart").getContext("2d");

    // Grafik oluşturma
    new Chart(ctx, {
        type: "line",
        data: {
            labels: days,
            datasets: [
                {
                    label: "Sıcaklık (°C)",
                    data: temperatures,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderWidth: 2,
                    tension: 0.3,
                },
                {
                    label: "Nem (%)",
                    data: humidity,
                    borderColor: "rgba(255, 99, 132, 1)",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderWidth: 2,
                    tension: 0.3,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        boxWidth: 20, // Simge boyutu
                        padding: 30, // Dataset label ile grafik arasındaki boşluk
                    },
                    position: "top", // Legend'in grafiğin üstünde konumlanması
                },
                datalabels: {
                    color: "white",
                    font: { size: 12 },
                    anchor: "end",
                    align: "top",
                    padding: -10, // Veri etiketi ile grafik arasındaki boşluk
                    formatter: (value) => `${value}`,
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Değerler",
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: "Günler",
                    },
                },
            },
        },
    });
};

// Formdan şehir adı alındığında hem kart hem grafik oluştur
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const cityInput = document.querySelector("#city-input").value.trim();
    if (cityInput) {
        createWeatherCardAndChart(cityInput);
    }
});