document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const city = params.get("city");
    const apiKey = "58fd5ec9d93442b5aa2103353240412"; // WeatherAPI API anahtarınızı buraya ekleyin
    const baseUrl = "https://api.weatherapi.com/v1/current.json";
    const detailsContainer = document.querySelector("#details-container");

    if (city) {
        try {
            const response = await fetch(`${baseUrl}?key=${apiKey}&q=${city}&lang=tr`);
            if (!response.ok) throw new Error("Şehir bulunamadı.");
            const data = await response.json();



            // Hava durumu bilgilerini kartta göster
            const temperature = data.current.temp_c; // Sıcaklık
            let borderColor = "";

            // Sıcaklık aralığına göre kenarlık rengini belirle
            if (temperature < 0) {
                borderColor = "border-primary"; // Lacivert
            } else if (temperature >= 0 && temperature <= 10) {
                borderColor = "border-info"; // Mavi
            } else if (temperature > 10 && temperature <= 30) {
                borderColor = "border-success"; // Yeşil
            } else {
                borderColor = "border-danger"; // Kırmızı
            }
            
            // Detaylı hava durumu bilgilerini göster
            detailsContainer.innerHTML += `
                <div class="card mt-4">
                    <div class="card-body">
                        <h5 class="card-title">${data.location.name} - ${data.location.country}</h5>
                        <p class="card-text">
                            Sıcaklık: ${data.current.temp_c}°C<br>
                            Hava: ${data.current.condition.text}<br>
                            Nem: ${data.current.humidity}%<br>
                            Rüzgar Hızı: ${data.current.wind_kph} km/h<br>
                            Görüş Mesafesi: ${data.current.vis_km} km<br>
                            UV İndeksi: ${data.current.uv}
                        </p>
                        <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}">
                    </div>
                </div>
            `;
        } catch (error) {
            detailsContainer.innerHTML = `<p class="text-danger">Hata: ${error.message}</p>`;
        }
    } else {
        detailsContainer.innerHTML = `<p class="text-danger">Şehir bilgisi eksik.</p>`;
    }
});
