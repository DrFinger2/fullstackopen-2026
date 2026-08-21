import useBlogStore from '../stores/blogStore'

export const useBlogs = () => useBlogStore((state) => state.blogs)
export const useBlogsLoading = () => useBlogStore((state) => state.loading)
export const useBlogActions = () => useBlogStore((state) => state.actions)
