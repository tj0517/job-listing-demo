"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Job } from "../lib/airtable";
import { getCoords } from "../lib/cordinates"; // Upewnij się, że importujesz poprawnie
import L from "leaflet";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Do sterowania filtrami

// Funkcja tworząca ikonę z liczbą
const createCityIcon = (count: number) => {
  return L.divIcon({
    className: "city-marker",
    html: `<div class="city-marker-count">${count}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
};

export default function JobMap({ jobs }: { jobs: Job[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const groupedJobs = useMemo(() => {
    const groups: Record<string, Job[]> = {};
    
    jobs.forEach(job => {
      const city = job.fields.Location;
      if (!city) return;
      
      if (!groups[city]) {
        groups[city] = [];
      }
      groups[city].push(job);
    });
    
    return groups;
  }, [jobs]);

  const cityKeys = Object.keys(groupedJobs);
  const firstCity = cityKeys[0];
  const center = firstCity ? getCoords(firstCity) : getCoords("DEFAULT");

  const handleFilterCity = (city: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (params.get("city") === city) {
        return; 
    }
    
    params.set("city", city);
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="h-full w-full relative z-0 bg-gray-50">
      <MapContainer 
        key={JSON.stringify(center)} 
        center={center} 
        zoom={6} 
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }} 
        className="outline-none"
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          className="map-tiles-filter"
        />

        {Object.entries(groupedJobs)
        .filter(([city]) => city !== "Zdalnie" && city !== "")
        
        .map(([city, cityJobs]) => {
          const coords = getCoords(city);
          const count = cityJobs.length;

          return (
            <Marker 
                key={city} 
                position={coords} 
                icon={createCityIcon(count)}
            >
              <Popup className="custom-popup" closeButton={false}>
                <div className="p-3 font-sans text-center min-w-[160px]">
                  
                  {/* Nagłówek Miasta */}
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {city}
                  </h3>
                  
                  {/* Licznik */}
                  <p className="text-sm text-gray-500 mb-4">
                    Znaleziono <span className="font-bold text-blue-600">{count}</span> ofert pracy
                  </p>

                  {/* Przycisk Akcji -> Filtruj */}
                  <button
                    onClick={() => handleFilterCity(city)}
                    className="w-full hover:cursor-pointer bg-gray-900 hover:bg-black text-white text-xs font-semibold py-2 px-4 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    Pokaż zlecenia
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                  </button>

                  {/* Opcjonalnie: Lista pierwszych 2-3 firm w dymku (Preview) */}
                  {count > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-left">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Ostatnie oferty:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                            {cityJobs.slice(0, 3).map(job => (
                                <li key={job.id} className="truncate">• 
                                <a href={"/jobs/"+job.fields.Slug}>{job.fields.Title}</a></li>
                            ))}
                            {count > 3 && <li className="text-gray-400 italic">+ {count - 3} inne</li>}
                        </ul>
                    </div>
                  )}

                </div>
              </Popup>
            </Marker>
          );
        })}

      </MapContainer>
      
      <div className="absolute bottom-1 right-1 bg-white/50 text-[10px] text-gray-400 px-1 rounded z-[400] pointer-events-none">
        Map data © CartoDB
      </div>
    </div>
  );
}