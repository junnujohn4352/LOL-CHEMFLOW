export interface Chemical {
  id: string;
  name: string;
  formula: string;
  molecularWeight: number;
  boilingPoint: number;
  criticalTemperature: number;
  criticalPressure: number;
  state: 'solid' | 'liquid' | 'gas';
}

export interface ThermodynamicModel {
  id: string;
  name: string;
  description: string;
  applicableFor: {
    polar: boolean;
    nonPolar: boolean;
    pressure: 'low' | 'medium' | 'high';
    phase: ('vapor' | 'liquid')[];
  };
}

export interface ChemicalComposition {
  chemicalId: string;
  moleFraction: number;
  massFlow: number;
  temperature: number;
  pressure: number;
}

export interface ProcessStream {
  id: string;
  sourceId: string;
  targetId: string;
  composition: ChemicalComposition[];
  temperature: number;
  pressure: number;
  totalFlow: number;
}

export interface Equipment {
  id: string;
  type: EquipmentType;
  position: { x: number; y: number };
  name: string;
  parameters: {
    temperature: number;
    pressure: number;
    flowRate: number;
    composition?: ChemicalComposition[];
    efficiency?: number;
    heatDuty?: number;
    [key: string]: any;
  };
}

export enum EquipmentType {
  // Raw Materials
  FEED = 'feed',
  FEED_TANK = 'feed_tank',
  STORAGE_TANK = 'storage_tank',
  STEAM_INPUT = 'steam_input',
  STEAM_OUTPUT = 'steam_output',
  
  // Reactors
  PFR = 'pfr',
  CSTR = 'cstr',
  BATCH_REACTOR = 'batch_reactor',
  FLUIDIZED_BED = 'fluidized_bed',
  PACKED_BED = 'packed_bed',
  
  // Heat Exchangers
  SHELL_AND_TUBE = 'shell_and_tube',
  PLATE = 'plate',
  AIR_COOLED = 'air_cooled',
  SPIRAL = 'spiral',
  DOUBLE_PIPE = 'double_pipe',
  HEATER = 'heater',
  COOLER = 'cooler',
  
  // Separation
  DISTILLATION = 'distillation',
  FLASH = 'flash',
  ABSORBER = 'absorber',
  EXTRACTOR = 'extractor',
  CYCLONE = 'cyclone',
  CRYSTALLIZER = 'crystallizer',
  MEMBRANE = 'membrane',
  
  // Basic Equipment
  PUMP = 'pump',
  MIXER = 'mixer',
  SPLITTER = 'splitter',
  COMPRESSOR = 'compressor',
  TANK = 'tank',
  FILTER = 'filter',
  DRYER = 'dryer',
  EVAPORATOR = 'evaporator',
  VALVE = 'valve',
  
  // Analysis Equipment
  ANALYZER = 'analyzer',
  SENSOR = 'sensor',
  SAMPLER = 'sampler',
  CATALYST_BED = 'catalyst_bed',
  
  // Reactor
  REACTOR = 'reactor',
  
  // Heat Exchanger
  HEAT_EXCHANGER = 'heat_exchanger',
  
  // Additional Equipment
  TURBINE = 'turbine',
  STATIC_MIXER = 'static_mixer',
  BOILER = 'boiler',
  COOLING_TOWER = 'cooling_tower',
  CHILLER = 'chiller',
  AIR_COMPRESSOR = 'air_compressor'
}