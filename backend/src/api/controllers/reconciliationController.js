import { runReconciliation } from '../services/reconciliationService.js';

export const triggerReconciliation = async (req, res) => {
  try {
    // Run in the background; don't make the admin wait
    runReconciliation(); 
    res.status(202).json({ message: 'Reconciliation process started.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start reconciliation process.' });
  }
};