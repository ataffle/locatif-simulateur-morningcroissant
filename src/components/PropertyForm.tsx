
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  InvestmentParams,
  formatCurrency,
  formatPercent
} from "@/utils/calculators";
import SlideTransition from "./SlideTransition";
import { useIsMobile } from "@/hooks/use-mobile";

interface PropertyFormProps {
  params: InvestmentParams;
  onChange: (params: InvestmentParams) => void;
}

const PropertyForm = ({ params, onChange }: PropertyFormProps) => {
  const isMobile = useIsMobile();
  
  const handleChange = (key: keyof InvestmentParams, value: number | string) => {
    onChange({
      ...params,
      [key]: typeof value === "string" && key !== "taxSystem" 
        ? parseFloat(value) || 0 
        : value
    });
  };

  return (
    <SlideTransition delay={100} className="bg-card rounded-xl p-6 card-shadow">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Informations de l'acquisition</h3>
          <p className="text-sm text-muted-foreground">
            Détails sur le bien immobilier et son financement
          </p>
        </div>
        
        <Separator />
        
        <div className="space-y-6">
          {/* Prix d'achat */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <label htmlFor="purchasePrice" className="input-label">
                Prix d'achat
              </label>
              <span className="text-sm font-medium">{formatCurrency(params.purchasePrice)}</span>
            </div>
            <div className="space-y-2">
              <Slider
                id="purchasePrice"
                value={[params.purchasePrice]}
                min={50000}
                max={1000000}
                step={5000}
                onValueChange={(value) => handleChange("purchasePrice", value[0])}
                className="py-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>50 000 €</span>
                <span>1 000 000 €</span>
              </div>
            </div>
          </div>
          
          {/* Frais de notaire */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <label htmlFor="notaryFees" className="input-label">
                Frais de notaire (%)
              </label>
              <span className="text-sm font-medium">{formatPercent(params.notaryFees)}</span>
            </div>
            <Slider
              id="notaryFees"
              value={[params.notaryFees]}
              min={1}
              max={10}
              step={0.1}
              onValueChange={(value) => handleChange("notaryFees", value[0])}
              className="py-1"
            />
          </div>
          
          {/* Apport personnel */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <label htmlFor="downPayment" className="input-label">
                Apport personnel
              </label>
              <span className="text-sm font-medium">{formatCurrency(params.downPayment)}</span>
            </div>
            <div className="space-y-2">
              <Slider
                id="downPayment"
                value={[params.downPayment]}
                min={0}
                max={params.purchasePrice}
                step={5000}
                onValueChange={(value) => handleChange("downPayment", value[0])}
                className="py-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 €</span>
                <span>{formatCurrency(params.purchasePrice)}</span>
              </div>
            </div>
          </div>
          
          {/* Travaux */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <label htmlFor="renovationCosts" className="input-label">
                Budget travaux
              </label>
              <span className="text-sm font-medium">{formatCurrency(params.renovationCosts)}</span>
            </div>
            <div className="space-y-2">
              <Slider
                id="renovationCosts"
                value={[params.renovationCosts]}
                min={0}
                max={200000}
                step={1000}
                onValueChange={(value) => handleChange("renovationCosts", value[0])}
                className="py-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 €</span>
                <span>200 000 €</span>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Financement</h3>
            <p className="text-sm text-muted-foreground">
              Conditions de votre prêt immobilier
            </p>
          </div>
          
          {/* Taux d'intérêt */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <label htmlFor="interestRate" className="input-label">
                Taux d'intérêt
              </label>
              <span className="text-sm font-medium">{formatPercent(params.interestRate)}</span>
            </div>
            <div className="space-y-2">
              <Slider
                id="interestRate"
                value={[params.interestRate]}
                min={0.5}
                max={7}
                step={0.05}
                onValueChange={(value) => handleChange("interestRate", value[0])}
                className="py-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0,5 %</span>
                <span>7 %</span>
              </div>
            </div>
          </div>
          
          {/* Durée du prêt */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <label htmlFor="loanTerm" className="input-label">
                Durée du prêt (années)
              </label>
              <span className="text-sm font-medium">{params.loanTerm} ans</span>
            </div>
            <div className="space-y-2">
              <Slider
                id="loanTerm"
                value={[params.loanTerm]}
                min={5}
                max={30}
                step={1}
                onValueChange={(value) => handleChange("loanTerm", value[0])}
                className="py-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5 ans</span>
                <span>30 ans</span>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Revenus locatifs</h3>
            <p className="text-sm text-muted-foreground">
              Loyers et charges de votre investissement
            </p>
          </div>
          
          {/* Loyer mensuel */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <label htmlFor="monthlyRent" className="input-label">
                Loyer mensuel
              </label>
              <span className="text-sm font-medium">{formatCurrency(params.monthlyRent)}</span>
            </div>
            <div className="space-y-2">
              <Slider
                id="monthlyRent"
                value={[params.monthlyRent]}
                min={300}
                max={5000}
                step={50}
                onValueChange={(value) => handleChange("monthlyRent", value[0])}
                className="py-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>300 €</span>
                <span>5 000 €</span>
              </div>
            </div>
          </div>
          
          {/* Charges non récupérables */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <label htmlFor="monthlyNonRecoverableExpenses" className="input-label">
                Charges mensuelles non récupérables
              </label>
              <span className="text-sm font-medium">{formatCurrency(params.monthlyNonRecoverableExpenses)}</span>
            </div>
            <div className="space-y-2">
              <Slider
                id="monthlyNonRecoverableExpenses"
                value={[params.monthlyNonRecoverableExpenses]}
                min={0}
                max={500}
                step={10}
                onValueChange={(value) => handleChange("monthlyNonRecoverableExpenses", value[0])}
                className="py-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 €</span>
                <span>500 €</span>
              </div>
            </div>
          </div>
          
          {/* Taxe foncière */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <label htmlFor="annualPropertyTax" className="input-label">
                Taxe foncière (annuelle)
              </label>
              <span className="text-sm font-medium">{formatCurrency(params.annualPropertyTax)}</span>
            </div>
            <div className="space-y-2">
              <Slider
                id="annualPropertyTax"
                value={[params.annualPropertyTax]}
                min={0}
                max={5000}
                step={100}
                onValueChange={(value) => handleChange("annualPropertyTax", value[0])}
                className="py-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 €</span>
                <span>5 000 €</span>
              </div>
            </div>
          </div>
          
          {/* Taux de vacance locative */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <label htmlFor="vacancyRate" className="input-label">
                Taux de vacance locative
              </label>
              <span className="text-sm font-medium">{formatPercent(params.vacancyRate)}</span>
            </div>
            <div className="space-y-2">
              <Slider
                id="vacancyRate"
                value={[params.vacancyRate]}
                min={0}
                max={20}
                step={0.5}
                onValueChange={(value) => handleChange("vacancyRate", value[0])}
                className="py-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 %</span>
                <span>20 %</span>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Fiscalité</h3>
            <p className="text-sm text-muted-foreground">
              Régime fiscal et taux d'imposition
            </p>
          </div>
          
          {/* Régime fiscal */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="taxSystem" className="input-label">
                Régime micro-foncier
              </label>
              <p className="text-xs text-muted-foreground">
                Abattement forfaitaire de 30% sur les revenus
              </p>
            </div>
            <Switch
              id="taxSystem"
              checked={params.taxSystem === "micro"}
              onCheckedChange={(checked) => 
                handleChange("taxSystem", checked ? "micro" : "real")
              }
            />
          </div>
          
          {/* Taux marginal d'imposition */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <label htmlFor="taxRate" className="input-label">
                Taux marginal d'imposition
              </label>
              <span className="text-sm font-medium">{formatPercent(params.taxRate)}</span>
            </div>
            <div className="space-y-2">
              <Slider
                id="taxRate"
                value={[params.taxRate]}
                min={0}
                max={45}
                step={1}
                onValueChange={(value) => handleChange("taxRate", value[0])}
                className="py-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 %</span>
                <span>45 %</span>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Nouvelle section pour le taux d'appréciation annuelle */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Projection patrimoniale</h3>
            <p className="text-sm text-muted-foreground">
              Paramètres d'évolution de la valeur du bien
            </p>
          </div>
          
          {/* Taux d'appréciation annuelle */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <label htmlFor="annualAppreciation" className="input-label">
                Taux d'appréciation annuelle du bien
              </label>
              <span className="text-sm font-medium">{formatPercent(params.annualAppreciation || 1.5)}</span>
            </div>
            <div className="space-y-2">
              <Slider
                id="annualAppreciation"
                value={[params.annualAppreciation || 1.5]}
                min={-2}
                max={5}
                step={0.1}
                onValueChange={(value) => handleChange("annualAppreciation", value[0])}
                className="py-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>-2 %</span>
                <span>5 %</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Estimation de l'évolution annuelle moyenne de la valeur du bien sur 20 ans.
            </p>
          </div>
        </div>
      </div>
    </SlideTransition>
  );
};

export default PropertyForm;
