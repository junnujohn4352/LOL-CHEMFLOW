import { Equipment, ProcessStream } from '../types';
import * as math from 'mathjs';

const UNIVERSAL_GAS_CONSTANT = 8.314; // J/(mol·K)

export const calculateMassBalance = (nodes: Equipment[], connections: ProcessStream[]) => {
  if (!nodes.length) return [];
  
  return nodes.map(node => {
    try {
      // Get incoming and outgoing streams for this node
      const inFlows = connections.filter(conn => conn.targetId === node.id) || [];
      const outFlows = connections.filter(conn => conn.sourceId === node.id) || [];

      // Calculate total mass flows with default values if undefined
      const inFlow = inFlows.reduce((sum, conn) => sum + (conn.totalFlow || 0), 0);
      const outFlow = outFlows.reduce((sum, conn) => sum + (conn.totalFlow || 0), 0);

      // Calculate component-wise mass balance
      const componentBalance = (node.parameters.composition || []).map(comp => {
        const inFlowComp = inFlows.reduce((sum, conn) => {
          const matchingComp = (conn.composition || []).find(c => c.chemicalId === comp.chemicalId);
          return sum + (matchingComp?.massFlow || 0);
        }, 0);

        const outFlowComp = outFlows.reduce((sum, conn) => {
          const matchingComp = (conn.composition || []).find(c => c.chemicalId === comp.chemicalId);
          return sum + (matchingComp?.massFlow || 0);
        }, 0);

        return {
          chemicalId: comp.chemicalId,
          inFlow: inFlowComp,
          outFlow: outFlowComp,
          accumulation: inFlowComp - outFlowComp
        };
      });

      return {
        id: node.id,
        name: node.name || `Equipment ${node.id}`,
        inFlow,
        outFlow,
        accumulation: inFlow - outFlow,
        componentBalance,
        efficiency: calculateEquipmentEfficiency(node)
      };
    } catch (error) {
      console.warn(`Error calculating mass balance for node ${node.id}:`, error);
      return {
        id: node.id,
        name: node.name || `Equipment ${node.id}`,
        inFlow: 0,
        outFlow: 0,
        accumulation: 0,
        componentBalance: [],
        efficiency: 0.85
      };
    }
  });
};

export const calculateEnergyBalance = (nodes: Equipment[], connections: ProcessStream[]) => {
  if (!nodes.length) return [];

  return nodes.map(node => {
    try {
      const inFlows = connections.filter(conn => conn.targetId === node.id) || [];
      const outFlows = connections.filter(conn => conn.sourceId === node.id) || [];

      // Calculate enthalpy flows
      const calculateStreamEnthalpy = (stream: ProcessStream) => {
        return (stream.composition || []).reduce((total, comp) => {
          const cp = 4.186; // Simplified specific heat capacity
          return total + (comp.massFlow || 0) * cp * ((stream.temperature || 25) - 25); // Reference T = 25°C
        }, 0);
      };

      const inEnergy = inFlows.reduce((sum, stream) => sum + calculateStreamEnthalpy(stream), 0);
      const outEnergy = outFlows.reduce((sum, stream) => sum + calculateStreamEnthalpy(stream), 0);

      // Add equipment-specific energy terms
      const equipmentEnergy = (node.parameters.heatDuty || 0) + (node.parameters.power || 0);

      return {
        id: node.id,
        name: node.name || `Equipment ${node.id}`,
        inEnergy,
        outEnergy,
        equipmentEnergy,
        netEnergy: inEnergy - outEnergy + equipmentEnergy,
        efficiency: calculateEquipmentEfficiency(node)
      };
    } catch (error) {
      console.warn(`Error calculating energy balance for node ${node.id}:`, error);
      return {
        id: node.id,
        name: node.name || `Equipment ${node.id}`,
        inEnergy: 0,
        outEnergy: 0,
        equipmentEnergy: 0,
        netEnergy: 0,
        efficiency: 0.85
      };
    }
  });
};

export const calculateVLE = (nodes: Equipment[]) => {
  if (!nodes.length) return [];

  return nodes
    .filter(node => ['distillation', 'flash', 'evaporator'].includes(node.type))
    .map(node => {
      try {
        const results = (node.parameters.composition || []).map(comp => {
          // Antoine equation parameters (example for water)
          const A = 8.07131;
          const B = 1730.63;
          const C = 233.426;

          // Calculate vapor pressure
          const T = (node.parameters.temperature || 25) + 273.15; // Convert to K
          const Psat = math.exp(A - (B / (T + C)));
          
          // Calculate K-value
          const K = Psat / (node.parameters.pressure || 1);
          
          // Rachford-Rice solution for flash calculations
          const z = comp.moleFraction || 0;
          const beta = 0.5; // Vapor fraction guess
          const x = z / (1 + beta * (K - 1)); // Liquid composition
          const y = K * x; // Vapor composition

          return {
            chemicalId: comp.chemicalId,
            vaporPressure: Psat,
            kValue: K,
            liquidComposition: x,
            vaporComposition: y
          };
        });

        return {
          id: node.id,
          name: node.name || `Equipment ${node.id}`,
          temperature: node.parameters.temperature || 25,
          pressure: node.parameters.pressure || 1,
          results
        };
      } catch (error) {
        console.warn(`Error calculating VLE for node ${node.id}:`, error);
        return {
          id: node.id,
          name: node.name || `Equipment ${node.id}`,
          temperature: 25,
          pressure: 1,
          results: []
        };
      }
    });
};

