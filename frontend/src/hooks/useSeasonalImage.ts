'use client';

import { useEffect, useState } from 'react';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface WeatherInfo {
  season: Season;
  weatherCode: number | null;
  temperature: number | null;
  label: string;
  emoji: string;
}

function getSeason(month: number): Season {
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

// WMO weather codes → season override + label
function weatherLabel(code: number): { label: string; emoji: string; seasonOverride?: Season } {
  if (code === 0) return { label: 'Clear sky', emoji: '☀️' };
  if (code <= 3) return { label: 'Partly cloudy', emoji: '⛅' };
  if (code <= 48) return { label: 'Foggy', emoji: '🌫️' };
  if (code <= 67) return { label: 'Rainy', emoji: '🌧️', seasonOverride: 'autumn' };
  if (code <= 77) return { label: 'Snowy', emoji: '❄️', seasonOverride: 'winter' };
  if (code <= 82) return { label: 'Rain showers', emoji: '🌦️', seasonOverride: 'autumn' };
  if (code <= 86) return { label: 'Snow showers', emoji: '🌨️', seasonOverride: 'winter' };
  return { label: 'Thunderstorm', emoji: '⛈️', seasonOverride: 'autumn' };
}

interface SeasonalImages {
  coverImage?: string | null;
  imageSpring?: string | null;
  imageSummer?: string | null;
  imageAutumn?: string | null;
  imageWinter?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export function useSeasonalImage(dest: SeasonalImages | null) {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (!dest) return;

    const month = new Date().getMonth() + 1;
    const baseSeason = getSeason(month);

    const fetchWeather = async () => {
      let finalSeason = baseSeason;
      let weatherCode: number | null = null;
      let temperature: number | null = null;
      let label = '';
      let emoji = '🌤️';

      if (dest.latitude && dest.longitude) {
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${dest.latitude}&longitude=${dest.longitude}&current=weathercode,temperature_2m&timezone=auto`;
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            weatherCode = data.current?.weathercode ?? null;
            temperature = data.current?.temperature_2m ?? null;
            if (weatherCode !== null) {
              const info = weatherLabel(weatherCode);
              label = info.label;
              emoji = info.emoji;
              if (info.seasonOverride) finalSeason = info.seasonOverride;
            }
          }
        } catch {
          // network fail → fall back to calendar season
        }
      }

      if (!label) {
        const seasonLabels: Record<Season, { label: string; emoji: string }> = {
          spring: { label: 'Spring', emoji: '🌸' },
          summer: { label: 'Summer', emoji: '☀️' },
          autumn: { label: 'Autumn', emoji: '🍂' },
          winter: { label: 'Winter', emoji: '❄️' },
        };
        label = seasonLabels[finalSeason].label;
        emoji = seasonLabels[finalSeason].emoji;
      }

      setWeather({ season: finalSeason, weatherCode, temperature, label, emoji });

      // pick best image: seasonal → coverImage
      const imageMap: Record<Season, string | null | undefined> = {
        spring: dest.imageSpring,
        summer: dest.imageSummer,
        autumn: dest.imageAutumn,
        winter: dest.imageWinter,
      };
      setActiveImage(imageMap[finalSeason] || dest.coverImage || null);
    };

    fetchWeather();
  }, [dest?.latitude, dest?.longitude, dest?.imageSpring, dest?.imageSummer, dest?.imageAutumn, dest?.imageWinter, dest?.coverImage]);

  return { weather, activeImage };
}
