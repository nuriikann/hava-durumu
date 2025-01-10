// document.addEventListener("DOMContentLoaded", function () {
//     const form = document.querySelector("form");
//     const input = document.querySelector("#city-input");
//     const suggestionsList = document.querySelector("#suggestions");
//     const cardContainer = document.querySelector("#weather-card-container");

//     const apiKey = "58fd5ec9d93442b5aa2103353240412"; // WeatherAPI API anahtarınızı buraya ekleyin
//     const baseUrl = "https://api.weatherapi.com/v1/current.json";
//     const searchUrl = "https://api.weatherapi.com/v1/search.json";


    
//     // Şehir önerilerini getirme
//     input.addEventListener("input", async () => {
//         const query = input.value.trim();

//         if (query.length > 2) {
//             try {
//                 const response = await fetch(`${searchUrl}?key=${apiKey}&q=${query}`);
//                 const suggestions = await response.json();

//                 // Öneri listesini temizle
//                 suggestionsList.innerHTML = "";

//                 // Yeni önerileri ekle
//                 suggestions.forEach((city) => {
//                     const listItem = document.createElement("li");
//                     listItem.textContent = `${city.name}, ${city.country}`;
//                     listItem.classList.add("list-group-item", "list-group-item-action");
//                     listItem.style.cursor = "pointer";

//                     // Liste öğesine tıklanınca arama kutusuna şehir adını yaz
//                     listItem.addEventListener("click", () => {
//                         input.value = city.name; // Şehir adını input'a yaz
//                         suggestionsList.innerHTML = ""; // Öneri listesini temizle
//                     });

//                     suggestionsList.appendChild(listItem);
//                 });
//             } catch (error) {
//                 console.error("Öneriler alınırken bir hata oluştu:", error);
//             }
//         } else {
//             suggestionsList.innerHTML = ""; // Öneri listesini temizle
//         }
//     });

//     // Form gönderimi
//     form.addEventListener("submit", async (e) => {
//         e.preventDefault();
//         const city = input.value.trim();
    
//         if (city) {
//             try {
//                 const response = await fetch(`${baseUrl}?key=${apiKey}&q=${city}&lang=tr`);
//                 if (!response.ok) throw new Error("Şehir bulunamadı.");
//                 const data = await response.json();
    
//                 // Hava durumu bilgilerini kartta göster
//                 const temperature = data.current.temp_c; // Sıcaklık
//                 let borderColor = "";
    
//                 // Sıcaklık aralığına göre kenarlık rengini belirle
//                 if (temperature < 0) {
//                     borderColor = "border-primary"; // Lacivert
//                 } else if (temperature >= 0 && temperature <= 10) {
//                     borderColor = "border-info"; // Mavi
//                 } else if (temperature > 10 && temperature <= 30) {
//                     borderColor = "border-success"; // Yeşil
//                 } else {
//                     borderColor = "border-danger"; // Kırmızı
//                 }
    
//                 // Kart oluştur ve ekle
//                 cardContainer.innerHTML = `
//                     <div class="card ${borderColor} border-3" style="width: 18rem;">
//                         <img src="https:${data.current.condition.icon}" class="card-img-top" alt="${data.current.condition.text}">
//                         <div class="card-body">
//                             <h5 class="card-title">${data.location.name}</h5>
//                             <p class="card-text">
//                                 Sıcaklık: ${temperature}°C<br>
//                                 Hava: ${data.current.condition.text}<br>
//                                 Nem: ${data.current.humidity}%
//                             </p>
//                             <a href="./pages/details.html?city=${encodeURIComponent(data.location.name)}" class="btn btn-outline-info">Detaylı Bilgi</a>

//                         </div>
//                     </div>
//                 `;
//             } catch (error) {
//                 alert(error.message);
//             }
//         } else {
//             alert("Lütfen bir şehir adı giriniz.");
//         }
//     });    
// });



const fetchWeatherData = async (city) => {
    const weatherApiKey = "58fd5ec9d93442b5aa2103353240412"; // Buraya Weather API anahtarınızı yazın
    const weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${encodeURIComponent(city)}&aqi=no`;

    try {
        const response = await fetch(weatherApiUrl);
        if (!response.ok) throw new Error("Hava durumu alınamadı.");
        return await response.json();
    } catch (error) {
        console.error("Hava durumu API hatası:", error);
        return null;
    }
};

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


const createWeatherCard = async (city) => {
    const weatherData = await fetchWeatherData(city);
    if (!weatherData) {
        console.error("Hava durumu verisi bulunamadı.");
        return;
    }

    const cityImage = await fetchCityImage(city);

    const cardContainer = document.querySelector("#weather-card-container");
    const temperature = weatherData.current.temp_c;
    let borderColor = "";

    if (temperature < 0) {
        borderColor = "border-primary"; // Lacivert
    } else if (temperature >= 0 && temperature < 10) {
        borderColor = "border-info"; // Mavi
    } else if (temperature >= 10 && temperature < 30) {
        borderColor = "border-success"; // Yeşil
    } else {
        borderColor = "border-danger"; // Kırmızı
    }

    cardContainer.innerHTML = `
        <div class="card ${borderColor}" style="width: 18rem; border-width: 3px;">
            <img src="${cityImage || 'https://via.placeholder.com/300'}" class="card-img-top" alt="${weatherData.location.name}">
            <div class="card-body">
                <h5 class="card-title">${weatherData.location.name}</h5>
                <p class="card-text">
                    Sıcaklık: ${weatherData.current.temp_c}°C<br>
                    Hava: ${weatherData.current.condition.text}
                </p>
                <a href="./pages/details.html?city=${encodeURIComponent(weatherData.location.name)}" class="btn btn-outline-info">Detaylı Bilgi</a>
            </div>
        </div>
    `;
};

document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const cityInput = document.querySelector("#city-input").value.trim();
    if (cityInput) {
        createWeatherCard(cityInput);
    }
});
