/**
 * Memory Graph System
 * 
 * A graph-based neural network for relationship memory storage and retrieval
 * using a layered cluster approach based on the topology of an onion.
 */

export interface MemoryNode {
  id: string;
  type: 'memory' | 'emotion' | 'action' | 'context' | 'insight';
  content: string;
  timestamp: number;
  layer: 'core' | 'emotional' | 'behavioral' | 'contextual';
  embeddings: number[];
  metadata: Record<string, any>;
}

export interface MemoryEdge {
  id: string;
  source: string;
  target: string;
  type: 'causal' | 'temporal' | 'emotional' | 'contextual';
  weight: number;
  metadata: Record<string, any>;
}

export interface MemoryGraph {
  nodes: MemoryNode[];
  edges: MemoryEdge[];
}

// Mock data for demonstration purposes
const MOCK_MEMORY_GRAPH: MemoryGraph = {
  nodes: [
    {
      id: 'mem1',
      type: 'memory',
      content: 'First argument about finances',
      timestamp: Date.now() - 86400000 * 30, // 30 days ago
      layer: 'core',
      embeddings: [0.2, 0.5, 0.3],
      metadata: { importance: 0.8, resolution: 'compromised' }
    },
    {
      id: 'mem2',
      type: 'memory',
      content: 'Weekend getaway to the mountains',
      timestamp: Date.now() - 86400000 * 15, // 15 days ago
      layer: 'core',
      embeddings: [0.7, 0.1, 0.9],
      metadata: { importance: 0.9, sentiment: 'positive' }
    },
    {
      id: 'emo1',
      type: 'emotion',
      content: 'Frustration about spending habits',
      timestamp: Date.now() - 86400000 * 30,
      layer: 'emotional',
      embeddings: [0.1, 0.8, 0.2],
      metadata: { intensity: 0.7 }
    },
    {
      id: 'emo2',
      type: 'emotion',
      content: 'Joy during outdoor activities',
      timestamp: Date.now() - 86400000 * 15,
      layer: 'emotional',
      embeddings: [0.9, 0.3, 0.8],
      metadata: { intensity: 0.9 }
    },
    {
      id: 'act1',
      type: 'action',
      content: 'Created shared budget',
      timestamp: Date.now() - 86400000 * 28, // 28 days ago
      layer: 'behavioral',
      embeddings: [0.5, 0.5, 0.5],
      metadata: { effectiveness: 0.8 }
    },
    {
      id: 'act2',
      type: 'action',
      content: 'Planned surprise date',
      timestamp: Date.now() - 86400000 * 10, // 10 days ago
      layer: 'behavioral',
      embeddings: [0.6, 0.7, 0.8],
      metadata: { effectiveness: 0.9 }
    },
    {
      id: 'ctx1',
      type: 'context',
      content: 'Financial stress from recent job changes',
      timestamp: Date.now() - 86400000 * 45, // 45 days ago
      layer: 'contextual',
      embeddings: [0.3, 0.3, 0.7],
      metadata: { relevance: 0.7 }
    },
    {
      id: 'ins1',
      type: 'insight',
      content: 'Communication improves significantly after outdoor activities',
      timestamp: Date.now() - 86400000 * 5, // 5 days ago
      layer: 'behavioral',
      embeddings: [0.8, 0.8, 0.8],
      metadata: { confidence: 0.85 }
    }
  ],
  edges: [
    {
      id: 'edge1',
      source: 'ctx1',
      target: 'mem1',
      type: 'causal',
      weight: 0.8,
      metadata: {}
    },
    {
      id: 'edge2',
      source: 'mem1',
      target: 'emo1',
      type: 'emotional',
      weight: 0.9,
      metadata: {}
    },
    {
      id: 'edge3',
      source: 'mem1',
      target: 'act1',
      type: 'causal',
      weight: 0.7,
      metadata: {}
    },
    {
      id: 'edge4',
      source: 'mem2',
      target: 'emo2',
      type: 'emotional',
      weight: 0.9,
      metadata: {}
    },
    {
      id: 'edge5',
      source: 'emo2',
      target: 'act2',
      type: 'causal',
      weight: 0.6,
      metadata: {}
    },
    {
      id: 'edge6',
      source: 'mem2',
      target: 'ins1',
      type: 'temporal',
      weight: 0.7,
      metadata: {}
    }
  ]
};

/**
 * Memory Graph API
 */
export const MemoryGraphAPI = {
  /**
   * Get the entire memory graph
   */
  getGraph: (): MemoryGraph => {
    return MOCK_MEMORY_GRAPH;
  },

  /**
   * Add a new memory node to the graph
   */
  addMemory: (content: string, layer: MemoryNode['layer'], type: MemoryNode['type'] = 'memory'): MemoryNode => {
    const newNode: MemoryNode = {
      id: `mem${Date.now()}`,
      type,
      content,
      timestamp: Date.now(),
      layer,
      embeddings: [Math.random(), Math.random(), Math.random()],
      metadata: { importance: 0.7 + Math.random() * 0.3 }
    };
    
    // In a real implementation, we would add this to the persistent graph
    // Here we just return it for mock purposes
    return newNode;
  },

  /**
   * Connect two memory nodes with an edge
   */
  connectNodes: (sourceId: string, targetId: string, type: MemoryEdge['type']): MemoryEdge => {
    const newEdge: MemoryEdge = {
      id: `edge${Date.now()}`,
      source: sourceId,
      target: targetId,
      type,
      weight: 0.5 + Math.random() * 0.5,
      metadata: {}
    };
    
    // In a real implementation, we would add this to the persistent graph
    return newEdge;
  },

  /**
   * Find patterns in the memory graph
   */
  findPatterns: (): { pattern: string; confidence: number; }[] => {
    return [
      { pattern: "Communication improves after quality time together", confidence: 0.87 },
      { pattern: "Financial discussions are more productive in the morning", confidence: 0.72 },
      { pattern: "Outdoor activities consistently create positive emotional responses", confidence: 0.91 }
    ];
  },

  /**
   * Get memories by layer
   */
  getMemoriesByLayer: (layer: MemoryNode['layer']): MemoryNode[] => {
    return MOCK_MEMORY_GRAPH.nodes.filter(node => node.layer === layer);
  },

  /**
   * Get memory insights for relationship improvement
   */
  getInsights: (): string[] => {
    return [
      "You've shown 40% improvement in financial communication over the past month",
      "Quality time together leads to better conflict resolution in the following days",
      "Your partner responds best to appreciation for their planning efforts",
      "Joint outdoor activities have consistently strengthened your connection"
    ];
  }
};
