import useUserStore from '../stores/userStore'

export const useUser = () => {
  return useUserStore((state) => state.username)
}
export const useUsers = () => {
  return useUserStore((state) => state.users)
}
export const useUserActions = () => {
  return useUserStore((state) => state.actions)
}
