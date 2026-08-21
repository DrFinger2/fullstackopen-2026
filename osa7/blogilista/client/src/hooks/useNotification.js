import { useNotificationStore } from '../stores/notificationStore'

export const useNotification = () => {
  return useNotificationStore((state) => state.notification)
}
export const useNotificationActions = () => {
  return useNotificationStore((state) => state.actions)
}
