// Szybka baza współrzędnych dla głównych miast
// W produkcji te dane powinny przychodzić z Airtable (kolumny Lat/Lng)

export const CITY_COORDINATES: Record<string, [number, number]> = {
  "Warszawa": [52.2297, 21.0122],
  "Kraków": [50.0647, 19.9450],
  "Wrocław": [51.1079, 17.0385],
  "Poznań": [52.4064, 16.9252],
  "Gdańsk": [54.3520, 18.6466],
  "Łódź": [51.7592, 19.4560],
  "Katowice": [50.2649, 19.0238],
  "Szczecin": [53.4285, 14.5528],
  "Bydgoszcz": [53.1235, 18.0084],
  "Lublin": [51.2465, 22.5684],

  "DEFAULT": [52.0693, 19.4803] 
};

export function getCoords(city: string): [number, number] {
  // Usuwamy spacje i robimy proste dopasowanie
  const normalizedCity = Object.keys(CITY_COORDINATES).find(
    key => key.toLowerCase() === city?.toLowerCase()
  );
  
  return CITY_COORDINATES[normalizedCity || "DEFAULT"];
}