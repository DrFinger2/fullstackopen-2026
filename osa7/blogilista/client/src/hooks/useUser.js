import useUserStore from '../stores/userStore'

export const useUser = () => {
  return useUserStore((state) => state.username)
}
export const useUserActions = () => {
  return useUserStore((state) => state.actions)
}
