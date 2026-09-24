import { activeAlerts } from '../mock/database';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let alertsState = [...activeAlerts];

export const alertApi = {
  getAlerts: async () => {
    await sleep(250);
    return [...alertsState];
  },

  createAlert: async (symbol, condition) => {
    await sleep(300);
    if (!symbol || !condition) throw new Error('Symbol and condition are required');
    const newAlert = {
      id: Date.now(),
      stock: symbol.toUpperCase(),
      condition: condition,
      status: 'Active',
      created: new Date().toLocaleString([], { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    alertsState.unshift(newAlert);
    return [...alertsState];
  },

  toggleAlertStatus: async (id) => {
    await sleep(200);
    alertsState = alertsState.map(alert => {
      if (alert.id === id) {
        const nextStatus = alert.status === 'Active' ? 'Paused' : 'Active';
        return { ...alert, status: nextStatus };
      }
      return alert;
    });
    return [...alertsState];
  },

  deleteAlert: async (id) => {
    await sleep(200);
    alertsState = alertsState.filter(alert => alert.id !== id);
    return [...alertsState];
  }
};
