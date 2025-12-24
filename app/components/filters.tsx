"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X, MapPin, Briefcase, Check, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";

// --- TYPY ---
interface JobFilterProps {
  locations: string[];
  companies: string[];
}


export function JobFilter({ locations, companies }: JobFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCompanies = searchParams.get("company") 
    ? searchParams.get("company")!.split(",") 
    : [];

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(initialCompanies);


  const [debouncedQuery] = useDebounce(query, 300);


  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    

    const companiesString = selectedCompanies.join(",");
    const currentCompaniesString = currentParams.get("company") || "";


    if (
      (currentParams.get("q") || "") === debouncedQuery &&
      (currentParams.get("city") || "") === city &&
      currentCompaniesString === companiesString
    ) {
      return;
    }

    // Jeśli są zmiany -> aktualizujemy URL
    const params = new URLSearchParams();
    
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (city) params.set("city", city);
    if (selectedCompanies.length > 0) params.set("company", companiesString);

    router.push(`/?${params.toString()}`, { scroll: false });

  }, [debouncedQuery, city, selectedCompanies, router, searchParams]);

  // Funkcja czyszcząca wszystko
  const clearFilters = () => {
    setQuery("");
    setCity("");
    setSelectedCompanies([]);
  };

  const hasFilters = query || city || selectedCompanies.length > 0;

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-4">
      
      {/* NAGŁÓWEK */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg flex items-center gap-2 text-white">
          <Filter className="w-5 h-5 text-blue-600 " />
          Filtry
        </h3>
        {hasFilters && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearFilters}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2 text-xs"
          >
            Wyczyść
          </Button>
        )}
      </div>
      
      <div className="flex flex-col gap-8">
        
        {/* 1. SZUKAJ (Input tekstowy) */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Słowa kluczowe
          </label>
          <div className="relative ">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
  placeholder="Stanowisko..."

  className="pl-9 pr-8 bg-transparent! focus:border-blue-500! focus:ring-0! transition-colors text-white!"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>
            {query && (
                <X 
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer hover:text-red-500" 
                    onClick={() => setQuery("")} 
                />
            )}
          </div>
        </div>

        {/* SEPARATOR */}
        <div className="h-px bg-gray-100 dark:bg-zinc-800" />

        {/* 2. LOKALIZACJA (Styl Kafelkowy Radio) */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Lokalizacja
          </label>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            
            {/* Opcja: Wszystkie */}
            <LocationRadio 
              label="Wszystkie miasta" 
              checked={city === ""} 
              onClick={() => setCity("")} 
            />

            {/* Lista miast */}
            {locations.map((loc) => (
              <LocationRadio 
                key={loc}
                label={loc} 
                checked={city === loc} 
                onClick={() => setCity(loc)} 
              />
            ))}
          </div>
        </div>

        {/* SEPARATOR */}
        <div className="h-px bg-gray-100 dark:bg-zinc-800" />

        {/* 3. FIRMA (Multi-Select Dropdown) */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Firma
          </label>
          
          <CompanyDropdown 
            companies={companies} 
            selected={selectedCompanies} 
            onChange={setSelectedCompanies} 
          />
        </div>

      </div>
    </div>
  );
}


function LocationRadio({ label, checked, onClick }: { label: string, checked: boolean, onClick: () => void }) {
  return (
    <label className="relative flex items-center group cursor-pointer">
      <input 
        type="radio" 
        name="city" 
        className="peer sr-only"
        checked={checked}
        onChange={onClick}
      />
      <span className="flex items-center w-full px-3 py-2 text-sm font-medium transition-all border rounded-md 
        /* Styl Podstawowy */
        bg-white border-gray-200 text-gray-600 
        /* Hover (tylko gdy nieaktywne) */
        hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900
        /* Checked (Aktywny) */
        peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 peer-checked:shadow-sm
        /* FIX: Checked + Hover (Wymuszenie stylu aktywnego) */
        peer-checked:hover:bg-blue-50 peer-checked:hover:border-blue-600 peer-checked:hover:text-blue-700
        /* Dark Mode */
        dark:bg-zinc-900 dark:border-zinc-800 dark:text-gray-400 
        dark:hover:bg-zinc-800 dark:hover:text-gray-200
        dark:peer-checked:border-blue-500 dark:peer-checked:bg-blue-900/20 dark:peer-checked:text-blue-400
        dark:peer-checked:hover:bg-blue-900/20 dark:peer-checked:hover:border-blue-500 dark:peer-checked:hover:text-blue-400">
        
        {label}
      </span>

      {/* Ikona wyboru */}
      {checked && (
        <div className="absolute right-3 text-blue-600 dark:text-blue-400">
           <Check className="w-4 h-4" />
        </div>
      )}
    </label>
  );
}


function CompanyDropdown({ 
  companies, 
  selected, 
  onChange 
}: { 
  companies: string[], 
  selected: string[], 
  onChange: (val: string[]) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Zamknij po kliknięciu poza
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelection = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((item) => item !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  const getButtonLabel = () => {
    if (selected.length === 0) return "Wszystkie firmy";
    if (selected.length === 1) return selected[0];
    if (selected.length === 2) return `${selected[0]}, ${selected[1]}`;
    return `${selected[0]}, ${selected[1]} +${selected.length - 2}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* TRIGGER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white dark:bg-zinc-900 border rounded-lg py-2.5 pl-3 pr-3 text-sm font-medium shadow-sm transition-all
          ${isOpen || selected.length > 0
            ? 'border-blue-600 ring-1 ring-blue-100 dark:ring-blue-900/30' 
            : 'border-gray-200 dark:border-zinc-800 hover:border-blue-400 '
          }
        `}
      >
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 overflow-hidden">
          <Briefcase className={`w-4 h-4 flex-shrink-0 ${selected.length > 0 ? 'text-blue-600' : 'text-gray-400'}`} />
          <span className="truncate">{getButtonLabel()}</span>
        </div>
        
        <div className="flex items-center gap-2">
            {selected.length > 0 && (
                <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {selected.length}
                </span>
            )}
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
        </div>
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          
          <div className="max-h-[250px] overflow-y-auto custom-scrollbar p-1 space-y-0.5">
            {/* Opcja: Wszystkie */}
            <div 
              onClick={() => { onChange([]); setIsOpen(false); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800 border-b border-dashed border-gray-200 dark:border-zinc-700 mb-1"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${selected.length === 0 ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-zinc-600'}`}>
                 {selected.length === 0 && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className={`text-sm ${selected.length === 0 ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                Wszystkie firmy
              </span>
            </div>

            {/* Checkboxy */}
            {companies.map((comp) => {
              const isSelected = selected.includes(comp);
              return (
                <div 
                  key={comp}
                  onClick={() => toggleSelection(comp)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors group
                    ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-zinc-800'}
                  `}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all
                    ${isSelected 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-gray-300 dark:border-zinc-600 group-hover:border-blue-400 bg-white dark:bg-zinc-800'
                    }
                  `}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm ${isSelected ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-500'}`}>
                    {comp}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="p-2 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50">
             <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-1.5 text-xs font-semibold text-center text-blue-600 hover:text-blue-700 uppercase tracking-wide"
             >
                Zamknij listę
             </button>
          </div>
        </div>
      )}
    </div>
  );
}