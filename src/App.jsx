
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from 'lucide-react';
import { categories } from "@/lib/constants";
import { calculateTrendingScore, categorizeProject } from "@/lib/utils/project";
import { ProjectCard } from "@/components/ProjectCard";
import { CategoryButtons } from "@/components/CategoryButtons";
import { fetchGithubProjects } from "@/lib/utils/api";
import { format } from 'date-fns';

function App() {
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState("stars");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [lastUpdateDate, setLastUpdateDate] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProjects = useCallback(async () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    if (lastUpdateDate === today) {
      return;
    }

    setLoading(true);
    try {
      const queries = [
        'stars:>1000 sort:stars',
        'stars:>1000 sort:updated',
        'stars:>1000 sort:forks',
        'stars:>1000 sort:watchers',
      ];

      const responses = await Promise.all(
        queries.map(query => fetchGithubProjects(query))
      );

      let allProjects = responses.flatMap(response => response.items || []);
      allProjects = Array.from(new Map(allProjects.map(item => [item.id, item])).values());
      
      allProjects = allProjects.map(project => ({
        ...project,
        trendingScore: calculateTrendingScore(project),
        category: categorizeProject(project, categories),
      }));

      const sortedProjects = allProjects.sort((a, b) => {
        switch (sortType) {
          case 'stars':
            return b.stargazers_count - a.stargazers_count;
          case 'forks':
            return b.forks_count - a.forks_count;
          case 'watchers':
            return b.watchers_count - a.watchers_count;
          case 'trending':
            return b.trendingScore - a.trendingScore;
          case 'popularity':
            return (b.stargazers_count + b.forks_count * 2) - 
                   (a.stargazers_count + a.forks_count * 2);
          default:
            return b.stargazers_count - a.stargazers_count;
        }
      }).slice(0, 100);

      setProjects(sortedProjects);
      setLastUpdateDate(today);
      localStorage.setItem('last_update_date', today);
      localStorage.setItem('cached_projects', JSON.stringify(sortedProjects));
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      
      const cached = localStorage.getItem('cached_projects');
      if (cached) {
        setProjects(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  }, [sortType, toast, lastUpdateDate]);

  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const savedDate = localStorage.getItem('last_update_date');
    setLastUpdateDate(savedDate);

    if (savedDate !== today) {
      fetchProjects();
    } else {
      const cached = localStorage.getItem('cached_projects');
      if (cached) {
        setProjects(JSON.parse(cached));
      } else {
        fetchProjects();
      }
    }
  }, [fetchProjects]);

  useEffect(() => {
    const sortProjects = () => {
      setProjects(projects => [...projects].sort((a, b) => {
        switch (sortType) {
          case 'stars':
            return b.stargazers_count - a.stargazers_count;
          case 'forks':
            return b.forks_count - a.forks_count;
          case 'watchers':
            return b.watchers_count - a.watchers_count;
          case 'trending':
            return b.trendingScore - a.trendingScore;
          case 'popularity':
            return (b.stargazers_count + b.forks_count * 2) - 
                   (a.stargazers_count + a.forks_count * 2);
          default:
            return b.stargazers_count - a.stargazers_count;
        }
      }));
    };
    sortProjects();
  }, [sortType]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-6">
      <div className="max-w-[1920px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Open Source Trends
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Discover the most impactful open source projects
          </p>
          
          <div className="sticky top-0 z-10 backdrop-blur-md py-4 px-6 rounded-xl mb-8">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Select value={sortType} onValueChange={setSortType}>
                <SelectTrigger className="w-[200px] bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stars">Most Stars</SelectItem>
                  <SelectItem value="forks">Most Forks</SelectItem>
                  <SelectItem value="watchers">Most Watchers</SelectItem>
                  <SelectItem value="trending">Trending Now</SelectItem>
                  <SelectItem value="popularity">Internet Popularity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white">
                    <Menu className="h-4 w-4 mr-2" />
                    Categories
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] bg-gray-900 border-gray-800">
                  <SheetHeader>
                    <SheetTitle className="text-white">Categories</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <CategoryButtons
                      selectedCategory={selectedCategory}
                      onSelect={handleCategoryChange}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  onClick={() => handleCategoryChange("All")}
                  variant={selectedCategory === "All" ? "default" : "outline"}
                  className={`${
                    selectedCategory === "All"
                      ? 'bg-blue-600 text-white font-bold shadow-lg scale-105'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  } transition-all duration-300`}
                >
                  All Projects
                </Button>
                {Object.entries(categories).map(([category, { icon: Icon }]) => (
                  <Button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`flex items-center gap-2 ${
                      selectedCategory === category 
                        ? 'bg-blue-600 text-white font-bold shadow-lg scale-105'
                        : 'bg-white/5 text-white hover:bg-white/10'
                    } transition-all duration-300`}
                  >
                    <Icon className="h-4 w-4" />
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                sortType={sortType}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
