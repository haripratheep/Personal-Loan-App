import { Loan, EMIScheduleItem, SimulationInput, SimulationResult } from '../context/LoanContext';

// Mock data
const mockLoans: Loan[] = [
  {
    id: '1',
    type: 'Personal Loan',
    bank: 'HDFC Bank',
    amount: 180000,
    currentBalance: 166658,
    emi: 8329,
    interestRate: 10.5,
    nextDueDate: '2025-01-21',
    status: 'active',
    progress: 18,
  },
  {
    id: '2',
    type: 'Home Loan',
    bank: 'SBI Bank',
    amount: 2500000,
    currentBalance: 2245000,
    emi: 25000,
    interestRate: 8.5,
    nextDueDate: '2025-01-15',
    status: 'active',
    progress: 12,
  },
];

const mockEMISchedule: EMIScheduleItem[] = [
  {
    id: 1,
    month: 'Jan 2025',
    dueDate: '2025-01-21',
    emi: 8329,
    principal: 7754,
    interest: 575,
    balance: 158904,
    status: 'upcoming',
  },
  {
    id: 2,
    month: 'Feb 2025',
    dueDate: '2025-02-21',
    emi: 8329,
    principal: 7822,
    interest: 507,
    balance: 151082,
    status: 'upcoming',
  },
  {
    id: 3,
    month: 'Mar 2025',
    dueDate: '2025-03-21',
    emi: 8329,
    principal: 7890,
    interest: 439,
    balance: 143192,
    status: 'upcoming',
  },
  {
    id: 4,
    month: 'Apr 2025',
    dueDate: '2025-04-21',
    emi: 8329,
    principal: 7959,
    interest: 370,
    balance: 135233,
    status: 'upcoming',
  },
  {
    id: 5,
    month: 'May 2025',
    dueDate: '2025-05-21',
    emi: 8329,
    principal: 8029,
    interest: 300,
    balance: 127204,
    status: 'upcoming',
  },
];

export const mockApi = {
  // Authentication
  async authenticateUser(pin: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return pin === '1234' || pin === '0000';
  },

  // Loans
  async getLoans(): Promise<Loan[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockLoans;
  },

  async getLoanById(id: string): Promise<Loan | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLoans.find(loan => loan.id === id) || null;
  },

  // EMI Schedule
  async getEMISchedule(loanId: string): Promise<EMIScheduleItem[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockEMISchedule;
  },

  // Simulation
  async simulateLoan(input: SimulationInput): Promise<SimulationResult> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const baseInterest = 4000;
    const extraPayment = input.extraPayment;
    const paymentDelay = input.paymentDelay;
    
    // Calculate interest impact
    let interestSaved = 0;
    let termReduction = 0;
    let newTotalInterest = baseInterest;
    let warningMessage = '';
    
    if (extraPayment > 0) {
      interestSaved = Math.floor(extraPayment * 0.8);
      termReduction = Math.floor(extraPayment / 1000);
      newTotalInterest = baseInterest - interestSaved;
    }
    
    if (paymentDelay > 0) {
      const delayPenalty = Math.floor(paymentDelay * 50);
      newTotalInterest += delayPenalty;
      interestSaved = Math.max(0, interestSaved - delayPenalty);
      
      if (paymentDelay > 15) {
        warningMessage = `⚠️ Interest escalation by ₹${delayPenalty.toLocaleString('en-IN')} if you delay by ${paymentDelay} days`;
      }
    }
    
    return {
      interestSaved: Math.max(0, interestSaved),
      termReduction: Math.max(0, termReduction),
      newTotalInterest: Math.max(0, newTotalInterest),
      warningMessage,
    };
  },

  // Update loan plan
  async updateLoanPlan(loanId: string, simulationResult: SimulationResult): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, this would update the backend
    console.log('Updating loan plan:', loanId, simulationResult);
  },
};