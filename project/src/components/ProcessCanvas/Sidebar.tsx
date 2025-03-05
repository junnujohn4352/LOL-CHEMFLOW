import React, { useState } from 'react';
import { EquipmentType } from '../../types';
import { useChemicalStore } from '../../store/chemicalStore';
import { 
  Beaker, 
  Waves, 
  CircleDot, 
  GitMerge, 
  TestTubes, 
  Container, 
  Filter, 
  Snowflake, 
  Wind, 
  Combine, 
  Droplets, 
  Split, 
  ChevronDown, 
  ChevronRight, 
  FlaskRound as Flask, 
  Cylinder, 
  Gauge, 
  Pipette, 
  Microscope, 
  Atom,
  Cloud,
  Thermometer,
  Columns,
  Layers,
  Zap,
  Flame,
  Droplet,
  Aperture,
  Cog,
  Landmark,
  Lightbulb,
  Rocket,
  Truck,
  Wrench
} from 'lucide-react';

const Sidebar = () => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['raw-materials']);
  const { selectedChemicals } = useChemicalStore();

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const onDragStart = (event: React.DragEvent, nodeType: string, data?: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    if (data) {
      event.dataTransfer.setData('application/json', JSON.stringify(data));
    }
    event.dataTransfer.effectAllowed = 'move';
  };

  const equipmentCategories = [
    {
      id: 'raw-materials',
      label: 'Raw Materials',
      items: [
        ...selectedChemicals.map(chemical => ({
          id: `feed-${chemical.id}`,
          type: EquipmentType.FEED,
          icon: Container,
          label: chemical.name,
          data: {
            chemical,
            parameters: {
              temperature: 25,
              pressure: 1,
              flowRate: 100,
              composition: 0,
              vaporFraction: 0,
              enthalpy: 0,
              entropy: 0,
              density: 0,
              viscosity: 0,
              molecularWeight: chemical.molecularWeight
            }
          }
        })),
        {
          id: 'steam-input',
          type: EquipmentType.STEAM_INPUT,
          icon: Cloud,
          label: 'Steam Input',
          data: {
            parameters: {
              temperature: 150,
              pressure: 5,
              flowRate: 50,
              quality: 1,
              enthalpy: 2800,
              entropy: 6.5
            }
          }
        },
        {
          id: 'steam-output',
          type: EquipmentType.STEAM_OUTPUT,
          icon: Cloud,
          label: 'Steam Output',
          data: {
            parameters: {
              temperature: 100,
              pressure: 1,
              flowRate: 50,
              quality: 0.9,
              enthalpy: 2600,
              entropy: 6.0
            }
          }
        },
        {
          id: 'feed-tank',
          type: EquipmentType.FEED_TANK,
          icon: Container,
          label: 'Feed Tank',
          data: {
            parameters: {
              temperature: 25,
              pressure: 1,
              flowRate: 100,
              volume: 10,
              level: 5,
              composition: []
            }
          }
        }
      ]
    },
    {
      id: 'reactors',
      label: 'Reactors',
      items: [
        {
          id: 'cstr',
          type: EquipmentType.CSTR,
          icon: Beaker,
          label: 'CSTR',
          data: {
            parameters: {
              temperature: 80,
              pressure: 2,
              volume: 10,
              conversion: 0.85,
              selectivity: 0.9,
              yield: 0.75,
              residence: 30,
              heatDuty: 500,
              agitatorPower: 5,
              reactionRate: 0.05
            }
          }
        },
        {
          id: 'pfr',
          type: EquipmentType.PFR,
          icon: Cylinder,
          label: 'PFR',
          data: {
            parameters: {
              temperature: 90,
              pressure: 3,
              length: 5,
              diameter: 0.5,
              conversion: 0.9,
              selectivity: 0.95,
              yield: 0.85,
              residence: 20,
              heatDuty: 600,
              reactionRate: 0.08
            }
          }
        },
        {
          id: 'batch-reactor',
          type: EquipmentType.BATCH_REACTOR,
          icon: Flask,
          label: 'Batch Reactor',
          data: {
            parameters: {
              temperature: 75,
              pressure: 2,
              volume: 5,
              batchTime: 120,
              conversion: 0.92,
              yield: 0.88,
              heatDuty: 400,
              agitatorPower: 3
            }
          }
        },
        {
          id: 'fluidized-bed',
          type: EquipmentType.FLUIDIZED_BED,
          icon: Layers,
          label: 'Fluidized Bed',
          data: {
            parameters: {
              temperature: 120,
              pressure: 5,
              bedHeight: 2,
              diameter: 1,
              particleSize: 0.002,
              minimumFluidizationVelocity: 0.5,
              bedVoidage: 0.45,
              heatDuty: 1200
            }
          }
        },
        {
          id: 'packed-bed',
          type: EquipmentType.PACKED_BED,
          icon: Layers,
          label: 'Packed Bed',
          data: {
            parameters: {
              temperature: 100,
              pressure: 4,
              length: 3,
              diameter: 0.8,
              particleSize: 0.005,
              bedVoidage: 0.4,
              pressureDrop: 0.5,
              heatDuty: 800
            }
          }
        }
      ]
    },
    {
      id: 'separators',
      label: 'Separators',
      items: [
        {
          id: 'flash',
          type: EquipmentType.FLASH,
          icon: Split,
          label: 'Flash Separator',
          data: {
            parameters: {
              temperature: 60,
              pressure: 1.5,
              vaporFraction: 0.4,
              efficiency: 0.85,
              diameter: 1.2,
              height: 3,
              heatDuty: 200
            }
          }
        },
        {
          id: 'distillation',
          type: EquipmentType.DISTILLATION,
          icon: TestTubes,
          label: 'Distillation Column',
          data: {
            parameters: {
              stages: 20,
              feedStage: 10,
              refluxRatio: 1.5,
              boilupRatio: 2.0,
              pressure: 1.2,
              efficiency: 0.75,
              diameter: 1.5,
              height: 15,
              condenserDuty: -500,
              reboilerDuty: 600
            }
          }
        },
        {
          id: 'absorber',
          type: EquipmentType.ABSORBER,
          icon: Columns,
          label: 'Absorber',
          data: {
            parameters: {
              stages: 10,
              pressure: 2,
              temperature: 30,
              solventRate: 50,
              efficiency: 0.8,
              diameter: 1,
              height: 8,
              packingType: 'Raschig Rings'
            }
          }
        },
        {
          id: 'extractor',
          type: EquipmentType.EXTRACTOR,
          icon: Droplet,
          label: 'Liquid-Liquid Extractor',
          data: {
            parameters: {
              stages: 8,
              solventRate: 40,
              temperature: 25,
              pressure: 1,
              efficiency: 0.7,
              diameter: 0.8,
              height: 6
            }
          }
        },
        {
          id: 'cyclone',
          type: EquipmentType.CYCLONE,
          icon: Aperture,
          label: 'Cyclone Separator',
          data: {
            parameters: {
              diameter: 0.6,
              pressure: 1.5,
              flowRate: 200,
              cutDiameter: 10,
              efficiency: 0.9,
              pressureDrop: 0.2
            }
          }
        },
        {
          id: 'membrane',
          type: EquipmentType.MEMBRANE,
          icon: Filter,
          label: 'Membrane Separator',
          data: {
            parameters: {
              area: 5,
              pressure: 4,
              temperature: 35,
              permeability: 0.001,
              selectivity: 20,
              thickness: 0.0001,
              recovery: 0.85
            }
          }
        }
      ]
    },
    {
      id: 'heat-exchangers',
      label: 'Heat Exchangers',
      items: [
        {
          id: 'cooler',
          type: EquipmentType.COOLER,
          icon: Snowflake,
          label: 'Cooler',
          data: {
            parameters: {
              duty: -500,
              temperature: 25,
              pressure: 1,
              area: 10,
              coefficient: 500,
              inletTemp: 80,
              outletTemp: 25,
              coolantInletTemp: 15,
              coolantOutletTemp: 25,
              coolantFlow: 20
            }
          }
        },
        {
          id: 'heater',
          type: EquipmentType.HEATER,
          icon: Flame,
          label: 'Heater',
          data: {
            parameters: {
              duty: 500,
              temperature: 80,
              pressure: 1,
              area: 10,
              coefficient: 500,
              inletTemp: 25,
              outletTemp: 80,
              heatingMediumTemp: 150,
              heatingMediumFlow: 15
            }
          }
        },
        {
          id: 'shell-and-tube',
          type: EquipmentType.SHELL_AND_TUBE,
          icon: Waves,
          label: 'Shell & Tube',
          data: {
            parameters: {
              duty: 800,
              shellSideTemp: 120,
              tubeSideTemp: 30,
              shellSidePressure: 3,
              tubeSidePressure: 5,
              area: 25,
              coefficient: 600,
              tubes: 100,
              passes: 2,
              foulingFactor: 0.0002
            }
          }
        },
        {
          id: 'plate',
          type: EquipmentType.PLATE,
          icon: Layers,
          label: 'Plate Heat Exchanger',
          data: {
            parameters: {
              duty: 600,
              hotSideTemp: 90,
              coldSideTemp: 20,
              hotSidePressure: 2,
              coldSidePressure: 4,
              area: 15,
              coefficient: 1000,
              plates: 50,
              plateSpacing: 0.005
            }
          }
        },
        {
          id: 'air-cooled',
          type: EquipmentType.AIR_COOLED,
          icon: Wind,
          label: 'Air-Cooled Exchanger',
          data: {
            parameters: {
              duty: -1000,
              processTemp: 150,
              airTemp: 25,
              pressure: 1,
              area: 100,
              coefficient: 35,
              fans: 4,
              fanPower: 15,
              tubes: 200
            }
          }
        }
      ]
    },
    {
      id: 'pressure-changers',
      label: 'Pressure Changers',
      items: [
        {
          id: 'pump',
          type: EquipmentType.PUMP,
          icon: CircleDot,
          label: 'Pump',
          data: {
            parameters: {
              pressure: 5,
              efficiency: 0.75,
              power: 10,
              flowRate: 50,
              head: 50,
              npsh: 3,
              speed: 1450
            }
          }
        },
        {
          id: 'compressor',
          type: EquipmentType.COMPRESSOR,
          icon: Wind,
          label: 'Compressor',
          data: {
            parameters: {
              pressure: 10,
              efficiency: 0.7,
              power: 50,
              flowRate: 100,
              ratio: 3,
              temperature: 80,
              stages: 2
            }
          }
        },
        {
          id: 'valve',
          type: EquipmentType.VALVE,
          icon: Gauge,
          label: 'Control Valve',
          data: {
            parameters: {
              pressureDrop: 2,
              flowCoefficient: 25,
              openingPercentage: 60,
              flowRate: 40,
              temperature: 25
            }
          }
        },
        {
          id: 'turbine',
          type: EquipmentType.TURBINE,
          icon: Zap,
          label: 'Turbine',
          data: {
            parameters: {
              inletPressure: 20,
              outletPressure: 1,
              efficiency: 0.85,
              power: -200,
              flowRate: 150,
              inletTemperature: 400,
              outletTemperature: 150
            }
          }
        }
      ]
    },
    {
      id: 'mixers',
      label: 'Mixers',
      items: [
        {
          id: 'mixer',
          type: EquipmentType.MIXER,
          icon: Combine,
          label: 'Mixer',
          data: {
            parameters: {
              pressure: 1,
              temperature: 25,
              flowRate: 150,
              pressureDrop: 0.1
            }
          }
        },
        {
          id: 'splitter',
          type: EquipmentType.SPLITTER,
          icon: GitMerge,
          label: 'Splitter',
          data: {
            parameters: {
              splitRatio: 0.5,
              pressure: 1,
              temperature: 25,
              flowRate: 100
            }
          }
        },
        {
          id: 'static-mixer',
          type: EquipmentType.STATIC_MIXER,
          icon: Cog,
          label: 'Static Mixer',
          data: {
            parameters: {
              pressure: 2,
              temperature: 30,
              flowRate: 80,
              pressureDrop: 0.3,
              elements: 12,
              diameter: 0.15,
              length: 1
            }
          }
        }
      ]
    },
    {
      id: 'specialized-equipment',
      label: 'Specialized Equipment',
      items: [
        {
          id: 'crystallizer',
          type: EquipmentType.CRYSTALLIZER,
          icon: Snowflake,
          label: 'Crystallizer',
          data: {
            parameters: {
              temperature: 15,
              pressure: 1,
              supersaturation: 1.2,
              yield: 0.8,
              crystalSize: 0.5,
              residence: 60,
              coolingDuty: -300
            }
          }
        },
        {
          id: 'dryer',
          type: EquipmentType.DRYER,
          icon: Wind,
          label: 'Dryer',
          data: {
            parameters: {
              temperature: 80,
              pressure: 1,
              initialMoisture: 0.3,
              finalMoisture: 0.05,
              residence: 45,
              heatDuty: 400,
              airFlow: 200
            }
          }
        },
        {
          id: 'evaporator',
          type: EquipmentType.EVAPORATOR,
          icon: Droplets,
          label: 'Evaporator',
          data: {
            parameters: {
              temperature: 85,
              pressure: 0.5,
              feedConcentration: 0.1,
              productConcentration: 0.5,
              heatDuty: 800,
              area: 20,
              coefficient: 1500
            }
          }
        },
        {
          id: 'filter',
          type: EquipmentType.FILTER,
          icon: Filter,
          label: 'Filter',
          data: {
            parameters: {
              pressure: 3,
              temperature: 25,
              area: 5,
              cakeThickness: 0.02,
              porosity: 0.4,
              efficiency: 0.95,
              flowRate: 20
            }
          }
        }
      ]
    },
    {
      id: 'utilities',
      label: 'Utilities',
      items: [
        {
          id: 'boiler',
          type: EquipmentType.BOILER,
          icon: Flame,
          label: 'Boiler',
          data: {
            parameters: {
              steamPressure: 10,
              steamTemperature: 180,
              steamFlow: 50,
              efficiency: 0.85,
              fuelType: 'Natural Gas',
              fuelConsumption: 5,
              duty: 2500
            }
          }
        },
        {
          id: 'cooling-tower',
          type: EquipmentType.COOLING_TOWER,
          icon: Thermometer,
          label: 'Cooling Tower',
          data: {
            parameters: {
              waterFlow: 200,
              inletTemp: 35,
              outletTemp: 25,
              wetBulbTemp: 20,
              approach: 5,
              fanPower: 30,
              makeupWater: 5
            }
          }
        },
      ]
    }
  ];

  return (
    <div className="w-64 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Equipment Library</h2>
        
        <div className="space-y-2">
          {equipmentCategories.map(category => (
            <div key={category.id} className="bg-gray-700/30 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-700/50 transition-colors"
              >
                <span>{category.label}</span>
                {expandedCategories.includes(category.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {expandedCategories.includes(category.id) && (
                <div className="p-2 space-y-1">
                  {category.items.map(item => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(event) => onDragStart(event, item.type, item.data)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/70 cursor-grab"
                      >
                        <div className="p-1 rounded bg-gray-600/50">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;