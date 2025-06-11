/**
 * Memory System Store
 * 
 * Centralized state management for the proprietary memory system
 */

import { create } from 'zustand'
import { MemoryNode, MemoryEdge } from '../memory/graph/memoryGraph'
import { RelationshipInsight } from '../memory/insights/insightEngine'
import { memoryService } from '../services/memoryService'

interface MemoryState {
  // Graph state
  memoryGraph: {
    nodes: MemoryNode[];
    edges: MemoryEdge[];
  } | null;
  selectedNode: MemoryNode | null;
  activeLayer: 'all' | 'core' | 'emotional' | 'behavioral' | 'contextual';
  
  // Insights and analytics
  insights: RelationshipInsight[];
  trends: any[];
  progressReport: any | null;
  
  // Security
  accessStatus: {
    authorized: boolean;
    privacyScore: number;
  };
  
  // Status
  loading: boolean;
  initialized: boolean;
  
  // Actions
  initialize: () => Promise<boolean>;
  setSelectedNode: (node: MemoryNode | null) => void;
  setActiveLayer: (layer: 'all' | 'core' | 'emotional' | 'behavioral' | 'contextual') => void;
  recordMemory: (content: string, layer: MemoryNode['layer'], type?: MemoryNode['type']) => Promise<MemoryNode | null>;
  loadInsights: () => Promise<void>;
  loadTrends: () => Promise<void>;
  loadProgressReport: () => Promise<void>;
}

export const useMemoryStore = create<MemoryState>((set, get) => ({
  // Initial state
  memoryGraph: null,
  selectedNode: null,
  activeLayer: 'all',
  insights: [],
  trends: [],
  progressReport: null,
  accessStatus: {
    authorized: false,
    privacyScore: 0
  },
  loading: true,
  initialized: false,
  
  // Actions
  initialize: async () => {
    if (get().initialized) return true;
    
    try {
      // Initialize memory service
      await memoryService.initialize();
      
      // Get memory graph
      const graph = await import('../memory/graph/memoryGraph');
      const memoryGraph = graph.MemoryGraphAPI.getGraph();
      
      // Get access status
      const status = await memoryService.getAccessStatus();
      
      set({
        memoryGraph,
        accessStatus: status,
        initialized: true,
        loading: false
      });
      
      // Load additional data
      get().loadInsights();
      get().loadTrends();
      get().loadProgressReport();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize memory system:', error);
      set({ loading: false });
      return false;
    }
  },
  
  setSelectedNode: (node) => set({ selectedNode: node }),
  
  setActiveLayer: (layer) => set({ activeLayer: layer }),
  
  recordMemory: async (content, layer, type = 'memory') => {
    const newMemory = await memoryService.recordMemory(content, layer, type);
    
    if (newMemory) {
      // Update local graph
      set((state) => ({
        memoryGraph: state.memoryGraph ? {
          nodes: [...state.memoryGraph.nodes, newMemory],
          edges: state.memoryGraph.edges
        } : null
      }));
    }
    
    return newMemory;
  },
  
  loadInsights: async () => {
    const insights = await memoryService.getInsights();
    set({ insights });
  },
  
  loadTrends: async () => {
    const trends = await memoryService.getTrends();
    set({ trends });
  },
  
  loadProgressReport: async () => {
    const report = await memoryService.getProgressReport();
    set({ progressReport: report });
  }
}));
