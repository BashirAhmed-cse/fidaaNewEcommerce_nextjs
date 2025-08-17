import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const categories = [
  { name: "Bath & Body", count: 45 },
  { name: "Candles", count: 1 },
  { name: "Cosmetics", count: 8 },
  { name: "Fragrance", count: 73 },
  { name: "Hair Care", count: 2 },
  { name: "Lip Care", count: 3 },
];

const productTypes = [
  { name: "Attar", count: 1 },
  { name: "Attar Set", count: 1 },
  { name: "Body Deo - 150ml", count: 4 },
  { name: "Body Lotion - 200ml", count: 7 },
  { name: "Body Mist - 150ml", count: 4 },
  { name: "Candle Gift set", count: 1 },
];

const availabilityOptions = [
  { name: "In stock", count: 148 },
  { name: "Out of stock", count: 9 },
];

const FilterButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2249]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleFilter = (filterName: string) => {
    setSelectedFilters(prev =>
      prev.includes(filterName)
        ? prev.filter(f => f !== filterName)
        : [...prev, filterName]
    );
  };

  const resetFilters = () => {
    setPriceRange([0, 2249]);
    setSelectedFilters([]);
  };

  const FilterContent = () => (
    <div className="p-4 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Price Filter */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Price Range</h3>
          <Slider
            defaultValue={[0, 2249]}
            max={2249}
            step={1}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Category</h3>
            <button 
              onClick={() => resetFilters()}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Reset
            </button>
          </div>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center space-x-3">
                <Checkbox 
                  id={`category-${category.name}`}
                  checked={selectedFilters.includes(`category-${category.name}`)}
                  onCheckedChange={() => toggleFilter(`category-${category.name}`)}
                />
                <label
                  htmlFor={`category-${category.name}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {category.name} <span className="text-gray-500">({category.count})</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Product Type Filter */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Product Type</h3>
            <button 
              onClick={() => resetFilters()}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Reset
            </button>
          </div>
          <div className="space-y-3">
            {productTypes.map((type) => (
              <div key={type.name} className="flex items-center space-x-3">
                <Checkbox 
                  id={`type-${type.name}`}
                  checked={selectedFilters.includes(`type-${type.name}`)}
                  onCheckedChange={() => toggleFilter(`type-${type.name}`)}
                />
                <label
                  htmlFor={`type-${type.name}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {type.name} <span className="text-gray-500">({type.count})</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Availability</h3>
            <button 
              onClick={() => resetFilters()}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Reset
            </button>
          </div>
          <div className="space-y-3">
            {availabilityOptions.map((option) => (
              <div key={option.name} className="flex items-center space-x-3">
                <Checkbox 
                  id={`availability-${option.name}`}
                  checked={selectedFilters.includes(`availability-${option.name}`)}
                  onCheckedChange={() => toggleFilter(`availability-${option.name}`)}
                />
                <label
                  htmlFor={`availability-${option.name}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {option.name} <span className="text-gray-500">({option.count})</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply & Clear buttons */}
      <div className="flex justify-between mt-8 border-t pt-6">
        <Button
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
          onClick={() => resetFilters()}
        >
          Clear All
        </Button>
        <Button
          className="bg-gray-900 text-white hover:bg-gray-800"
          onClick={() => setIsOpen(false)}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {isMobile ? (
        // Mobile: Use Sheet
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="bg-gray-900 text-white px-4 py-2 flex items-center space-x-2">
              <span>Filters</span>
              {selectedFilters.length > 0 && (
                <span className="bg-white text-gray-900 rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {selectedFilters.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl">
            <SheetHeader className="mb-6">
              <div className="flex justify-between items-center">
                <SheetTitle className="text-left">Filters</SheetTitle>
                <button onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </SheetHeader>
            <FilterContent />
          </SheetContent>
        </Sheet>
      ) : (
        // Desktop: Use Dialog
        <>
          <Button
            className="bg-gray-900 text-white px-4 py-2 flex items-center space-x-2"
            onClick={() => setIsOpen(true)}
          >
            <span>Filters</span>
            {selectedFilters.length > 0 && (
              <span className="bg-white text-gray-900 rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {selectedFilters.length}
              </span>
            )}
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-4xl p-0">
              <DialogHeader className="border-b p-6">
                <DialogTitle>Filters</DialogTitle>
              </DialogHeader>
              <FilterContent />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default FilterButton;