import useUserStore from '../stores/userStore'

export const useUser = () => useUserStore((state) => state.username)
export const useUserActions = () => useUserStore((state) => state.actions)
