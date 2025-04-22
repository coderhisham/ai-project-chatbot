import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export interface CourseFilters {
  search: string;
  level: string;
  provider: string;
  durationMax: string;
  bookmarkedOnly: boolean;
}

interface CourseFiltersProps {
  onFiltersChange: (filters: CourseFilters) => void;
  providers: string[];
  initialFilters?: Partial<CourseFilters>;
}

const defaultFilters: CourseFilters = {
  search: "",
  level: "all",
  provider: "all",
  durationMax: "all",
  bookmarkedOnly: false,
};

export function CourseFilters({
  onFiltersChange,
  providers,
  initialFilters = {},
}: CourseFiltersProps) {
  const [filters, setFilters] = useState<CourseFilters>({
    ...defaultFilters,
    ...initialFilters,
  });

  const [activeFilterCount, setActiveFilterCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);

  // Calculate active filter count
  useEffect(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.level !== "all") count++;
    if (filters.provider !== "all") count++;
    if (filters.durationMax !== "all") count++;
    if (filters.bookmarkedOnly) count++;
    setActiveFilterCount(count);
  }, [filters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const updated = { ...prev, [name]: value };
      onFiltersChange(updated);
      return updated;
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters((prev) => {
      const updated = { ...prev, [name]: value };
      onFiltersChange(updated);
      return updated;
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFilters((prev) => {
      const updated = { ...prev, bookmarkedOnly: checked };
      onFiltersChange(updated);
      return updated;
    });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    setIsOpen(false);
  };

  const applyFilters = () => {
    onFiltersChange(filters);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
          <Input
            placeholder="Search courses..."
            className="pl-9 h-10 focus-visible:ring-primary/50 border-primary/20"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1.5 top-1.5 h-7 w-7 hover:bg-primary/10"
              onClick={() => {
                setFilters((prev) => {
                  const updated = { ...prev, search: "" };
                  onFiltersChange(updated);
                  return updated;
                });
              }}
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <Select
            value={filters.level}
            onValueChange={(value) => handleSelectChange("level", value)}
          >
            <SelectTrigger className="w-[130px] h-10 border-primary/20 focus:ring-primary/50">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Level</SelectLabel>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 gap-1 hover-gradient-effect border-primary/20"
              >
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge
                    className="ml-1 h-5 px-1.5 bg-primary/10 text-primary border-none"
                    variant="secondary"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] p-0 border-l-[3px] border-gradient-blue-green"
            >
              <SheetHeader className="px-6 pt-6 pb-2">
                <SheetTitle className="text-gradient-blue-green">
                  Course Filters
                </SheetTitle>
                <SheetDescription>
                  Narrow down courses based on your preferences
                </SheetDescription>
              </SheetHeader>
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="provider" className="text-primary">
                      Provider
                    </Label>
                    <Select
                      value={filters.provider}
                      onValueChange={(value) =>
                        handleSelectChange("provider", value)
                      }
                    >
                      <SelectTrigger
                        id="provider"
                        className="border-primary/20 focus:ring-primary/50"
                      >
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Providers</SelectItem>
                        {providers.map((provider) => (
                          <SelectItem key={provider} value={provider}>
                            {provider}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="durationMax" className="text-primary">
                      Maximum Duration
                    </Label>
                    <Select
                      value={filters.durationMax}
                      onValueChange={(value) =>
                        handleSelectChange("durationMax", value)
                      }
                    >
                      <SelectTrigger
                        id="durationMax"
                        className="border-primary/20 focus:ring-primary/50"
                      >
                        <SelectValue placeholder="Select maximum duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Duration</SelectItem>
                        <SelectItem value="1-3 hours">1-3 hours</SelectItem>
                        <SelectItem value="3-6 hours">3-6 hours</SelectItem>
                        <SelectItem value="6-10 hours">6-10 hours</SelectItem>
                        <SelectItem value="10-20 hours">10-20 hours</SelectItem>
                        <SelectItem value="20+ hours">20+ hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="bookmarked" className="flex-1 text-primary">
                      Show only bookmarked courses
                    </Label>
                    <Switch
                      id="bookmarked"
                      checked={filters.bookmarkedOnly}
                      onCheckedChange={handleSwitchChange}
                      className="data-[state=checked]:bg-gradient-blue-teal"
                    />
                  </div>
                </div>
              </div>
              <SheetFooter className="flex-col px-6 py-4 border-t">
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="w-full sm:w-1/2 hover-gradient-effect"
                  >
                    Reset All
                  </Button>
                  <Button
                    onClick={applyFilters}
                    className="w-full sm:w-1/2 bg-gradient-blue-green hover:bg-gradient-blue-green-dark transition-all duration-300"
                  >
                    Apply Filters
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.level !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 pl-2 bg-primary/10 text-primary border-none"
            >
              <span>Level: {filters.level}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSelectChange("level", "all")}
                className="h-4 w-4 ml-1 -mr-1 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove filter</span>
              </Button>
            </Badge>
          )}
          {filters.provider !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 pl-2 bg-primary/10 text-primary border-none"
            >
              <span>Provider: {filters.provider}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSelectChange("provider", "all")}
                className="h-4 w-4 ml-1 -mr-1 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove filter</span>
              </Button>
            </Badge>
          )}
          {filters.durationMax !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 pl-2 bg-primary/10 text-primary border-none"
            >
              <span>Duration: {filters.durationMax}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSelectChange("durationMax", "all")}
                className="h-4 w-4 ml-1 -mr-1 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove filter</span>
              </Button>
            </Badge>
          )}
          {filters.bookmarkedOnly && (
            <Badge
              variant="secondary"
              className="gap-1 pl-2 bg-primary/10 text-primary border-none"
            >
              <span>Only saved courses</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSwitchChange(false)}
                className="h-4 w-4 ml-1 -mr-1 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove filter</span>
              </Button>
            </Badge>
          )}
          {activeFilterCount > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="ml-auto h-7 text-xs hover-gradient-effect"
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
