import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const weatherCodeMap = {
    0: { label: 'Clear Sky', icon: 'wb_sunny' },
    1: { label: 'Mainly Clear', icon: 'wb_sunny' },
    2: { label: 'Partly Cloudy', icon: 'cloud' },
    3: { label: 'Overcast', icon: 'cloud' },
    45: { label: 'Fog', icon: 'foggy' },
    48: { label: 'Depositing Rime Fog', icon: 'foggy' },
    51: { label: 'Light Drizzle', icon: 'grain' },
    53: { label: 'Moderate Drizzle', icon: 'grain' },
    55: { label: 'Dense Drizzle', icon: 'grain' },
    61: { label: 'Slight Rain', icon: 'water_drop' },
    63: { label: 'Moderate Rain', icon: 'water_drop' },
    65: { label: 'Heavy Rain', icon: 'water_drop' },
    71: { label: 'Slight Snow', icon: 'ac_unit' },
    73: { label: 'Moderate Snow', icon: 'ac_unit' },
    75: { label: 'Heavy Snow', icon: 'ac_unit' },
    80: { label: 'Slight Rain Showers', icon: 'water_drop' },
    81: { label: 'Moderate Rain Showers', icon: 'water_drop' },
    82: { label: 'Violent Rain Showers', icon: 'water_drop' },
    95: { label: 'Thunderstorm', icon: 'thunderstorm' },
};

const WeatherWidget = () => {
    const { user } = useSelector(state => state.auth);
    const [weather, setWeather] = useState(null);
    const [locationName, setLocationName] = useState("Locating...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async (lat, lng) => {
            try {
                // Fetch reverse geocoding for accurate place name
                fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`)
                    .then(res => res.json())
                    .then(geo => {
                        const place = geo.city || geo.locality || geo.principalSubdivision || 'Current Location';
                        // Just a clean up for labels
                        setLocationName(place);
                    })
                    .catch(() => setLocationName(user?.district ? `${user.district}, ${user.state}` : 'Current Location'));

                // Open-Meteo Current Weather + Hourly for Humidity
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=relativehumidity_2m&timezone=auto`);
                if (!res.ok) throw new Error("Failed to fetch weather data");
                
                const data = await res.json();
                
                // Extract current hour humidity safely
                let humidity = '--';
                if (data.hourly && data.hourly.time && data.current_weather.time) {
                    const currentHourObj = new Date(data.current_weather.time);
                    const currentHourStr = currentHourObj.toISOString().slice(0, 13); // e.g. "2023-11-20T12"
                    
                    const humidityIndex = data.hourly.time.findIndex(t => t.startsWith(currentHourStr));
                    if (humidityIndex !== -1) {
                        humidity = data.hourly.relativehumidity_2m[humidityIndex];
                    } else {
                        // fallback to the first entry if exact hour doesn't match
                        humidity = data.hourly.relativehumidity_2m[0];
                    }
                }

                setWeather({
                    temp: data.current_weather.temperature,
                    wind: data.current_weather.windspeed,
                    code: data.current_weather.weathercode,
                    humidity: humidity
                });
            } catch (err) {
                console.error("Failed to fetch weather:", err);
                setLocationName("Offline");
            } finally {
                setLoading(false);
            }
        };

        if (user?.lat && user?.lng) {
            fetchWeather(user.lat, user.lng);
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
                (err) => {
                    console.warn("Geolocation denied/failed, defaulting to Delhi coordinates", err);
                    fetchWeather(28.6139, 77.2090); // Default to Delhi
                }
            );
        } else {
            fetchWeather(28.6139, 77.2090);
        }
    }, [user]);

    const weatherInfo = weather ? (weatherCodeMap[weather.code] || { label: 'Unknown', icon: 'wb_cloudy' }) : {};

    return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden h-60 min-h-[160px]">
            <div className="relative z-10 w-full">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-lg">Weather Outlook</h3>
                        <p className="text-blue-100 text-xs truncate max-w-[150px]">{locationName}</p>
                    </div>
                    <span className="material-icons text-3xl md:text-4xl text-yellow-300 animate-pulse">
                        {loading ? 'hourglass_empty' : weatherInfo.icon}
                    </span>
                </div>
                
                {loading ? (
                    <div className="animate-pulse space-y-3">
                        <div className="h-8 bg-blue-400/50 rounded w-1/3"></div>
                        <div className="h-4 bg-blue-400/50 rounded w-2/3"></div>
                        <div className="flex gap-4">
                            <div className="h-4 bg-blue-400/50 rounded w-1/4"></div>
                            <div className="h-4 bg-blue-400/50 rounded w-1/4"></div>
                        </div>
                    </div>
                ) : weather ? (
                    <>
                        <div className="text-3xl md:text-4xl font-bold mb-2">{Math.round(weather.temp)}°C</div>
                        <p className="text-blue-100 mb-4 text-sm md:text-base capitalize">{weatherInfo.label}.</p>
                        <div className="flex gap-4 text-xs md:text-sm font-medium text-blue-100">
                            <span className="flex items-center gap-1"><span className="material-icons text-xs">water_drop</span> {weather.humidity}%</span>
                            <span className="flex items-center gap-1"><span className="material-icons text-xs">air</span> {weather.wind} km/h</span>
                        </div>
                    </>
                ) : (
                    <p className="text-blue-100 text-sm">Failed to load weather data.</p>
                )}
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>
    );
};

export default WeatherWidget;
