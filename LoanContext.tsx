import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Loan {
  id: string;
  type: string;
  bank: string;
  amount: number;
  currentBalance: number;
  emi: number;
  interestRate: number;
  nextDueDate: string;
  status: 'active' | 'closed' | 'overdue';
  progress: number;
}

export interface EMIScheduleItem {
  id: number;
  month: string;
  dueDate: string;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
  status: 'paid' | 'upcoming' | 'updated';
}

export interface SimulationInput {
  extraPayment: number;
  paymentDelay: number;
}

export interface SimulationResult {
  interestSaved: number;
  termReduction: number;
  newTotalInterest: number;
  warningMessage?: string;
}

export interface ReminderSettings {
  beforeDueDate: boolean;
  onDueDate: boolean;
  afterDueDate: boolean;
  weeklyOverview: boolean;
  reminderTime: string;
}

interface LoanState {
  isAuthenticated: boolean;
  loans: Loan[];
  currentLoan: Loan | null;
  emiSchedule: EMIScheduleItem[];
  simulationInput: SimulationInput;
  simulationResult: SimulationResult | null;
  reminderSettings: ReminderSettings;
}

type LoanAction =
  | { type: 'AUTHENTICATE'; payload: boolean }
  | { type: 'SET_LOANS'; payload: Loan[] }
  | { type: 'SET_CURRENT_LOAN'; payload: Loan }
  | { type: 'SET_EMI_SCHEDULE'; payload: EMIScheduleItem[] }
  | { type: 'UPDATE_SIMULATION_INPUT'; payload: Partial<SimulationInput> }
  | { type: 'SET_SIMULATION_RESULT'; payload: SimulationResult }
  | { type: 'APPLY_SIMULATION_TO_PLAN' }
  | { type: 'UPDATE_REMINDER_SETTINGS'; payload: Partial<ReminderSettings> };

const initialState: LoanState = {
  isAuthenticated: false,
  loans: [],
  currentLoan: null,
  emiSchedule: [],
  simulationInput: {
    extraPayment: 0,
    paymentDelay: 0,
  },
  simulationResult: null,
  reminderSettings: {
    beforeDueDate: true,
    onDueDate: true,
    afterDueDate: false,
    weeklyOverview: false,
    reminderTime: '09:00',
  },
};

function loanReducer(state: LoanState, action: LoanAction): LoanState {
  switch (action.type) {
    case 'AUTHENTICATE':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_LOANS':
      return { ...state, loans: action.payload };
    case 'SET_CURRENT_LOAN':
      return { ...state, currentLoan: action.payload };
    case 'SET_EMI_SCHEDULE':
      return { ...state, emiSchedule: action.payload };
    case 'UPDATE_SIMULATION_INPUT':
      return {
        ...state,
        simulationInput: { ...state.simulationInput, ...action.payload },
      };
    case 'SET_SIMULATION_RESULT':
      return { ...state, simulationResult: action.payload };
    case 'APPLY_SIMULATION_TO_PLAN':
      return {
        ...state,
        emiSchedule: state.emiSchedule.map((item) =>
          item.status === 'upcoming' ? { ...item, status: 'updated' as const } : item
        ),
      };
    case 'UPDATE_REMINDER_SETTINGS':
      return {
        ...state,
        reminderSettings: { ...state.reminderSettings, ...action.payload },
      };
    default:
      return state;
  }
}

const LoanContext = createContext<{
  state: LoanState;
  dispatch: React.Dispatch<LoanAction>;
} | undefined>(undefined);

export const LoanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(loanReducer, initialState);

  return (
    <LoanContext.Provider value={{ state, dispatch }}>
      {children}
    </LoanContext.Provider>
  );
};

export const useLoan = () => {
  const context = useContext(LoanContext);
  if (context === undefined) {
    throw new Error('useLoan must be used within a LoanProvider');
  }
  return context;
};