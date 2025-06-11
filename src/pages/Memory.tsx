import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MemoryVisualizer from '../components/MemoryVisualizer';
import { memoryService } from '../services/memoryService';
import { RelationshipInsight, RelationshipTrend } from '../memory/insights/insightEngine';

const Memory: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<'all' | 'core' | 'emotional' | 'behavioral' | 'contextual'>('all');
  const [insights, setInsights] = useState<RelationshipInsight[]>([]);
  const [trends, setTrends] = useState<RelationshipTrend[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [progressReport, setProgressReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'insights' | 'trends' | 'progress'>('visualizer');

  useEffect(() => {
    const initializeMemory = async () => {
      await memoryService.initialize();
      
      // Load insights and trends
      const loadedInsights = await memoryService.getInsights();
      const loadedTrends = await memoryService.getTrends();
      const report = await memoryService.getProgressReport();
      
      setInsights(loadedInsights);
      setTrends(loadedTrends);
      setProgressReport(report);
      setLoading(false);
    };
    
    initializeMemory();
  }, []);
  
  const handleNodeClick = (node: any) => {
    setSelectedNode(node.id);
    console.log('Selected memory node:', node);
  };
  
  const handleLayerChange = (layer: 'all' | 'core' | 'emotional' | 'behavioral' | 'contextual') => {
    setSelectedLayer(layer);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="container mx-auto py-8 px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <header className="mb-8">
        <motion.div
          className="flex items-center justify-center mb-4"
          variants={itemVariants}
        >
          <img
            src="/assets/rocks/truth_rock_v2.png"
            alt="Truth Rock"
            className="w-16 h-16 object-contain mr-4 drop-shadow-lg"
          />
          <motion.h1
            className="text-3xl font-bold text-center text-truth-900 dark:text-truth-100"
          >
            Relationship Memory System
          </motion.h1>
          <img
            src="/assets/rocks/truth_rock_v3.png"
            alt="Truth Rock"
            className="w-16 h-16 object-contain ml-4 drop-shadow-lg"
          />
        </motion.div>
        <motion.p
          className="text-center text-truth-600 dark:text-truth-400 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Secure, on-device graph neural network with layered memory architecture
        </motion.p>
      </header>
      
      {/* Tab Navigation */}
      <motion.div 
        className="flex justify-center mb-8 overflow-x-auto"
        variants={itemVariants}
      >
        <div className="flex space-x-2 bg-truth-100 dark:bg-truth-800 shadow-soft p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('visualizer')}
            className={`px-4 py-2 rounded-md ${activeTab === 'visualizer' ? 'bg-truth-700 text-truth-50 shadow-md' : 'text-truth-500 dark:text-truth-400 hover:bg-truth-200 dark:hover:bg-truth-700 hover:text-truth-700 dark:hover:text-truth-200'}`}
          >
            Memory Graph
          </button>
          <button 
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 rounded-md ${activeTab === 'insights' ? 'bg-truth-700 text-truth-50 shadow-md' : 'text-truth-500 dark:text-truth-400 hover:bg-truth-200 dark:hover:bg-truth-700 hover:text-truth-700 dark:hover:text-truth-200'}`}
          >
            Insights
          </button>
          <button 
            onClick={() => setActiveTab('trends')}
            className={`px-4 py-2 rounded-md ${activeTab === 'trends' ? 'bg-truth-700 text-truth-50 shadow-md' : 'text-truth-500 dark:text-truth-400 hover:bg-truth-200 dark:hover:bg-truth-700 hover:text-truth-700 dark:hover:text-truth-200'}`}
          >
            Trends
          </button>
          <button 
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 rounded-md ${activeTab === 'progress' ? 'bg-truth-700 text-truth-50 shadow-md' : 'text-truth-500 dark:text-truth-400 hover:bg-truth-200 dark:hover:bg-truth-700 hover:text-truth-700 dark:hover:text-truth-200'}`}
          >
            Progress
          </button>
        </div>
      </motion.div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-truth-500"></div>
        </div>
      ) : (
        <>
          {/* Memory Visualizer Tab */}
          {activeTab === 'visualizer' && (
            <motion.div variants={itemVariants}>
              <div className="mb-4 flex justify-center">
                <div className="inline-flex bg-truth-100 dark:bg-truth-800 shadow-soft rounded-lg p-1">
                  <button 
                    onClick={() => handleLayerChange('all')}
                    className={`px-3 py-1 text-sm rounded-md ${selectedLayer === 'all' ? 'bg-truth-700 text-truth-50 shadow-md' : 'text-truth-500 dark:text-truth-400 hover:bg-truth-200 dark:hover:bg-truth-700 hover:text-truth-700 dark:hover:text-truth-200'}`}
                  >
                    All Layers
                  </button>
                  <button 
                    onClick={() => handleLayerChange('core')}
                    className={`px-3 py-1 text-sm rounded-md ${selectedLayer === 'core' ? 'bg-truth-700 text-truth-50 shadow-md' : 'text-truth-500 dark:text-truth-400 hover:bg-truth-200 dark:hover:bg-truth-700 hover:text-truth-700 dark:hover:text-truth-200'}`}
                  >
                    Core
                  </button>
                  <button 
                    onClick={() => handleLayerChange('emotional')}
                    className={`px-3 py-1 text-sm rounded-md ${selectedLayer === 'emotional' ? 'bg-truth-700 text-truth-50 shadow-md' : 'text-truth-500 dark:text-truth-400 hover:bg-truth-200 dark:hover:bg-truth-700 hover:text-truth-700 dark:hover:text-truth-200'}`}
                  >
                    Emotional
                  </button>
                  <button 
                    onClick={() => handleLayerChange('behavioral')}
                    className={`px-3 py-1 text-sm rounded-md ${selectedLayer === 'behavioral' ? 'bg-truth-700 text-truth-50 shadow-md' : 'text-truth-500 dark:text-truth-400 hover:bg-truth-200 dark:hover:bg-truth-700 hover:text-truth-700 dark:hover:text-truth-200'}`}
                  >
                    Behavioral
                  </button>
                  <button 
                    onClick={() => handleLayerChange('contextual')}
                    className={`px-3 py-1 text-sm rounded-md ${selectedLayer === 'contextual' ? 'bg-truth-700 text-truth-50 shadow-md' : 'text-truth-500 dark:text-truth-400 hover:bg-truth-200 dark:hover:bg-truth-700 hover:text-truth-700 dark:hover:text-truth-200'}`}
                  >
                    Contextual
                  </button>
                </div>
              </div>
              
              <div className="flex justify-center">
                <MemoryVisualizer
                  activeLayer={selectedLayer}
                  width={Math.min(window.innerWidth - 40, 800)}
                  height={500}
                  onNodeClick={handleNodeClick}
                />
              </div>
              
              <div className="mt-4 text-center text-sm text-truth-500 dark:text-truth-400">
                <p>Click on a memory node to view details</p>
              </div>

              {/* Selected Node Details */}
              {selectedNode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-truth-100 dark:bg-truth-800 rounded-xl p-4 shadow-soft max-w-md mx-auto"
                >
                  <h3 className="font-semibold text-truth-900 dark:text-truth-100 mb-2">Selected Memory Node</h3>
                  <p className="text-sm text-truth-600 dark:text-truth-400 mb-2">
                    Node ID: <span className="font-mono text-truth-700 dark:text-truth-300">{selectedNode}</span>
                  </p>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-xs text-truth-500 dark:text-truth-400 hover:text-truth-700 dark:hover:text-truth-200 transition-colors"
                  >
                    Clear selection
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
          
          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map(insight => (
                  <motion.div
                    key={insight.id}
                    className="bg-truth-100 dark:bg-truth-800 rounded-xl p-4 shadow-soft"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">
                        {insight.category === 'communication' ? '💬' :
                         insight.category === 'patterns' ? '🔄' :
                         insight.category === 'growth' ? '📈' :
                         insight.category === 'conflict' ? '⚔️' : '❤️'}
                      </span>
                      <h3 className="text-lg font-medium text-truth-700 dark:text-truth-200">{insight.title}</h3>
                    </div>
                    <p className="text-truth-600 dark:text-truth-400 mb-3">{insight.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="bg-truth-200 dark:bg-truth-700 text-truth-700 dark:text-truth-200 px-2 py-1 rounded-md">
                        {insight.confidence * 100}% confidence
                      </span>
                      <span className="text-truth-500 dark:text-truth-400">
                        {new Date(insight.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {insight.suggestions && insight.suggestions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-truth-200 dark:border-truth-700">
                        <h4 className="text-sm font-medium mb-1 text-truth-700 dark:text-truth-200">Suggestions:</h4>
                        <ul className="text-sm text-truth-600 dark:text-truth-400">
                          {insight.suggestions.map((suggestion, i) => (
                            <li key={i} className="flex items-start mb-1">
                              <span className="mr-2">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 gap-6">
                {trends.map(trend => (
                  <div key={trend.metric} className="bg-truth-100 dark:bg-truth-800 rounded-xl p-4 shadow-soft">
                    <h3 className="text-lg font-medium mb-1 text-truth-700 dark:text-truth-200">{trend.metric}</h3>
                    <div className="flex items-center mb-4">
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          trend.changeRate > 0
                            ? 'bg-truth-200 text-truth-800 dark:bg-truth-700 dark:text-truth-200'
                            : trend.changeRate < 0
                            ? 'bg-truth-300 text-truth-900 dark:bg-truth-600 dark:text-truth-100'
                            : 'bg-truth-200 text-truth-700 dark:bg-truth-700 dark:text-truth-300'
                        }`}
                      >
                        {trend.changeRate > 0 ? '+' : ''}{(trend.changeRate * 100).toFixed(0)}%
                      </div>
                      <span className="ml-2 text-sm text-truth-500 dark:text-truth-400">
                        over the last 30 days
                      </span>
                    </div>
                    
                    {/* Simple bar chart visualization */}
                    <div className="h-32 flex items-end space-x-1 mb-2">
                      {trend.values.map((dataPoint, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div
                            className={`w-full rounded-t ${
                              trend.category === 'communication'
                                ? 'bg-truth-400 dark:bg-truth-500'
                                : trend.category === 'conflict'
                                ? 'bg-truth-600 dark:bg-truth-400'
                                : 'bg-truth-500 dark:bg-truth-600'
                            }`}
                            style={{
                              height: `${dataPoint.value * 100}%`
                            }}
                          />
                          <div className="text-xs text-truth-500 dark:text-truth-400 mt-1 transform -rotate-45 origin-top-left translate-y-2">
                            {new Date(dataPoint.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-sm text-truth-500 dark:text-truth-400">
                      Current value: <span className="font-medium text-truth-700 dark:text-truth-300">{(trend.currentValue * 10).toFixed(1)}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Progress Tab */}
          {activeTab === 'progress' && progressReport && (
            <motion.div 
      variants={itemVariants}
      className="bg-truth-100 dark:bg-truth-800 rounded-xl p-6 shadow-soft max-w-2xl mx-auto"
    >
      {/* Report Title and Period */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-truth-900 dark:text-truth-100">30-Day Progress Report</h3>
        <p className="text-sm text-truth-500 dark:text-truth-400">Covering period: {progressReport.period}</p>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-truth-700 dark:text-truth-200">Overall Progress</span>
          <span className="text-sm font-medium text-truth-700 dark:text-truth-200">{progressReport.overallProgress}%</span>
        </div>
        <div className="w-full bg-truth-200 dark:bg-truth-700 rounded-full h-2.5">
          <div className="bg-truth-500 h-2.5 rounded-full" style={{ width: `${progressReport.overallProgress}%` }}></div>
        </div>
      </div>

      {/* Key Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {Object.entries(progressReport.keyAreas).map(([key, area]: [string, any]) => (
          <div key={key} className="text-center p-3 bg-truth-50 dark:bg-truth-900 rounded-lg shadow-sm">
            <div className="text-3xl font-bold mb-1 text-truth-900 dark:text-truth-100">{area.score}</div>
            <div className={`text-xs font-medium ${
              area.change.startsWith('+')
                ? 'text-truth-700 dark:text-truth-300'
                : area.change.startsWith('-')
                ? 'text-truth-600 dark:text-truth-400'
                : 'text-truth-500 dark:text-truth-400'
            }`}>
              {area.change}
            </div>
            <div className="text-sm capitalize mt-1 text-truth-700 dark:text-truth-300">{key.replace(/([A-Z])/g, ' $1')}</div>
            {area.insight && <p className="text-xs text-truth-500 dark:text-truth-400 mt-1">{area.insight}</p>}
          </div>
        ))}
      </div>

      {/* Recommended Focus */}
      <div className="mb-6">
        <h4 className="font-medium mb-2 text-truth-700 dark:text-truth-200">Recommended Focus:</h4>
        <p className="text-truth-600 dark:text-truth-400 bg-truth-50 dark:bg-truth-800 p-3 rounded-lg">
          {progressReport.recommendedFocus}
        </p>
      </div>

      {/* Key Achievements */}
      <div>
        <h4 className="font-medium mb-2 text-truth-700 dark:text-truth-200">Key Achievements:</h4>
        <ul className="space-y-2">
          {progressReport.achievements.map((achievement: string, i: number) => (
            <li key={i} className="flex items-center bg-truth-50 dark:bg-truth-800 p-2 rounded-lg">
              <span className="text-truth-500 mr-2">✓</span>
              <span className="text-truth-600 dark:text-truth-400">{achievement}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
          )}
        </>
      )}
      
      <div className="mt-8 text-center">
        <Link to="/success" className="inline-block bg-truth-700 hover:bg-truth-600 text-truth-50 font-medium py-2 px-6 rounded-lg transition duration-200 shadow-soft">
          Continue Journey
        </Link>
      </div>
    </motion.div>
  );
};

export default Memory;
