import { create } from 'zustand'

export const useNotificationStore = () =>
  create((set) => ({
    notification: {
      message: '',
      type: '',
      id: 0,
    },
    actions: {
      success: (message) =>
        set((state) => ({
          message: message || 'Operation completed successfully',
          type: 'success',
          id: state.id + 1,
        })),
      error: (message) =>
        set((state) => ({
          message: message || 'Unknown error',
          type: 'error',
          id: state.id + 1,
        })),
    },
  }))
