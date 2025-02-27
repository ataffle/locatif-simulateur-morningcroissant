
// Types for investment parameters
export interface InvestmentParams {
  // Prix d'achat
  purchasePrice: number;
  // Frais de notaire (%)
  notaryFees: number;
  // Apport personnel
  downPayment: number;
  // Travaux
  renovationCosts: number;
  // Loyer mensuel
  monthlyRent: number;
  // Charges non récupérables mensuelles
  monthlyNonRecoverableExpenses: number;
  // Taxe foncière annuelle
  annualPropertyTax: number;
  // Taux d'intérêt (%)
  interestRate: number;
  // Durée du prêt (années)
  loanTerm: number;
  // Taux de vacance locative (%)
  vacancyRate: number;
  // Taux d'impôt marginal (%)
  taxRate: number;
  // Mode d'imposition (réel/forfait)
  taxSystem: 'real' | 'micro';
}

// Types for investment results
export interface InvestmentResults {
  // Montant du prêt
  loanAmount: number;
  // Mensualité du prêt
  monthlyPayment: number;
  // Cash flow mensuel
  monthlyCashFlow: number;
  // Cash flow annuel
  annualCashFlow: number;
  // Rendement brut (%)
  grossYield: number;
  // Rendement net (%)
  netYield: number;
  // Frais de notaire
  actualNotaryFees: number;
  // Prix total (achat + notaire + travaux)
  totalInvestment: number;
  // Effort d'épargne mensuel
  monthlySavingsEffort: number;
  // Rentabilité sur 20 ans
  twentyYearReturn: number;
  // Montant total des loyers sur 20 ans
  twentyYearTotalRent: number;
  // Montant total des charges sur 20 ans
  twentyYearTotalExpenses: number;
  // Revenu net avant impôt sur 20 ans
  twentyYearNetIncome: number;
}

// Calcul de l'amortissement du prêt (tableau d'amortissement simplifié)
export const calculateLoanAmortization = (
  loanAmount: number,
  interestRate: number,
  loanTerm: number
) => {
  // Convertir le taux annuel en taux mensuel
  const monthlyRate = interestRate / 100 / 12;
  // Nombre total de mensualités
  const totalPayments = loanTerm * 12;
  
  // Calcul de la mensualité (formule de l'annuité constante)
  const monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments) / 
                         (Math.pow(1 + monthlyRate, totalPayments) - 1);
  
  // Générer le tableau d'amortissement
  const amortizationSchedule = [];
  let remainingBalance = loanAmount;
  
  for (let month = 1; month <= totalPayments; month++) {
    // Intérêts du mois
    const interestPayment = remainingBalance * monthlyRate;
    // Part d'amortissement du capital
    const principalPayment = monthlyPayment - interestPayment;
    // Nouveau solde restant dû
    remainingBalance -= principalPayment;
    
    amortizationSchedule.push({
      month,
      payment: monthlyPayment,
      principalPayment,
      interestPayment,
      remainingBalance: Math.max(0, remainingBalance)
    });
  }
  
  return {
    monthlyPayment,
    amortizationSchedule
  };
};

// Fonction principale pour calculer tous les résultats de l'investissement
export const calculateInvestmentResults = (params: InvestmentParams): InvestmentResults => {
  // Calcul des frais de notaire
  const actualNotaryFees = (params.purchasePrice * params.notaryFees) / 100;
  
  // Calcul du montant total de l'investissement
  const totalInvestment = params.purchasePrice + actualNotaryFees + params.renovationCosts;
  
  // Calcul du montant du prêt
  const loanAmount = totalInvestment - params.downPayment;
  
  // Calcul des mensualités du prêt
  const { monthlyPayment } = calculateLoanAmortization(
    loanAmount,
    params.interestRate,
    params.loanTerm
  );
  
  // Calcul des revenus locatifs annuels (tenant compte du taux de vacance)
  const annualRent = params.monthlyRent * 12 * (1 - params.vacancyRate / 100);
  
  // Calcul des charges annuelles
  const annualExpenses = 
    (params.monthlyNonRecoverableExpenses * 12) + 
    params.annualPropertyTax;
  
  // Calcul du cash flow mensuel et annuel
  const annualCashFlow = annualRent - annualExpenses - (monthlyPayment * 12);
  const monthlyCashFlow = annualCashFlow / 12;
  
  // Calcul des rendements
  const grossYield = (annualRent / totalInvestment) * 100;
  const netYield = (annualCashFlow / totalInvestment) * 100;
  
  // Calcul de l'effort d'épargne
  const monthlySavingsEffort = monthlyCashFlow < 0 ? Math.abs(monthlyCashFlow) : 0;
  
  // Calcul sur 20 ans (simplifié, sans tenir compte de l'inflation ou de l'évolution des loyers)
  const twentyYearTotalRent = annualRent * 20;
  const twentyYearTotalExpenses = (annualExpenses * 20) + (monthlyPayment * 12 * Math.min(params.loanTerm, 20));
  const twentyYearNetIncome = twentyYearTotalRent - twentyYearTotalExpenses;
  const twentyYearReturn = (twentyYearNetIncome / totalInvestment) * 100;
  
  return {
    loanAmount,
    monthlyPayment,
    monthlyCashFlow,
    annualCashFlow,
    grossYield,
    netYield,
    actualNotaryFees,
    totalInvestment,
    monthlySavingsEffort,
    twentyYearReturn,
    twentyYearTotalRent,
    twentyYearTotalExpenses,
    twentyYearNetIncome
  };
};

// Formatter pour les montants en euros
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Formatter pour les pourcentages
export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};
