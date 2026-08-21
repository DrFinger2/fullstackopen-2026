import { create } from 'zustand'

export const useNotificationStore = create((set) => ({
  notification: {
    message: '',
    type: '',
    id: 0,
  },
  actions: {
    success: (message) =>
      set((state) => ({
        notification: {
          message: message || 'Operation completed successfully',
          type: 'success',
          id: state.notification.id + 1,
        },
      })),
    error: (message) =>
      set((state) => ({
        notification: {
          message: message || 'Unknown error',
          type: 'error',
          id: state.notification.id + 1,
        },
      })),
  },
}))
