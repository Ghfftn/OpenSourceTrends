
import { 
  Brain,
  Bot,
  Code2,
  Cloud,
  Cpu,
  LineChart,
  Blocks,
  Shield,
  Smartphone,
  Zap,
  Network,
  Database
} from 'lucide-react';

export const categories = {
  'AI & LLMs': {
    icon: Brain,
    keywords: ['ai', 'artificial-intelligence', 'machine-learning', 'deep-learning', 'neural', 'gpt', 'llm', 'transformer', 'stable-diffusion', 'chatbot'],
  },
  'GenAI Tools': {
    icon: Bot,
    keywords: ['generative-ai', 'text-to-image', 'text-to-speech', 'speech-to-text', 'image-generation', 'ai-tools', 'prompt-engineering'],
  },
  'Modern Web Dev': {
    icon: Code2,
    keywords: ['javascript', 'typescript', 'react', 'vue', 'angular', 'next.js', 'svelte', 'web', 'frontend', 'backend', 'webassembly', 'rust'],
  },
  'Cloud Native': {
    icon: Cloud,
    keywords: ['kubernetes', 'docker', 'microservices', 'serverless', 'aws', 'azure', 'cloud', 'devops', 'infrastructure'],
  },
  'Edge Computing': {
    icon: Network,
    keywords: ['edge', 'iot', 'embedded', 'real-time', 'distributed-systems', 'mesh', 'p2p', 'peer-to-peer'],
  },
  'Data & Analytics': {
    icon: LineChart,
    keywords: ['data-science', 'analytics', 'big-data', 'data-engineering', 'data-visualization', 'business-intelligence', 'etl'],
  },
  'MLOps & AI Infra': {
    icon: Cpu,
    keywords: ['mlops', 'machine-learning-ops', 'ml-pipeline', 'model-deployment', 'model-serving', 'feature-store', 'experiment-tracking'],
  },
  'Web3 & Blockchain': {
    icon: Blocks,
    keywords: ['web3', 'blockchain', 'crypto', 'ethereum', 'solidity', 'smart-contracts', 'defi', 'nft', 'dao'],
  },
  'Mobile & Cross-Platform': {
    icon: Smartphone,
    keywords: ['mobile', 'ios', 'android', 'flutter', 'react-native', 'cross-platform', 'pwa', 'mobile-development'],
  },
  'Developer Tools': {
    icon: Zap,
    keywords: ['developer-tools', 'ide', 'cli', 'debugging', 'testing', 'productivity', 'workflow', 'automation'],
  },
  'Security & Privacy': {
    icon: Shield,
    keywords: ['security', 'privacy', 'encryption', 'cybersecurity', 'authentication', 'zero-trust', 'devsecops'],
  },
  'Databases & Storage': {
    icon: Database,
    keywords: ['database', 'storage', 'sql', 'nosql', 'vector-database', 'cache', 'data-store', 'persistence'],
  },
};
