
import React, { useState } from 'react';
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, GitFork, ArrowUpRight, Globe, Eye, TrendingUp as Trending, BookOpen } from 'lucide-react';
import { ProjectDialog } from './ProjectDialog';
import { formatNumber } from "@/lib/utils/format";

export function ProjectCard({ project, index, sortType }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
        onClick={() => setIsDialogOpen(true)}
      >
        <Card className="h-full bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:border-blue-500/50">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/30 text-blue-100">
                {project.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.html_url, '_blank');
                  }}
                  className="text-blue-300 hover:text-blue-400 transition-colors"
                  aria-label="Open in GitHub"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            <CardTitle className="text-lg font-bold truncate">
              {project.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-blue-100 h-12 opacity-90">
              {project.description || 'No description available'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-blue-100 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="truncate">{project.language || 'Not specified'}</span>
              </p>
              {sortType === 'trending' && (
                <div className="flex items-center gap-2 text-green-400">
                  <Trending className="h-4 w-4" />
                  <span className="truncate">Score: {formatNumber(Math.round(project.trendingScore))}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-yellow-400" title={`${project.stargazers_count.toLocaleString()} stars`}>
                <Star className="h-4 w-4 fill-current" />
                {formatNumber(project.stargazers_count)}
              </span>
              <span className="flex items-center gap-1 text-blue-300" title={`${project.forks_count.toLocaleString()} forks`}>
                <GitFork className="h-4 w-4" />
                {formatNumber(project.forks_count)}
              </span>
              <span className="flex items-center gap-1 text-purple-300" title={`${project.watchers_count.toLocaleString()} watchers`}>
                <Eye className="h-4 w-4" />
                {formatNumber(project.watchers_count)}
              </span>
            </div>
            <span className="text-blue-300 hover:text-blue-400 transition-colors">
              <BookOpen className="h-4 w-4" />
            </span>
          </CardFooter>
        </Card>
      </motion.div>

      <ProjectDialog
        project={project}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
