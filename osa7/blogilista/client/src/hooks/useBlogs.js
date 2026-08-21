import useBlogStore from '../stores/blogStore'

export const useBlogs = () => {
  return useBlogStore((state) => state.blogs)
}
export const useBlogsLoading = () => {
  return useBlogStore((state) => state.loading)
}
export const useBlogActions = () => {
  return useBlogStore((state) => state.actions)
}
