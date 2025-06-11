import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { memoryService } from '../services/memoryService';
import { MemoryNode, MemoryGraph } from '../memory/graph/memoryGraph';

interface PositionedMemoryNode extends MemoryNode {
  x: number;
  y: number;
  radius: number;
  color: string;
}

interface MemoryVisualizerProps {
  activeLayer?: 'core' | 'emotional' | 'behavioral' | 'contextual' | 'all';
  width?: number;
  height?: number;
  interactive?: boolean;
  onNodeClick?: (node: MemoryNode) => void;
}

const MemoryVisualizer: React.FC<MemoryVisualizerProps> = ({
  activeLayer = 'all',
  width = 600,
  height = 400,
  interactive = true,
  onNodeClick
}) => {
  const [memoryGraph, setMemoryGraph] = useState<MemoryGraph | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  
  // Layer colors
  const layerColors = {
    core: 'rgba(255, 99, 132, 0.8)',
    emotional: 'rgba(54, 162, 235, 0.8)',
    behavioral: 'rgba(255, 206, 86, 0.8)',
    contextual: 'rgba(75, 192, 192, 0.8)',
  };
  
  // Node type icons
  const nodeTypeIcons = {
    memory: '💾',
    emotion: '💗',
    action: '🏃‍♂️',
    context: '🌍',
    insight: '💡'
  };
  
  useEffect(() => {
    const initializeMemory = async () => {
      await memoryService.initialize();
      
      setLoading(false);
      
      // In a real implementation, we would fetch the graph from the service
      // For the mock, we can directly access it
      const graph = await import('../memory/graph/memoryGraph');
      setMemoryGraph(graph.MemoryGraphAPI.getGraph());
    };
    
    initializeMemory();
  }, []);
  
  // Calculate node positions in an onion-like layered structure
  const calculateNodePositions = (): PositionedMemoryNode[] => {
    if (!memoryGraph) return [];
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Filter nodes by active layer if specified
    const filteredNodes = activeLayer === 'all' 
      ? memoryGraph.nodes 
      : memoryGraph.nodes.filter(node => node.layer === activeLayer);
    
    // Group nodes by layer
    const nodesByLayer = {
      core: filteredNodes.filter(n => n.layer === 'core'),
      emotional: filteredNodes.filter(n => n.layer === 'emotional'),
      behavioral: filteredNodes.filter(n => n.layer === 'behavioral'),
      contextual: filteredNodes.filter(n => n.layer === 'contextual')
    };
    
    // Calculate radius for each layer
    const layerRadius = {
      core: Math.min(width, height) * 0.15,
      emotional: Math.min(width, height) * 0.25,
      behavioral: Math.min(width, height) * 0.35,
      contextual: Math.min(width, height) * 0.45
    };
    
    // Position nodes in each layer
    const positionedNodes = filteredNodes.map(node => {
      const radius = layerRadius[node.layer];
      const layerNodes = nodesByLayer[node.layer];
      const nodeIndex = layerNodes.findIndex(n => n.id === node.id);
      const angleStep = (2 * Math.PI) / layerNodes.length;
      const angle = nodeIndex * angleStep;
      
      // Add a small random offset for natural feel
      const randomOffset = interactive ? Math.random() * 10 - 5 : 0;
      
      return {
        ...node,
        x: centerX + Math.cos(angle) * radius + randomOffset,
        y: centerY + Math.sin(angle) * radius + randomOffset,
        radius: 20,
        color: layerColors[node.layer]
      };
    });
    
    return positionedNodes;
  };
  
  // Calculate edge paths
  const calculateEdgePaths = (positionedNodes: PositionedMemoryNode[]) => {
    if (!memoryGraph) return [];
    
    return memoryGraph.edges.map(edge => {
      const sourceNode = positionedNodes.find(n => n.id === edge.source);
      const targetNode = positionedNodes.find(n => n.id === edge.target);
      
      // Skip edges if nodes aren't visible in current filter
      if (!sourceNode || !targetNode) return null;
      
      return {
        ...edge,
        sourceX: sourceNode.x,
        sourceY: sourceNode.y,
        targetX: targetNode.x,
        targetY: targetNode.y,
        // Adjust opacity based on weight
        opacity: Math.max(0.2, edge.weight)
      };
    }).filter(Boolean);
  };
  
  const handleNodeClick = (node: MemoryNode) => {
    setSelectedNode(selectedNode === node.id ? null : node.id);
    if (onNodeClick) onNodeClick(node);
  };
  
  // Calculate node and edge positions
  const positionedNodes = calculateNodePositions();
  const positionedEdges = calculateEdgePaths(positionedNodes);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 rounded-xl bg-truth-50 dark:bg-truth-800 shadow-soft" style={{ width, height }}>
        <div className="text-center">
          <div className="relative">
            <img
              src="/assets/ui/splashscreen_animation_spark.png"
              alt="Loading Animation"
              className="w-16 h-16 mx-auto animate-pulse"
            />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-truth-500"></div>
          </div>
          <p className="mt-4 text-truth-600 dark:text-truth-300">Initializing Memory System...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-full bg-truth-50 dark:bg-truth-900 rounded-xl overflow-hidden shadow-soft" style={{ width, height }}>
      {/* Layer labels */}
      {activeLayer === 'all' && (
        <>
          <div className="absolute text-xs text-center w-full text-truth-500 dark:text-truth-400" style={{ top: '5%' }}>Contextual Layer</div>
          <div className="absolute text-xs text-center w-full text-truth-500 dark:text-truth-400" style={{ top: '20%' }}>Behavioral Layer</div>
          <div className="absolute text-xs text-center w-full text-truth-500 dark:text-truth-400" style={{ top: '35%' }}>Emotional Layer</div>
          <div className="absolute text-xs text-center w-full text-truth-500 dark:text-truth-400" style={{ top: '50%' }}>Core Memories</div>
        </>
      )}
      
      {/* SVG for edges and nodes */}
      <svg width={width} height={height}>
        {/* Layer circles */}
        {activeLayer === 'all' && (
          <>
            <circle cx={width/2} cy={height/2} r={Math.min(width, height) * 0.45} 
              fill="none" stroke="#D1D5DB" strokeWidth="1" strokeDasharray="5,5" />
            <circle cx={width/2} cy={height/2} r={Math.min(width, height) * 0.35} 
              fill="none" stroke="#D1D5DB" strokeWidth="1" strokeDasharray="5,5" />
            <circle cx={width/2} cy={height/2} r={Math.min(width, height) * 0.25} 
              fill="none" stroke="#D1D5DB" strokeWidth="1" strokeDasharray="5,5" />
            <circle cx={width/2} cy={height/2} r={Math.min(width, height) * 0.15} 
              fill="none" stroke="#D1D5DB" strokeWidth="1" strokeDasharray="5,5" />
          </>
        )}
        
        {/* Edges */}
        {positionedEdges.map((edge: any) => (
          <g key={edge.id}>
            <line
              x1={edge.sourceX}
              y1={edge.sourceY}
              x2={edge.targetX}
              y2={edge.targetY}
              stroke={edge.type === 'emotional' ? '#ff6b81' : 
                     edge.type === 'causal' ? '#54a0ff' : 
                     edge.type === 'temporal' ? '#5f27cd' : '#1dd1a1'}
              strokeWidth={edge.weight * 3}
              strokeOpacity={edge.opacity}
            />
          </g>
        ))}
        
        {/* Nodes */}
        {positionedNodes.map((node: PositionedMemoryNode) => (
          <g 
            key={node.id} 
            transform={`translate(${node.x - node.radius}, ${node.y - node.radius})`}
            onClick={() => handleNodeClick(node)}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          >
            <circle
              cx={node.radius}
              cy={node.radius}
              r={node.radius}
              fill={selectedNode === node.id ? '#fff' : node.color}
              stroke={selectedNode === node.id ? node.color : 'none'}
              strokeWidth={2}
            />
            <text
              x={node.radius}
              y={node.radius}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={16}
              fill={selectedNode === node.id ? node.color : '#fff'}
            >
              {nodeTypeIcons[node.type]}
            </text>
          </g>
        ))}
      </svg>
      
      {/* Selected node details */}
      {selectedNode && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 bg-truth-50 dark:bg-truth-800 shadow-soft p-3 bg-opacity-95 dark:bg-opacity-95"
        >
          {positionedNodes
            .filter(node => node.id === selectedNode)
            .map(node => (
              <div key={node.id}>
                <div className="flex items-center">
                  <span className="mr-2 text-xl">{nodeTypeIcons[node.type]}</span>
                  <h3 className="font-bold">{node.content}</h3>
                </div>
                <p className="text-xs text-truth-500 dark:text-truth-400">
                  {new Date(node.timestamp).toLocaleString()} • {node.layer} layer
                </p>
              </div>
            ))}
        </motion.div>
      )}
      
      {/* Privacy indicator */}
      <div className="absolute top-2 right-2 flex items-center bg-truth-100 dark:bg-truth-800 shadow-inner rounded-full px-2 py-1 text-xs">
        <span className="h-2 w-2 rounded-full bg-truth-500 mr-1"></span>
        Encrypted On-Device
      </div>
    </div>
  );
};

export default MemoryVisualizer;
