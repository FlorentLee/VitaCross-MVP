import { create } from 'zustand';
import { LedgerItem } from '@/components/screens/DashboardScreen';

interface LedgerState {
    ledgerItems: LedgerItem[];
    setLedgerItems: (items: LedgerItem[]) => void;
    fetchLedger: () => Promise<void>;
}

import { getLedger } from '@/lib/api';

export const useLedgerStore = create<LedgerState>((set) => ({
    ledgerItems: [],
    setLedgerItems: (items) => set({ ledgerItems: items }),
    fetchLedger: async () => {
        try {
            const response = await getLedger();
            const items = response.items || response || [];
            set({ ledgerItems: items });
        } catch (error) {
            console.error("Failed to fetch ledger:", error);
            set({ ledgerItems: [] });
        }
    },
}));
