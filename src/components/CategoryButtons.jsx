
import React from 'react';
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/constants";

export function CategoryButtons({ selectedCategory, onSelect, className = "" }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Button
        onClick={() => onSelect("All")}
        variant={selectedCategory === "All" ? "default" : "outline"}
        className={`w-full justify-start ${
          selectedCategory === "All"
            ? 'bg-blue-600 text-white font-bold shadow-lg'
            : 'bg-white/5 text-white hover:bg-white/10'
        } transition-all duration-300`}
      >
        All Projects
      </Button>
      {Object.entries(categories).map(([category, { icon: Icon }]) => (
        <Button
          key={category}
          onClick={() => onSelect(category)}
          variant={selectedCategory === category ? "default" : "outline"}
          className={`w-full justify-start flex items-center gap-2 ${
            selectedCategory === category 
              ? 'bg-blue-600 text-white font-bold shadow-lg'
              : 'bg-white/5 text-white hover:bg-white/10'
          } transition-all duration-300`}
        >
          <Icon className="h-4 w-4" />
          {category}
        </Button>
      ))}
    </div>
  );
}
