
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import PropertyForm from "@/components/PropertyForm";
import ResultsSection from "@/components/ResultsSection";
import InvestmentChart from "@/components/InvestmentChart";
import { 
  InvestmentParams, 
  InvestmentResults, 
  calculateInvestmentResults 
} from "@/utils/calculators";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const defaultParams: InvestmentParams = {
  purchasePrice: 200000,
  notaryFees: 7.5,
  downPayment: 40000,
  renovationCosts: 15000,
  monthlyRent: 800,
  monthlyNonRecoverableExpenses: 50,
  annualPropertyTax: 1200,
  interestRate: 3.5,
  loanTerm: 20,
  vacancyRate: 5,
  taxRate: 30,
  taxSystem: "real",
};

const Index = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [params, setParams] = useState<InvestmentParams>(defaultParams);
  const [results, setResults] = useState<InvestmentResults>(() => 
    calculateInvestmentResults(defaultParams)
  );

  // Recalculer les résultats lorsque les paramètres changent
  useEffect(() => {
    const newResults = calculateInvestmentResults(params);
    setResults(newResults);
  }, [params]);

  // Notification du premier chargement
  useEffect(() => {
    toast({
      title: "Bienvenue dans le simulateur d'investissement locatif",
      description: "Modifiez les paramètres pour voir les résultats en temps réel.",
      duration: 5000,
    });
  }, [toast]);

  const handleParamsChange = (newParams: InvestmentParams) => {
    setParams(newParams);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        <Header />
        
        <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : "lg:grid-cols-2")}>
          <PropertyForm params={params} onChange={handleParamsChange} />
          <ResultsSection results={results} />
        </div>
        
        <div className="mt-6">
          <InvestmentChart params={params} results={results} />
        </div>
      </div>
    </div>
  );
};

export default Index;
