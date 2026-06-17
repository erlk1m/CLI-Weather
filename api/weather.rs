use reqwest;
use serde::Deserialize;
use std::collections::HashMap;
use url::Url;
use vercel_runtime::{run, service_fn, Error, Request, Response, ResponseBody};

#[derive(Deserialize)]
struct GeocodingResponse {
    results: Option<Vec<Location>>,
}

#[derive(Deserialize)]
struct Location {
    name: String,
    latitude: f64,
    longitude: f64,
    country: Option<String>,
}

#[derive(Deserialize)]
struct ForecastResponse {
    current: CurrentWeather,
}

#[derive(Deserialize)]
struct CurrentWeather {
    temperature_2m: f64,
    weather_code: u32,
    wind_speed_10m: f64,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(service_fn(handler)).await
}

pub async fn handler(req: Request) -> Result<Response<ResponseBody>, Error> {
    let url_str = req.uri().to_string();
    
    // Parse query params
    let mut city = "Jakarta".to_string();
    if let Ok(url) = Url::parse(&format!("http://localhost{}", url_str)) {
        let hash_query: HashMap<_, _> = url.query_pairs().into_owned().collect();
        if let Some(c) = hash_query.get("city") {
            city = c.to_string();
        }
    }

    // Geocoding
    let geo_url = format!(
        "https://geocoding-api.open-meteo.com/v1/search?name={}&count=1&language=id&format=json",
        urlencoding::encode(&city)
    );

    let client = reqwest::Client::new();
    let geo_res = client.get(&geo_url).send().await?.json::<GeocodingResponse>().await?;

    let location = match geo_res.results.and_then(|mut r| r.pop()) {
        Some(loc) => loc,
        None => {
            let msg = format!("Kota '{}' tidak ditemukan.\n", city);
            return Ok(Response::builder()
                .status(404)
                .header("Content-Type", "text/plain; charset=utf-8")
                .body(msg.into())?);
        }
    };

    // Forecast
    let forecast_url = format!(
        "https://api.open-meteo.com/v1/forecast?latitude={}&longitude={}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto",
        location.latitude, location.longitude
    );

    let forecast_res = client.get(&forecast_url).send().await?.json::<ForecastResponse>().await?;

    let current = forecast_res.current;
    let weather_desc = get_weather_desc(current.weather_code);
    let country = location.country.unwrap_or_else(|| "".to_string());
    
    let output = format!(
        " Cuaca di {}, {}\n\
          ---------------------------------\n\
          Kondisi : {}\n\
          Suhu    : {}°C\n\
          Angin   : {} km/h\n\
        ",
        location.name, country, weather_desc, current.temperature_2m, current.wind_speed_10m
    );

    Ok(Response::builder()
        .status(200)
        .header("Content-Type", "text/plain; charset=utf-8")
        .body(output.into())?)
}

fn get_weather_desc(code: u32) -> &'static str {
    match code {
        0 => "☀️  Cerah",
        1 | 2 | 3 => "⛅ Sebagian Berawan",
        45 | 48 => "🌫️  Kabut",
        51 | 53 | 55 => "🌧️  Gerimis",
        56 | 57 => "🌧️  Gerimis Beku",
        61 | 63 | 65 => "🌧️  Hujan",
        66 | 67 => "🌧️  Hujan Beku",
        71 | 73 | 75 => "❄️  Salju",
        77 => "❄️  Butiran Salju",
        80 | 81 | 82 => "🌦️  Hujan Lebat",
        85 | 86 => "❄️  Salju Lebat",
        95 => "⛈️  Badai Petir",
        96 | 99 => "⛈️  Badai Petir dengan Hujan Es",
        _ => "❓ Tidak Diketahui",
    }
}
