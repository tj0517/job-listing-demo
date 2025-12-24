import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: PaginationControlsProps) {
  

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mx-auto text-blue-500">
      
      {/* Przycisk WSTECZ */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 w-9 p-0 disabled:bg-stone-400 disabled:border-0 border-blue-500!"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Poprzednia strona</span>
      </Button>

      {/* Informacja o stronie (np. Strona 1 z 5) */}
      <div className="flex items-center gap-1 text-sm font-medium mx-2">
        <span className="text-gray-900 dark:text-white">
            Strona {currentPage}
        </span>
        <span className="text-gray-400">
            / {totalPages}
        </span>
      </div>

      {/* Przycisk DALEJ */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 w-9 p-0 disabled:bg-stone-400 border-blue-500!"
      >
        <ChevronRight className="h-4 w-4 " />
        <span className="sr-only">Następna strona</span>
      </Button>

    </div>
  );
}3