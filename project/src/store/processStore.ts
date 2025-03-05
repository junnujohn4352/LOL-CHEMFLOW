import { create } from 'zustand';
import { Equipment, ProcessStream, ThermodynamicModel, Chemical } from '../types';
import { 
  calculateMassBalance, 
  calculateEnergyBalance, 
  calculateVLE,
  calculatePressureDrop,
  calculateHeatTransfer 
} from '../utils/calculations';

interface ProcessStore {
  nodes: Equipment[];
  connections: ProcessStream[];
  selectedNode: Equipment | null;
  analysisResults: any | null;
  isAnalysisVisible: boolean;
  selectedModel: ThermodynamicModel | null;
  
  // Actions
  setSelectedModel: (model: ThermodynamicModel) => void;
  addNode: (node: Equipment) => void;
  updateNode: (id: string, data: Partial<Equipment>) => void;
  setSelectedNode: (node: Equipment | null) => void;
  addConnection: (connection: Partial<ProcessStream>) => void;
  calculateResults: () => void;
  setAnalysisVisible: (visible: boolean) => void;
  addChemicalNode: (chemical: Chemical, position: { x: number; y: number }) => void;
}

export const useProcessStore = create<ProcessStore>((set, get) => ({
  nodes: [],
  connections: [],
  selectedNode: null,
  analysisResults: null,
  isAnalysisVisible: false,
  selectedModel: null,
  
  setSelectedModel: (model) => set({ selectedModel: model }),
  
  addNode: (node) => {
    set((state) => {
      const newNodes = [...state.nodes, node];
      const results = calculateAllResults(newNodes, state.connections);
      return { 
        nodes: newNodes,
        analysisResults: results
      };
    });
  },

  updateNode: (id, data) => {
    set((state) => {
      const newNodes = state.nodes.map(node => 
        node.id === id ? { ...node, ...data } : node
      );
      const results = calculateAllResults(newNodes, state.connections);
      return {
        nodes: newNodes,
        selectedNode: state.selectedNode?.id === id ? { ...state.selectedNode, ...data } : state.selectedNode,
        analysisResults: results
      };
    });
  },

  setSelectedNode: (node) => set({ selectedNode: node }),

  addConnection: (connection) => {
    const sourceNode = get().nodes.find(n => n.id === connection.sourceId);
    const targetNode = get().nodes.find(n => n.id === connection.targetId);
    
    if (sourceNode && targetNode) {
      const streamData: ProcessStream = {
        id: `stream-${Date.now()}`,
        sourceId: connection.sourceId!,
        targetId: connection.targetId!,
        composition: sourceNode.parameters.composition || [],
        temperature: sourceNode.parameters.temperature || 0,
        pressure: sourceNode.parameters.pressure || 0,
        totalFlow: sourceNode.parameters.flowRate || 0
      };
      
      set((state) => {
        const newConnections = [...state.connections, streamData];
        const results = calculateAllResults(state.nodes, newConnections);
        return {
          connections: newConnections,
          analysisResults: results
        };
      });
    }
  },

  addChemicalNode: (chemical, position) => {
    const node: Equipment = {
      id: `chemical_${chemical.id}_${Date.now()}`,
      type: 'feed_tank',
      position,
      name: chemical.name,
      parameters: {
        temperature: 25,
        pressure: 1,
        flowRate: 100,
        composition: [{
          chemicalId: chemical.id,
          moleFraction: 1,
          massFlow: 0,
          temperature: 25,
          pressure: 1
        }]
      }
    };
    
    set((state) => {
      const newNodes = [...state.nodes, node];
      const results = calculateAllResults(newNodes, state.connections);
      return {
        nodes: newNodes,
        analysisResults: results
      };
    });
  },

  calculateResults: () => {
    const { nodes, connections } = get();
    const results = calculateAllResults(nodes, connections);
    set({ 
      analysisResults: results,
      isAnalysisVisible: true
    });
  },

  setAnalysisVisible: (visible) => set({ isAnalysisVisible: visible })
}));

const calculateAllResults = (nodes: Equipment[], connections: ProcessStream[]) => {
  try {
    return {
      massBalance: calculateMassBalance(nodes, connections),
      energyBalance: calculateEnergyBalance(nodes, connections),
      vle: calculateVLE(nodes),
      pressureDrops: calculatePressureDrop(nodes, connections),
      heatTransfer: nodes
        .filter(n => n.type.includes('heat_exchanger'))
        .map(n => calculateHeatTransfer(n))
    };
  } catch (error) {
    console.error("Error calculating results:", error);
    return null;
  }
};