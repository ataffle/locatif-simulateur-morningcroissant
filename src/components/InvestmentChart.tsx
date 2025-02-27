
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { InvestmentParams, InvestmentResults, calculateLoanAmortization, formatCurrency } from "@/utils/calculators";
import SlideTransition from "./SlideTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface InvestmentChartProps {
  params: InvestmentParams;
  results: InvestmentResults;
}

const COLORS = ["#a8a29e", "#292524", "#d6d3d1", "#57534e", "#78716c"];

// Composant de tooltip personnalisé pour les graphiques
const CustomTooltip = ({ active, payload, label, prefix = "", suffix = "" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-2 border border-border rounded-md shadow-sm text-xs">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} style={{ color: item.color }}>
            {item.name}: {prefix}{item.value.toLocaleString("fr-FR")}{suffix}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const InvestmentChart = ({ params, results }: InvestmentChartProps) => {
  const isMobile = useIsMobile();
  
  // Données pour le graphique de répartition des coûts
  const costBreakdownData = useMemo(() => [
    { name: "Prix d'achat", value: params.purchasePrice },
    { name: "Frais de notaire", value: results.actualNotaryFees },
    { name: "Travaux", value: params.renovationCosts },
  ], [params, results]);
  
  // Données pour le graphique de cash flow sur 10 ans
  const cashFlowData = useMemo(() => {
    const years = 10;
    const data = [];
    
    for (let i = 1; i <= years; i++) {
      data.push({
        year: `Année ${i}`,
        "Revenus locatifs": Math.round(params.monthlyRent * 12 * (1 - params.vacancyRate / 100)),
        "Charges": Math.round(params.monthlyNonRecoverableExpenses * 12 + params.annualPropertyTax),
        "Remboursement prêt": Math.round(results.monthlyPayment * 12),
        "Cash flow": Math.round(results.annualCashFlow),
      });
    }
    
    return data;
  }, [params, results]);
  
  // Données pour le graphique d'amortissement du prêt
  const loanAmortizationData = useMemo(() => {
    const { amortizationSchedule } = calculateLoanAmortization(
      results.loanAmount,
      params.interestRate,
      params.loanTerm
    );
    
    // Regrouper par année pour avoir un graphique plus lisible
    const yearlyData = [];
    const yearsToShow = Math.min(params.loanTerm, 20); // Limiter à 20 ans max pour la lisibilité
    
    for (let year = 1; year <= yearsToShow; year++) {
      const startMonth = (year - 1) * 12;
      const yearInterest = amortizationSchedule
        .slice(startMonth, startMonth + 12)
        .reduce((sum, month) => sum + month.interestPayment, 0);
      
      const yearPrincipal = amortizationSchedule
        .slice(startMonth, startMonth + 12)
        .reduce((sum, month) => sum + month.principalPayment, 0);
      
      yearlyData.push({
        year: `A${year}`,
        "Intérêts": Math.round(yearInterest),
        "Capital": Math.round(yearPrincipal),
        "Mensualité totale": Math.round(yearInterest + yearPrincipal),
      });
    }
    
    return yearlyData;
  }, [params, results]);
  
  // Données pour le graphique de rendement sur 20 ans
  const returnOnInvestmentData = useMemo(() => {
    const initialInvestment = params.downPayment;
    const monthlyPayment = results.monthlyPayment;
    const monthlyCashFlow = results.monthlyCashFlow;
    
    const data = [];
    const years = 20;
    
    let cumulativeInvestment = initialInvestment;
    let cumulativeCashFlow = 0;
    
    for (let year = 0; year <= years; year++) {
      if (year === 0) {
        data.push({
          year: 0,
          "Investissement cumulé": Math.round(cumulativeInvestment),
          "Revenus cumulés": 0,
        });
      } else {
        // Ajouter les mensualités payées pendant l'année (si le prêt est encore en cours)
        if (year <= params.loanTerm) {
          cumulativeInvestment += monthlyPayment * 12 * (monthlyCashFlow < 0 ? 1 : 0);
        }
        
        // Ajouter les cash flows de l'année
        cumulativeCashFlow += Math.max(0, monthlyCashFlow) * 12;
        
        data.push({
          year,
          "Investissement cumulé": Math.round(cumulativeInvestment),
          "Revenus cumulés": Math.round(cumulativeCashFlow),
        });
      }
    }
    
    return data;
  }, [params, results]);

  return (
    <SlideTransition delay={200} className="bg-card rounded-xl p-6 card-shadow h-full">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Analyse graphique</h3>
          <p className="text-sm text-muted-foreground">
            Visualisation des données clés de votre investissement
          </p>
        </div>
        
        <Tabs defaultValue="costs" className="w-full">
          <TabsList className={cn("grid w-full", isMobile ? "grid-cols-2 gap-2" : "grid-cols-4")}>
            <TabsTrigger value="costs">Coûts</TabsTrigger>
            <TabsTrigger value="cashflow">Cash flow</TabsTrigger>
            <TabsTrigger value="loan">Prêt</TabsTrigger>
            <TabsTrigger value="return">Rendement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="costs" className="mt-4 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={!isMobile}
                  outerRadius={isMobile ? 100 : 130}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => 
                    !isMobile && `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  content={<CustomTooltip prefix="" suffix=" €" />} 
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend
                  layout={isMobile ? "horizontal" : "vertical"}
                  verticalAlign={isMobile ? "bottom" : "middle"}
                  align={isMobile ? "center" : "right"}
                  wrapperStyle={isMobile ? { bottom: 0 } : { right: 0 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="cashflow" className="mt-4 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  interval={isMobile ? 2 : 0}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip prefix="" suffix=" €" />} />
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                <Bar name="Revenus locatifs" dataKey="Revenus locatifs" fill={COLORS[1]} />
                <Bar name="Charges" dataKey="Charges" fill={COLORS[0]} />
                <Bar name="Remboursement prêt" dataKey="Remboursement prêt" fill={COLORS[2]} />
                <Bar name="Cash flow" dataKey="Cash flow" fill={COLORS[3]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="loan" className="mt-4 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loanAmortizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip prefix="" suffix=" €" />} />
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                <Bar name="Intérêts" dataKey="Intérêts" stackId="a" fill={COLORS[0]} />
                <Bar name="Capital" dataKey="Capital" stackId="a" fill={COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="return" className="mt-4 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={returnOnInvestmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip prefix="" suffix=" €" />} />
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                <Line 
                  type="monotone" 
                  name="Investissement cumulé" 
                  dataKey="Investissement cumulé" 
                  stroke={COLORS[0]} 
                  strokeWidth={2}
                  dot={{ r: 1 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  name="Revenus cumulés" 
                  dataKey="Revenus cumulés" 
                  stroke={COLORS[1]} 
                  strokeWidth={2}
                  dot={{ r: 1 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </div>
    </SlideTransition>
  );
};

export default InvestmentChart;
