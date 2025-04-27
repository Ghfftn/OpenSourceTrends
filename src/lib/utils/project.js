
export const calculateTrendingScore = (project) => {
  const now = new Date();
  const updatedAt = new Date(project.updated_at);
  const daysSinceUpdate = (now - updatedAt) / (1000 * 60 * 60 * 24);
  return (project.stargazers_count * 1.5 + project.forks_count) * Math.exp(-daysSinceUpdate / 30);
};

export const categorizeProject = (project, categories) => {
  const searchText = `${project.name} ${project.description || ''} ${project.topics?.join(' ') || ''}`.toLowerCase();
  
  for (const [category, { keywords }] of Object.entries(categories)) {
    if (keywords.some(keyword => searchText.includes(keyword))) {
      return category;
    }
  }
  return 'Other';
};
