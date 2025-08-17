'use client';

import React, { useState, useEffect } from 'react';
import { useFinancialModel, useSaveFinancialModel } from '@/hooks/use-operator-data';
import type { CreateFinancialModel } from '@/lib/validation/schemas';
import { safeToFixed } from '@/lib/utils/number';

interface FinancialModelProps {
  agentId: string;
  currentTreasury?: number;
  onSave?: (model: DailyDropModel) => void;
}

interface DailyDropModel {
  // Inputs
  price: number;
  quantity: number;
  frequencyPerWeek: number;
  
  // Costs
  unitCost: number;  // Compute + mint + fulfillment
  platformFeePct: number;  // Eden's cut
  
  // Calculated
  weeklyRevenue: number;
  weeklyCOGS: number;
  weeklyGrossProfit: number;
  breakEvenUnits: number;
  runwayWeeks: number | null;  // null = profitable
  marginPercent: number;
}

export function FinancialModel({ agentId, currentTreasury = 0, onSave }: FinancialModelProps) {
  const { data: savedModel, isLoading } = useFinancialModel(agentId);
  const { mutate: saveModel, isPending } = useSaveFinancialModel(agentId);
  
  const [model, setModel] = useState<DailyDropModel>({
    price: 5.00,  // Start low
    quantity: 10,  // Start small
    frequencyPerWeek: 7,  // Daily
    unitCost: 0.70,  // $0.02 compute + $0.50 gas + $0.18 fulfillment
    platformFeePct: 0.10,  // 10% to Eden
    
    // These get calculated
    weeklyRevenue: 0,
    weeklyCOGS: 0,
    weeklyGrossProfit: 0,
    breakEvenUnits: 0,
    runwayWeeks: null,
    marginPercent: 0
  });

  // Load saved model if exists
  useEffect(() => {
    if (savedModel) {
      setModel(prev => ({
        ...prev,
        price: savedModel.price,
        quantity: savedModel.quantity,
        frequencyPerWeek: savedModel.frequency_per_week,
        unitCost: savedModel.unit_cost,
        platformFeePct: savedModel.platform_fee_pct
      }));
    }
  }, [savedModel]);

  // Recalculate whenever inputs change
  useEffect(() => {
    const weeklyRevenue = model.price * model.quantity * model.frequencyPerWeek;
    const weeklyCOGS = (model.unitCost + (model.price * model.platformFeePct)) * 
                       model.quantity * model.frequencyPerWeek;
    const weeklyGrossProfit = weeklyRevenue - weeklyCOGS;
    const breakEvenUnits = model.unitCost / (model.price * (1 - model.platformFeePct));
    const runwayWeeks = weeklyGrossProfit >= 0 ? null : 
                        Math.floor(currentTreasury / Math.abs(weeklyGrossProfit));
    const marginPercent = weeklyRevenue > 0 ? (weeklyGrossProfit / weeklyRevenue) * 100 : 0;

    setModel(prev => ({
      ...prev,
      weeklyRevenue,
      weeklyCOGS,
      weeklyGrossProfit,
      breakEvenUnits,
      runwayWeeks,
      marginPercent
    }));
  }, [model.price, model.quantity, model.frequencyPerWeek, model.unitCost, 
      model.platformFeePct, currentTreasury]);

  const handleSliderChange = (field: keyof DailyDropModel, value: number) => {
    setModel(prev => ({ ...prev, [field]: value }));
  };

  // Preset scenarios for quick testing
  const applyScenario = (scenario: 'volume' | 'premium' | 'sustainable') => {
    const scenarios = {
      volume: { price: 1, quantity: 50, frequencyPerWeek: 7 },
      premium: { price: 25, quantity: 3, frequencyPerWeek: 3 },
      sustainable: { price: 5, quantity: 10, frequencyPerWeek: 5 }
    };
    setModel(prev => ({ ...prev, ...scenarios[scenario] }));
  };

  return (
    <div className="space-y-6">
      {/* Quick Scenarios */}
      <div className="flex gap-2">
        <button 
          onClick={() => applyScenario('volume')}
          className="px-4 py-2 bg-eden-white/5 hover:bg-eden-white/10 border border-eden-white/20 font-mono text-sm transition-colors"
        >
          VOLUME PLAY
        </button>
        <button 
          onClick={() => applyScenario('premium')}
          className="px-4 py-2 bg-eden-white/5 hover:bg-eden-white/10 border border-eden-white/20 font-mono text-sm transition-colors"
        >
          PREMIUM PLAY
        </button>
        <button 
          onClick={() => applyScenario('sustainable')}
          className="px-4 py-2 bg-eden-white/5 hover:bg-eden-white/10 border border-eden-white/20 font-mono text-sm transition-colors"
        >
          SUSTAINABLE
        </button>
      </div>

      {/* Input Controls */}
      <div className="p-6 bg-eden-black border border-eden-white/20 rounded-lg">
        <h3 className="font-mono text-eden-white mb-4">DAILY DROP PARAMETERS</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-eden-gray text-sm">
              PRICE PER UNIT: ${safeToFixed(model.price)}
            </label>
            <input
              type="range"
              min="0.5"
              max="100"
              step="0.5"
              value={model.price}
              onChange={(e) => handleSliderChange('price', parseFloat(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-xs text-eden-gray mt-1">
              <span>$0.50</span>
              <span>$50</span>
              <span>$100</span>
            </div>
          </div>

          <div>
            <label className="text-eden-gray text-sm">
              QUANTITY PER DROP: {model.quantity} units
            </label>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={model.quantity}
              onChange={(e) => handleSliderChange('quantity', parseInt(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-xs text-eden-gray mt-1">
              <span>1</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>

          <div>
            <label className="text-eden-gray text-sm">
              DROPS PER WEEK: {model.frequencyPerWeek}
            </label>
            <input
              type="range"
              min="1"
              max="7"
              step="1"
              value={model.frequencyPerWeek}
              onChange={(e) => handleSliderChange('frequencyPerWeek', parseInt(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-xs text-eden-gray mt-1">
              <span>1x</span>
              <span>4x</span>
              <span>7x</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Calculations */}
      <div className="p-6 bg-eden-black border border-eden-white/20 rounded-lg">
        <h3 className="font-mono text-eden-white mb-4">UNIT ECONOMICS</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-eden-gray">Weekly Revenue:</span>
            <span className="text-eden-white font-mono">
              ${safeToFixed(model.weeklyRevenue)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-eden-gray">Weekly Costs:</span>
            <span className="text-eden-white font-mono">
              ${safeToFixed(model.weeklyCOGS)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-eden-gray">Weekly Profit:</span>
            <span className={`font-mono ${
              model.weeklyGrossProfit >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              ${safeToFixed(model.weeklyGrossProfit)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-eden-gray">Margin:</span>
            <span className={`font-mono ${
              model.marginPercent >= 30 ? 'text-green-500' : 
              model.marginPercent >= 0 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {safeToFixed(model.marginPercent, 1)}%
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-eden-gray">Break-even:</span>
            <span className="text-eden-white font-mono">
              {Math.ceil(model.breakEvenUnits)} units/drop
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-eden-gray">Runway:</span>
            <span className={`font-mono ${
              model.runwayWeeks === null ? 'text-green-500' : 
              model.runwayWeeks > 12 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {model.runwayWeeks === null ? 'PROFITABLE' : `${model.runwayWeeks} weeks`}
            </span>
          </div>
        </div>
      </div>

      {/* Success Criteria */}
      <div className={`p-6 border rounded-lg ${
        model.weeklyGrossProfit >= 0 ? 'bg-green-500/5 border-green-500' : 
        'bg-red-500/5 border-red-500'
      }`}>
        <h3 className="font-mono text-eden-white mb-4">GRADUATION CRITERIA</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className={model.weeklyGrossProfit >= 0 ? 'text-green-500' : 'text-eden-gray'}>
              {model.weeklyGrossProfit >= 0 ? '✓' : '□'}
            </span>
            <span className={model.weeklyGrossProfit >= 0 ? 'text-green-500' : 'text-eden-gray'}>
              Weekly profit positive (currently: ${safeToFixed(model.weeklyGrossProfit)})
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={model.quantity <= 25 ? 'text-green-500' : 'text-eden-gray'}>
              {model.quantity <= 25 ? '✓' : '□'}
            </span>
            <span className={model.quantity <= 25 ? 'text-green-500' : 'text-eden-gray'}>
              Sustainable quantity (≤25 per drop)
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={model.marginPercent >= 30 ? 'text-green-500' : 'text-eden-gray'}>
              {model.marginPercent >= 30 ? '✓' : '□'}
            </span>
            <span className={model.marginPercent >= 30 ? 'text-green-500' : 'text-eden-gray'}>
              Healthy margin (≥30%, currently: {safeToFixed(model.marginPercent, 1)}%)
            </span>
          </div>
        </div>

        {model.weeklyGrossProfit < 0 && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500 rounded">
            <p className="text-red-500 text-sm font-mono">
              ⚠️ LOSING ${safeToFixed(Math.abs(model.weeklyGrossProfit))}/WEEK
            </p>
            <p className="text-eden-gray text-xs mt-1">
              Increase price to ${safeToFixed(model.unitCost / (1 - model.platformFeePct) * 1.3)} 
              or reduce quantity to break even
            </p>
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={() => {
          const data: CreateFinancialModel = {
            price: model.price,
            quantity: model.quantity,
            frequency_per_week: model.frequencyPerWeek,
            unit_cost: model.unitCost,
            platform_fee_pct: model.platformFeePct
          };
          saveModel(data);
          onSave?.(model);
        }}
        disabled={isPending}
        className="w-full py-3 bg-eden-white text-eden-black font-mono hover:bg-eden-white/90 transition-colors disabled:opacity-50"
      >
        {isPending ? 'SAVING...' : 'SAVE MODEL & APPLY TO DAILY PRACTICE'}
      </button>
    </div>
  );
}