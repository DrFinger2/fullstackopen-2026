import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import service from '../services/anecdoteService'

export const useAnecdotes = () => {
    const client = useQueryClient()

    // mutations and queries
    const getQuery = useQuery({
        queryKey: ['anecdotes'],
        queryFn: service.getAll,
        refetchOnWindowFocus: false,
        retry: 1
    })

    const addMutation = useMutation({
        mutationFn: (content) => service.create(content),
        onSuccess: (newAnecdote) => {
            const anecdotes = client.getQueryData(['anecdotes']) ||[]
            client.setQueryData(
                ['anecdotes'], anecdotes.concat(newAnecdote)
            )
        }
    })

    const updateMutation = useMutation({
        mutationFn:({id, content}) => service.update(id, content),
        onSuccess: () => {
            client.invalidateQueries(
                { queryKey: ['anecdotes'] }
            )
        }
    })

    const removeMutation = useMutation({
        mutationFn: (id) => service.remove(id),
        onSuccess: () => {
            client.invalidateQueries(
                { queryKey: ['anecdotes'] }
            )
        }
    })

    // functions
    const addFunction = (content) => {
        return addMutation.mutate({
            content: content, votes: 0
        })
    }
    const removeFunction = (id) => {
        return removeMutation.mutate(id)
    }
    const voteFunction = (id) => {
        const data = getQuery.data.find(anecdote => anecdote.id === id)
        if(!data) return
        return updateMutation.mutate({
            id: id,
            content: { ...data, votes: data.votes + 1 }
        })
    }

    return {
        anecdotes: getQuery.data,
        isPending: getQuery.isPending,
        isError: getQuery.isError,

        add: addFunction,
        remove: removeFunction,
        vote: voteFunction,
    }
}