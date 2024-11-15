// src/components/widgets/EventFiltersWidget.tsx

import { useState, useEffect } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

export default function EventFiltersWidget() {
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interests = [
    { value: "tech", label: "Technologie" },
    { value: "business", label: "Business" },
    { value: "art", label: "Art et Culture" },
    { value: "science", label: "Science" },
    { value: "sports", label: "Sports" },
    { value: "music", label: "Musique" },
  ];

  useEffect(() => {
    applyFilters();
  }, [category, priceRange, selectedInterests]);

  const applyFilters = () => {
    console.log("Filtres appliqués:", {
      category,
      priceRange,
      selectedInterests,
    });
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <SidebarGroup className="px-4">
      <SidebarGroupLabel>Filtres</SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              <SelectItem value="conference">Conférence</SelectItem>
              <SelectItem value="workshop">Atelier</SelectItem>
              <SelectItem value="webinar">Webinaire</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price-range">
            Prix: {priceRange[0]}€ - {priceRange[1]}€
          </Label>
          <Slider
            id="price-range"
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
            className="w-full h-1.5"
          />
        </div>

        <div className="space-y-2">
          <Label>Centres d'intérêt</Label>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <Badge
                key={interest.value}
                variant={
                  selectedInterests.includes(interest.value)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => toggleInterest(interest.value)}
              >
                {interest.label}
              </Badge>
            ))}
          </div>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
