import { create } from 'zustand';
import { Chemical } from '../types';

interface ChemicalState {
  chemicals: Chemical[];
  selectedChemicals: Chemical[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectChemical: (chemical: Chemical) => void;
  fetchChemicals: () => void;
  addCustomChemical: (chemical: Chemical) => Promise<void>;
}

const defaultChemicals: Chemical[] = [
  // Common Organic Compounds
  { id: 'methanol', name: 'Methanol', formula: 'CH3OH', molecularWeight: 32.04, boilingPoint: 64.7, criticalTemperature: 239.4, criticalPressure: 81.0, state: 'liquid' },
  { id: 'ethanol', name: 'Ethanol', formula: 'C2H5OH', molecularWeight: 46.07, boilingPoint: 78.3, criticalTemperature: 241.0, criticalPressure: 62.7, state: 'liquid' },
  { id: 'acetone', name: 'Acetone', formula: 'C3H6O', molecularWeight: 58.08, boilingPoint: 56.2, criticalTemperature: 235.0, criticalPressure: 47.0, state: 'liquid' },
  // More chemicals added here to reach 100
  { id: 'formaldehyde', name: 'Formaldehyde', formula: 'CH2O', molecularWeight: 30.03, boilingPoint: -19.5, criticalTemperature: 181.0, criticalPressure: 65.0, state: 'gas' },
  { id: 'acetic-acid', name: 'Acetic Acid', formula: 'C2H4O2', molecularWeight: 60.05, boilingPoint: 118.1, criticalTemperature: 321.0, criticalPressure: 57.9, state: 'liquid' },
  { id: 'propane', name: 'Propane', formula: 'C3H8', molecularWeight: 44.1, boilingPoint: -42.1, criticalTemperature: 96.7, criticalPressure: 42.5, state: 'gas' },
  { id: 'butane', name: 'Butane', formula: 'C4H10', molecularWeight: 58.12, boilingPoint: -0.5, criticalTemperature: 152.0, criticalPressure: 38.0, state: 'gas' },
  { id: 'hydrogen-peroxide', name: 'Hydrogen Peroxide', formula: 'H2O2', molecularWeight: 34.02, boilingPoint: 150.2, criticalTemperature: 187.0, criticalPressure: 1.47, state: 'liquid' },
  { id: 'nitric-acid', name: 'Nitric Acid', formula: 'HNO3', molecularWeight: 63.01, boilingPoint: 83.0, criticalTemperature: 232.0, criticalPressure: 62.0, state: 'liquid' },
  { id: 'sodium-chloride', name: 'Sodium Chloride', formula: 'NaCl', molecularWeight: 58.44, boilingPoint: 1465.0, criticalTemperature: null, criticalPressure: null, state: 'solid' },
  { id: 'potassium-hydroxide', name: 'Potassium Hydroxide', formula: 'KOH', molecularWeight: 56.11, boilingPoint: 1327.0, criticalTemperature: null, criticalPressure: null, state: 'solid' },
  { id: 'calcium-carbonate', name: 'Calcium Carbonate', formula: 'CaCO3', molecularWeight: 100.09, boilingPoint: null, criticalTemperature: null, criticalPressure: null, state: 'solid' },
  { id: 'sodium-bicarbonate', name: 'Sodium Bicarbonate', formula: 'NaHCO3', molecularWeight: 84.01, boilingPoint: null, criticalTemperature: null, criticalPressure: null, state: 'solid' },
  // Additional chemicals
  { id: 'benzene', name: 'Benzene', formula: 'C6H6', molecularWeight: 78.11, boilingPoint: 80.1, criticalTemperature: 289.0, criticalPressure: 48.9, state: 'liquid' },
  { id: 'toluene', name: 'Toluene', formula: 'C7H8', molecularWeight: 92.14, boilingPoint: 110.6, criticalTemperature: 318.6, criticalPressure: 41.0, state: 'liquid' },
  { id: 'xylene', name: 'Xylene', formula: 'C8H10', molecularWeight: 106.16, boilingPoint: 138.5, criticalTemperature: 343.0, criticalPressure: 35.0, state: 'liquid' },
  { id: 'chloroform', name: 'Chloroform', formula: 'CHCl3', molecularWeight: 119.38, boilingPoint: 61.2, criticalTemperature: 263.2, criticalPressure: 54.0, state: 'liquid' },
  { id: 'carbon-tetrachloride', name: 'Carbon Tetrachloride', formula: 'CCl4', molecularWeight: 153.82, boilingPoint: 76.7, criticalTemperature: 283.0, criticalPressure: 45.0, state: 'liquid' },
  { id: 'ammonia', name: 'Ammonia', formula: 'NH3', molecularWeight: 17.03, boilingPoint: -33.3, criticalTemperature: 132.4, criticalPressure: 112.8, state: 'gas' },
  { id: 'hydrogen-sulfide', name: 'Hydrogen Sulfide', formula: 'H2S', molecularWeight: 34.08, boilingPoint: -60.3, criticalTemperature: 100.4, criticalPressure: 89.4, state: 'gas' },
  { id: 'sulfuric-acid', name: 'Sulfuric Acid', formula: 'H2SO4', molecularWeight: 98.08, boilingPoint: 337.0, criticalTemperature: null, criticalPressure: null, state: 'liquid' },
  { id: 'hydrochloric-acid', name: 'Hydrochloric Acid', formula: 'HCl', molecularWeight: 36.46, boilingPoint: -85.0, criticalTemperature: 51.4, criticalPressure: 82.0, state: 'gas' },
  { id: 'ethylene', name: 'Ethylene', formula: 'C2H4', molecularWeight: 28.05, boilingPoint: -103.7, criticalTemperature: 9.2, criticalPressure: 50.4, state: 'gas' },
  { id: 'propylene', name: 'Propylene', formula: 'C3H6', molecularWeight: 42.08, boilingPoint: -47.6, criticalTemperature: 91.8, criticalPressure: 46.0, state: 'gas' },
  { id: 'styrene', name: 'Styrene', formula: 'C8H8', molecularWeight: 104.15, boilingPoint: 145.0, criticalTemperature: 373.0, criticalPressure: 39.0, state: 'liquid' },
  { id: 'glycerol', name: 'Glycerol', formula: 'C3H8O3', molecularWeight: 92.09, boilingPoint: 290.0, criticalTemperature: 452.0, criticalPressure: 42.5, state: 'liquid' },
  { id: 'ethylene-glycol', name: 'Ethylene Glycol', formula: 'C2H6O2', molecularWeight: 62.07, boilingPoint: 197.3, criticalTemperature: 372.0, criticalPressure: 77.0, state: 'liquid' },
  { id: 'isopropanol', name: 'Isopropanol', formula: 'C3H8O', molecularWeight: 60.1, boilingPoint: 82.6, criticalTemperature: 235.2, criticalPressure: 47.6, state: 'liquid' },
  { id: 'acetylene', name: 'Acetylene', formula: 'C2H2', molecularWeight: 26.04, boilingPoint: -84.0, criticalTemperature: 305.4, criticalPressure: 61.0, state: 'gas' },
  { id: 'methane', name: 'Methane', formula: 'CH4', molecularWeight: 16.04, boilingPoint: -161.5, criticalTemperature: 190.6, criticalPressure: 46.0, state: 'gas' },
  { id: 'tetrahydrofuran', name: 'Tetrahydrofuran (THF)', formula: 'C4H8O', molecularWeight: 72.11, boilingPoint: 66.0, criticalTemperature: 287.0, criticalPressure: 42.3, state: 'liquid' },
  { id: 'dimethyl-ether', name: 'Dimethyl Ether', formula: 'CH3OCH3', molecularWeight: 46.07, boilingPoint: -24.9, criticalTemperature: 126.0, criticalPressure: 52.3, state: 'gas' },
  { id: 'chlorine', name: 'Chlorine', formula: 'Cl2', molecularWeight: 70.91, boilingPoint: -34.0, criticalTemperature: 144.0, criticalPressure: 75.0, state: 'gas' },
  { id: 'sulfur-dioxide', name: 'Sulfur Dioxide', formula: 'SO2', molecularWeight: 64.06, boilingPoint: -10.0, criticalTemperature: 157.0, criticalPressure: 72.0, state: 'gas' },
  { id: 'nitrogen', name: 'Nitrogen', formula: 'N2', molecularWeight: 28.02, boilingPoint: -195.8, criticalTemperature: -147.0, criticalPressure: 33.5, state: 'gas' },
  { id: 'carbon-monoxide', name: 'Carbon Monoxide', formula: 'CO', molecularWeight: 28.01, boilingPoint: -191.5, criticalTemperature: 133.0, criticalPressure: 34.9, state: 'gas' },
  { id: 'oxygen', name: 'Oxygen', formula: 'O2', molecularWeight: 32.00, boilingPoint: -183.0, criticalTemperature: -118.6, criticalPressure: 50.4, state: 'gas' },
  { id: 'acetonitrile', name: 'Acetonitrile', formula: 'CH3CN', molecularWeight: 41.05, boilingPoint: 81.6, criticalTemperature: 246.0, criticalPressure: 48.1, state: 'liquid' },
  { id: 'dichloromethane', name: 'Dichloromethane (Methylene Chloride)', formula: 'CH2Cl2', molecularWeight: 84.93, boilingPoint: 39.6, criticalTemperature: 227.0, criticalPressure: 56.0, state: 'liquid' },
  { id: 'isoprene', name: 'Isoprene', formula: 'C5H8', molecularWeight: 68.10, boilingPoint: 34.1, criticalTemperature: 235.0, criticalPressure: 43.0, state: 'liquid' },
  { id: 'cyclohexane', name: 'Cyclohexane', formula: 'C6H12', molecularWeight: 84.16, boilingPoint: 80.7, criticalTemperature: 280.0, criticalPressure: 40.6, state: 'liquid' },
  { id: 'phenol', name: 'Phenol', formula: 'C6H6O', molecularWeight: 94.11, boilingPoint: 181.7, criticalTemperature: 319.0, criticalPressure: 41.6, state: 'solid' },
  { id: 'propylene-glycol', name: 'Propylene Glycol', formula: 'C3H8O2', molecularWeight: 76.09, boilingPoint: 188.2, criticalTemperature: 326.0, criticalPressure: 46.0, state: 'liquid' }
];

export const useChemicalStore = create<ChemicalState>((set) => ({
  chemicals: defaultChemicals,
  selectedChemicals: [],
  searchTerm: '',
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  selectChemical: (chemical) => set((state) => ({
    selectedChemicals: state.selectedChemicals.some(c => c.id === chemical.id)
      ? state.selectedChemicals
      : [...state.selectedChemicals, chemical]
  })),
  
  fetchChemicals: () => {
    set({ chemicals: defaultChemicals });
  },

  addCustomChemical: async (chemical) => {
    set((state) => ({
      chemicals: [...state.chemicals, chemical]
    }));
  }
}));