const calculateEquipmentEfficiency = (equipment: Equipment): number => {
  try {
    switch (equipment.type) {
      case 'pump':
      case 'compressor':
        return calculatePumpEfficiency(equipment);
      case 'heat_exchanger':
        return calculateHeatExchangerEfficiency(equipment);
      case 'reactor':
        return calculateReactorEfficiency(equipment);
      default:
        return equipment.parameters.efficiency || 0.85;
    }
  } catch (error) {
    console.warn(`Error calculating efficiency for equipment ${equipment.id}:`, error);
    return 0.85;
  }
};

const calculatePumpEfficiency = (equipment: Equipment): number => {
  const { flowRate = 0, pressure = 1, power = 0 } = equipment.parameters;
  if (!power) return 0.85;
  const theoreticalPower = flowRate * pressure * 100;
  return Math.min(Math.max(theoreticalPower / power, 0), 1);
};

const calculateHeatExchangerEfficiency = (equipment: Equipment): number => {
  const { inletTemp = 25, outletTemp = 25, targetTemp } = equipment.parameters;
  if (!targetTemp || inletTemp === targetTemp) return 0.85;
  return Math.min(Math.abs((outletTemp - inletTemp) / (targetTemp - inletTemp)), 1);
};

const calculateReactorEfficiency = (equipment: Equipment): number => {
  const { conversion = 1, selectivity = 1, yield: yieldValue = 1 } = equipment.parameters;
  return Math.min(conversion * selectivity * yieldValue, 1);
};

export const calculatePressureDrop = (nodes: Equipment[], connections: ProcessStream[]) => {
  if (!connections.length) return [];

  return connections.map(stream => {
    try {
      const { totalFlow = 0, pressure = 1 } = stream;
      const density = 1000; // kg/m³ (example for water)
      const viscosity = 0.001; // Pa·s
      const diameter = 0.1; // m
      const length = 10; // m
      const area = Math.PI * Math.pow(diameter / 2, 2);
      const velocity = totalFlow / (3600 * area); // Convert flow from m³/h to m³/s

      // Reynolds number
      const Re = (density * velocity * diameter) / viscosity;
      
      // Friction factor (Blasius equation for turbulent flow)
      const f = Re > 4000 ? 0.316 * Math.pow(Re, -0.25) : 64 / Re;
      
      // Pressure drop (Darcy-Weisbach equation)
      const deltaP = (f * length * density * Math.pow(velocity, 2)) / (2 * diameter);

      return {
        streamId: stream.id,
        pressureDrop: deltaP,
        reynoldsNumber: Re,
        frictionFactor: f,
        velocity
      };
    } catch (error) {
      console.warn(`Error calculating pressure drop for stream ${stream.id}:`, error);
      return {
        streamId: stream.id,
        pressureDrop: 0,
        reynoldsNumber: 0,
        frictionFactor: 0,
        velocity: 0
      };
    }
  });
};

export const calculateHeatTransfer = (equipment: Equipment) => {
  try {
    const {
      temperature: T1 = 25,
      inletTemp: T2 = 25,
      flowRate = 0,
      area = 10,
      coefficient = 500
    } = equipment.parameters;

    if (T1 === T2) return {
      id: equipment.id,
      heatDuty: 0,
      LMTD: 0,
      coefficient,
      effectiveness: 0
    };

    const LMTD = Math.abs(T1 - T2);
    const heatDuty = coefficient * area * LMTD;
    const effectiveness = flowRate > 0 ? heatDuty / (flowRate * 4186 * Math.abs(T1 - T2)) : 0;

    return {
      id: equipment.id,
      heatDuty,
      LMTD,
      coefficient,
      effectiveness: Math.min(effectiveness, 1)
    };
  } catch (error) {
    console.warn(`Error calculating heat transfer for equipment ${equipment.id}:`, error);
    return {
      id: equipment.id,
      heatDuty: 0,
      LMTD: 0,
      coefficient: 500,
      effectiveness: 0
    };
  }
};