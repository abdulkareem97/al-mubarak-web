"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api";
import { IndianRupee } from "lucide-react";
import { TourPackage } from "@/types/tour-package";

type Tour = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export default function TourPackageSearchForm({
  setSelectedTourPackage,
}: {
  setSelectedTourPackage: (tourPackage: TourPackage | null) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedTour, setSelectedTour] = useState<string | null>(null);

  // Fetch search results
  const { data: tours } = useQuery<TourPackage[]>({
    queryKey: ["tours", { search }],
    queryFn: async () => {
      const res = await api.get<{ data: { packages: TourPackage[] } }>(
        `/tour-packages?search=${search}`
      );
      return res.data.data.packages;
    },
    staleTime: 1000 * 60,
  });

  // Fetch tour details
  const { data: tourDetails } = useQuery({
    queryKey: ["tour", { id: selectedTour }],
    queryFn: async () => {
      if (!selectedTour) throw new Error("No tour selected");
      const res = await api.get<{ data: TourPackage }>(
        `/tour-packages/${selectedTour}`
      );
      return res.data.data;
    },
    enabled: !!selectedTour, // Only fetch when a tour is selected
  });

  if (tourDetails) setSelectedTourPackage(tourDetails);

  return (
    <div className="space-y-6 w-full  mx-auto mt-10">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Select Tour Package
      </h2>
      <p className="text-center text-gray-500 text-sm">
        Search and select a tour to view details
      </p>

      {/* Search Input */}
      <div className="w-full">
        <label className="block text-gray-700 font-medium mb-2">
          Search Tour
        </label>
        <Input
          placeholder="Type tour name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-base px-4 py-3"
        />
      </div>

      {/* Select Tour Dropdown */}
      {tours && tours.length > 0 && (
        <div className="w-full">
          <label className="block text-gray-700 font-medium mb-2">
            Select Tour
          </label>
          <Select onValueChange={(value) => setSelectedTour(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a tour" />
            </SelectTrigger>

            {/* Popper ensures dropdown renders outside dialog and avoids scroll */}
            <SelectContent
              position="popper"
              className=" max-h-60 overflow-auto"
            >
              {tours.map((tour) => (
                <SelectItem
                  key={tour.id}
                  value={tour.id}
                  className="max-w-full"
                >
                  <div className="flex flex-col flex-wrap max-w-full">
                    <span className="font-medium ">{tour.packageName}</span>
                    <span className="text-xs text-gray-500 ">{tour.desc}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Tour Details Card */}
      {tourDetails && (
        <Card className="w-full border border-gray-200 shadow-sm">
          <CardContent className="space-y-2">
            <h3 className="font-bold text-xl">{tourDetails.packageName}</h3>
            <p className="text-gray-600">{tourDetails.desc}</p>
            <p className="font-semibold mt-2 flex items-center gap-1 text-green-700">
              ₹{tourDetails.tourPrice}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
