// Email notification stubs for build compatibility
export const sendCovenantNotification = async (params: any) => {
  console.log('Email notification disabled:', params);
  return { success: true };
};

export const sendBatchNotifications = async (notifications: any[]) => {
  console.log('Batch notifications disabled:', notifications.length);
  return { success: true, sent: notifications.length };
};

export default {
  sendCovenantNotification,
  sendBatchNotifications,
};