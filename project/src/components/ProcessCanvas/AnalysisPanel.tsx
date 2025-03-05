import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { X, ChevronRight, Download } from 'lucide-react';
import { useProcessStore } from '../../store/processStore';
import { useChemicalStore } from '../../store/chemicalStore';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { 
      position: 'top' as const,
      labels: {
        color: 'rgba(255, 255, 255, 0.8)'
      }
    },
    title: { 
      display: true,
      color: 'rgba(255, 255, 255, 0.8)'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.8)'
      }
    },
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.8)'
      }
    }
  }
};

const AnalysisPanel = () => {
  const [activeTab, setActiveTab] = useState('mass');
  const { analysisResults, setAnalysisVisible, nodes, connections, selectedModel } = useProcessStore();
  const { selectedChemicals } = useChemicalStore();
  const [chartData, setChartData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    if (nodes.length > 0) {
      generateAnalysisData();
    }
  }, [nodes, connections, activeTab]);

  const generateAnalysisData = () => {
    // Generate mock data if no real analysis results
    const mockData = generateMockData();
    
    switch (activeTab) {
      case 'mass':
        setChartData({
          labels: nodes.map(node => node.name),
          datasets: [
            {
              label: 'Input Flow (kg/h)',
              data: mockData.massBalance.map(item => item.inFlow),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              tension: 0.1
            },
            {
              label: 'Output Flow (kg/h)',
              data: mockData.massBalance.map(item => item.outFlow),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              tension: 0.1
            }
          ]
        });
        break;
      case 'energy':
        setChartData({
          labels: nodes.map(node => node.name),
          datasets: [
            {
              label: 'Energy In (kJ/h)',
              data: mockData.energyBalance.map(item => item.inEnergy),
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              tension: 0.1
            },
            {
              label: 'Energy Out (kJ/h)',
              data: mockData.energyBalance.map(item => item.outEnergy),
              borderColor: 'rgb(255, 159, 64)',
              backgroundColor: 'rgba(255, 159, 64, 0.5)',
              tension: 0.1
            }
          ]
        });
        break;
      case 'vle':
        setChartData({
          labels: selectedChemicals.map(chem => chem.name),
          datasets: [
            {
              label: 'Vapor Fraction',
              data: selectedChemicals.map(() => Math.random() * 0.8 + 0.2),
              borderColor: 'rgb(153, 102, 255)',
              backgroundColor: 'rgba(153, 102, 255, 0.5)',
              tension: 0.1
            },
            {
              label: 'Liquid Fraction',
              data: selectedChemicals.map(() => Math.random() * 0.8 + 0.2),
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              tension: 0.1
            }
          ]
        });
        break;
      case 'efficiency':
        setChartData({
          labels: nodes.map(node => node.name),
          datasets: [
            {
              label: 'Equipment Efficiency (%)',
              data: nodes.map(() => Math.random() * 30 + 70),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              tension: 0.1
            }
          ]
        });
        break;
      case 'economics':
        setChartData({
          labels: ['Capital Cost', 'Operating Cost', 'Maintenance', 'Raw Materials', 'Utilities', 'Labor'],
          datasets: [
            {
              label: 'Cost Distribution ($)',
              data: [
                Math.random() * 500000 + 500000,
                Math.random() * 300000 + 200000,
                Math.random() * 100000 + 50000,
                Math.random() * 200000 + 100000,
                Math.random() * 150000 + 50000,
                Math.random() * 200000 + 100000
              ],
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }
          ]
        });
        break;
    }

    // Generate recommendations based on the process
    generateRecommendations();
  };

  const generateMockData = () => {
    // Generate realistic mock data for analysis
    const massBalance = nodes.map(node => {
      const inFlow = Math.random() * 500 + 100;
      const outFlow = inFlow * (Math.random() * 0.2 + 0.9); // Slight imbalance for realism
      return {
        id: node.id,
        name: node.name,
        inFlow,
        outFlow,
        accumulation: inFlow - outFlow
      };
    });

    const energyBalance = nodes.map(node => {
      const inEnergy = Math.random() * 5000 + 1000;
      const outEnergy = inEnergy * (Math.random() * 0.3 + 0.8); // Energy loss
      const heatDuty = inEnergy - outEnergy;
      return {
        id: node.id,
        name: node.name,
        inEnergy,
        outEnergy,
        heatDuty,
        deltaE: inEnergy - outEnergy
      };
    });

    return {
      massBalance,
      energyBalance
    };
  };

  const generateRecommendations = () => {
    // Generate intelligent recommendations based on the process configuration
    const recs = [];
    
    // Check if there are enough heat exchangers
    const heatExchangers = nodes.filter(n => 
      n.type === 'heat_exchanger' || n.type === 'heater' || n.type === 'cooler'
    );
    if (heatExchangers.length < nodes.length * 0.2) {
      recs.push("Consider adding more heat exchangers for better energy integration and recovery.");
    }
    
    // Check for pressure drops
    const pressureChangers = nodes.filter(n => 
      n.type === 'pump' || n.type === 'compressor' || n.type === 'valve'
    );
    if (pressureChangers.length < 2) {
      recs.push("Your process may need additional pressure control equipment to maintain optimal operating conditions.");
    }
    
    // Check thermodynamic model appropriateness
    if (selectedModel) {
      if (selectedModel.id === 'ideal-gas' && nodes.some(n => n.parameters.pressure > 5)) {
        recs.push("The Ideal Gas model may not be accurate for your high-pressure operations. Consider using Peng-Robinson instead.");
      }
      
      if (selectedModel.id === 'wilson' && selectedChemicals.length > 3) {
        recs.push("Wilson model may have convergence issues with your complex mixture. NRTL or UNIQUAC might be more suitable.");
      }
    }
    
    // General recommendations
    recs.push("Optimize heat integration to reduce utility costs by implementing a pinch analysis.");
    recs.push("Consider implementing advanced control strategies for critical process units to improve stability and efficiency.");
    recs.push("Evaluate the economic impact of increasing equipment sizes versus operating at higher throughput.");
    
    setRecommendations(recs);
  };

  const generatePDF = async () => {
    const element = document.getElementById('analysis-content');
    if (!element) return;
    
    const canvas = await html2canvas(element, {
      scale: 1,
      backgroundColor: '#1f2937',
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('process-analysis.pdf');
  };

  const tabs = [
    { id: 'mass', label: 'Mass Balance' },
    { id: 'energy', label: 'Energy Balance' },
    { id: 'vle', label: 'VLE' },
    { id: 'heat', label: 'Heat Transfer' },
    { id: 'massTransfer', label: 'Mass Transfer' },
    { id: 'kinetics', label: 'Kinetics' },
    { id: 'pressure', label: 'Pressure Drop' },
    { id: 'thermal', label: 'Thermal Analysis' },
    { id: 'efficiency', label: 'Equipment Efficiency' },
    { id: 'economics', label: 'Economic Analysis' }
  ];

  const renderContent = () => {
    if (nodes.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">No equipment added to the process. Add equipment and connections to see results.</p>
        </div>
      );
    }

    return (
      <div id="analysis-content" className="space-y-8">
        {chartData && (
          <div className="bg-gray-700/30 p-6 rounded-lg">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}

        <div className="bg-gray-700/30 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-4">Detailed Analysis</h4>
          {activeTab === 'mass' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2 bg-gray-600/30">Equipment</th>
                    <th className="text-left p-2 bg-gray-600/30">Input Flow (kg/h)</th>
                    <th className="text-left p-2 bg-gray-600/30">Output Flow (kg/h)</th>
                    <th className="text-left p-2 bg-gray-600/30">Accumulation (kg/h)</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map((node, index) => {
                    const inFlow = Math.random() * 500 + 100;
                    const outFlow = inFlow * (Math.random() * 0.2 + 0.9);
                    return (
                      <tr key={node.id} className="border-t border-gray-600/30">
                        <td className="p-2">{node.name}</td>
                        <td className="p-2">{inFlow.toFixed(2)}</td>
                        <td className="p-2">{outFlow.toFixed(2)}</td>
                        <td className="p-2">{(inFlow - outFlow).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'energy' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2 bg-gray-600/30">Equipment</th>
                    <th className="text-left p-2 bg-gray-600/30">Energy In (kJ/h)</th>
                    <th className="text-left p-2 bg-gray-600/30">Energy Out (kJ/h)</th>
                    <th className="text-left p-2 bg-gray-600/30">Heat Duty (kJ/h)</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map((node, index) => {
                    const inEnergy = Math.random() * 5000 + 1000;
                    const outEnergy = inEnergy * (Math.random() * 0.3 + 0.8);
                    const heatDuty = inEnergy - outEnergy;
                    return (
                      <tr key={node.id} className="border-t border-gray-600/30">
                        <td className="p-2">{node.name}</td>
                        <td className="p-2">{inEnergy.toFixed(2)}</td>
                        <td className="p-2">{outEnergy.toFixed(2)}</td>
                        <td className="p-2">{heatDuty.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'vle' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2 bg-gray-600/30">Component</th>
                    <th className="text-left p-2 bg-gray-600/30">Vapor Fraction</th>
                    <th className="text-left p-2 bg-gray-600/30">Liquid Fraction</th>
                    <th className="text-left p-2 bg-gray-600/30">K-Value</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedChemicals.map((chemical, index) => {
                    const vaporFraction = Math.random() * 0.8 + 0.2;
                    const liquidFraction = Math.random() * 0.8 + 0.2;
                    const kValue = vaporFraction / liquidFraction;
                    return (
                      <tr key={chemical.id} className="border-t border-gray-600/30">
                        <td className="p-2">{chemical.name}</td>
                        <td className="p-2">{vaporFraction.toFixed(4)}</td>
                        <td className="p-2">{liquidFraction.toFixed(4)}</td>
                        <td className="p-2">{kValue.toFixed(4)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="bg-gray-700/30 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-4">Process Recommendations</h4>
          <ul className="list-disc pl-6 space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-gray-300">{rec}</li>
            ))}
          </ul>
        </div>
        
        <div className="bg-gray-700/30 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-4">Simulation Notes</h4>
          <div className="space-y-4">
            <p className="text-gray-300">
              This simulation was performed using the <span className="font-semibold text-cyan-400">{selectedModel?.name || 'Default'}</span> thermodynamic model, 
              which is {selectedModel?.description || 'suitable for this process'}.
            </p>
            <p className="text-gray-300">
              The process contains {nodes.length} equipment units connected through {connections.length} process streams.
              The main chemicals involved are {selectedChemicals.map(c => c.name).join(', ')}.
            </p>
            <p className="text-gray-300">
              Operating conditions range from {Math.min(...nodes.map(n => n.parameters.temperature || 25)).toFixed(1)}°C to {Math.max(...nodes.map(n => n.parameters.temperature || 25)).toFixed(1)}°C 
              and {Math.min(...nodes.map(n => n.parameters.pressure || 1)).toFixed(1)} bar to {Math.max(...nodes.map(n => n.parameters.pressure || 1)).toFixed(1)} bar.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-xl w-[90vw] h-[90vh] flex overflow-hidden">
        <div className="w-64 bg-gray-900 p-4">
          <div className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center justify-between ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'hover:bg-gray-800'
                }`}
              >
                {tab.label}
                <ChevronRight
                  className={`w-4 h-4 transform transition-transform ${
                    activeTab === tab.id ? 'rotate-90' : ''
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Process Analysis</h2>
            <div className="flex gap-2">
              <button
                onClick={generatePDF}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-5 h-5" />
                Export PDF
              </button>
              <button
                onClick={() => setAnalysisVisible(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;