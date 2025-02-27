
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InvestmentResults, formatCurrency, formatPercent } from "@/utils/calculators";
import SlideTransition from "./SlideTransition";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";

interface ResultsSectionProps {
  results: InvestmentResults;
}

type ResultCardProps = {
  title: string;
  value: string;
  label?: string;
  variant?: "default" | "success" | "caution" | "danger";
  className?: string;
  tooltip?: string;
};

const ResultCard = ({ title, value, label, variant = "default", className, tooltip }: ResultCardProps) => {
  let badgeVariant = "bg-accent text-accent-foreground";
  
  if (variant === "success") {
    badgeVariant = "bg-green-100 text-green-800";
  } else if (variant === "caution") {
    badgeVariant = "bg-amber-100 text-amber-800";
  } else if (variant === "danger") {
    badgeVariant = "bg-red-100 text-red-800";
  }
  
  return (
    <div className={cn("p-4 rounded-lg border border-border", className)}>
      <div className="flex flex-col space-y-1">
        <div className="flex items-center gap-1">
          <div className="text-sm text-muted-foreground">{title}</div>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-80">
                  <p className="text-sm">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="text-2xl font-semibold">{value}</div>
        {label && <Badge className={cn("chip mt-2 self-start", badgeVariant)}>{label}</Badge>}
      </div>
    </div>
  );
};

const ResultsSection = ({ results }: ResultsSectionProps) => {
  const isMobile = useIsMobile();
  
  // Détermine les labels en fonction des résultats
  const getRentabilityLabel = (yield_: number) => {
    if (yield_ >= 6) return "Excellente";
    if (yield_ >= 4) return "Bonne";
    if (yield_ >= 2) return "Moyenne";
    return "Faible";
  };
  
  const getCashFlowLabel = (cashFlow: number) => {
    if (cashFlow >= 300) return "Excellent";
    if (cashFlow >= 100) return "Bon";
    if (cashFlow >= 0) return "Équilibré";
    return "Négatif";
  };
  
  const getPatrimonialReturnLabel = (return_: number) => {
    if (return_ >= 500) return "Exceptionnel";
    if (return_ >= 300) return "Excellent";
    if (return_ >= 200) return "Très bon";
    if (return_ >= 100) return "Bon";
    return "Moyen";
  };
  
  // Détermine les variantes des cartes en fonction des résultats
  const getYieldVariant = (yield_: number): ResultCardProps["variant"] => {
    if (yield_ >= 6) return "success";
    if (yield_ >= 4) return "default";
    if (yield_ >= 2) return "caution";
    return "danger";
  };
  
  const getCashFlowVariant = (cashFlow: number): ResultCardProps["variant"] => {
    if (cashFlow >= 300) return "success";
    if (cashFlow >= 100) return "default";
    if (cashFlow >= 0) return "caution";
    return "danger";
  };
  
  const getPatrimonialReturnVariant = (return_: number): ResultCardProps["variant"] => {
    if (return_ >= 300) return "success";
    if (return_ >= 100) return "default";
    if (return_ >= 50) return "caution";
    return "danger";
  };

  return (
    <SlideTransition delay={150} className="bg-card rounded-xl p-6 card-shadow">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Résultats de l'investissement</h3>
          <p className="text-sm text-muted-foreground">
            Indicateurs clés de performance et flux financiers
          </p>
        </div>
        
        <Separator />
        
        <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-2 xl:grid-cols-4")}>
          <ResultCard
            title="Rendement brut"
            value={formatPercent(results.grossYield)}
            label={getRentabilityLabel(results.grossYield)}
            variant={getYieldVariant(results.grossYield)}
            tooltip="Loyers annuels divisés par l'investissement total"
          />
          
          <ResultCard
            title="Rendement net"
            value={formatPercent(results.netYield)}
            label={getRentabilityLabel(results.netYield)}
            variant={getYieldVariant(results.netYield)}
            tooltip="Cash-flow annuel divisé par l'investissement total"
          />
          
          <ResultCard
            title="Cash-flow mensuel"
            value={formatCurrency(results.monthlyCashFlow)}
            label={getCashFlowLabel(results.monthlyCashFlow)}
            variant={getCashFlowVariant(results.monthlyCashFlow)}
            tooltip="Loyers - charges - mensualité du crédit"
          />
          
          <ResultCard
            title="Cash-flow annuel"
            value={formatCurrency(results.annualCashFlow)}
            label={getCashFlowLabel(results.monthlyCashFlow)}
            variant={getCashFlowVariant(results.monthlyCashFlow)}
            tooltip="Cash-flow mensuel × 12"
          />
        </div>
        
        <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-2")}>
          <div className="space-y-4">
            <h4 className="text-md font-medium">Financement</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Investissement total</span>
                <span className="font-medium">{formatCurrency(results.totalInvestment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Montant du prêt</span>
                <span className="font-medium">{formatCurrency(results.loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Mensualité du prêt</span>
                <span className="font-medium">{formatCurrency(results.monthlyPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Effort d'épargne mensuel</span>
                <span className="font-medium">{formatCurrency(results.monthlySavingsEffort)}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-md font-medium">Performance sur 20 ans</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Loyers perçus</span>
                <span className="font-medium">{formatCurrency(results.twentyYearTotalRent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Charges totales</span>
                <span className="font-medium">{formatCurrency(results.twentyYearTotalExpenses)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Revenus nets</span>
                <span className="font-medium">{formatCurrency(results.twentyYearNetIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Rentabilité globale</span>
                <span className="font-medium">{formatPercent(results.twentyYearReturn)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section Patrimoine */}
        <div className="mt-6">
          <h4 className="text-md font-medium mb-4">Patrimoine après 20 ans</h4>
          <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-2 xl:grid-cols-4")}>
            <ResultCard
              title="Valeur du bien"
              value={formatCurrency(results.propertyValueAfter20Years)}
              tooltip="Valeur future calculée avec le taux d'appréciation annuel sur 20 ans"
            />
            
            <ResultCard
              title="Capital restant dû"
              value={formatCurrency(results.remainingLoanAfter20Years)}
              tooltip="Montant restant à rembourser sur le prêt après 20 ans"
            />
            
            <ResultCard
              title="Valorisation nette"
              value={formatCurrency(results.netEquityAfter20Years)}
              tooltip="Valeur du bien moins le capital restant dû"
            />
            
            <ResultCard
              title="Rendement patrimonial"
              value={formatPercent(results.totalPatrimonialReturn)}
              label={getPatrimonialReturnLabel(results.totalPatrimonialReturn)}
              variant={getPatrimonialReturnVariant(results.totalPatrimonialReturn)}
              tooltip="((Valorisation nette - Apport initial + Revenus nets sur 20 ans) / Apport initial) × 100. Ce rendement représente la performance globale de votre investissement, incluant à la fois les revenus locatifs et la plus-value immobilière."
            />
          </div>
        </div>
      </div>
    </SlideTransition>
  );
};

export default ResultsSection;
