import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import service from '../services/anecdoteService'
import useNotification from './useNotification'

export const useAnecdotes = () => {
    const client = useQueryClient()
    const { setNotification } = useNotification()

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
            client.setQueryData( ['anecdotes'], anecdotes.concat(newAnecdote))
            setNotification(`anecdote '${newAnecdote.content}' created`)
        },
        onError: (error) => {
            setNotification(error.response.data.error, 'error')
        }
    })

    const updateVoteMutation = useMutation({
        mutationFn: ({id, content}) => service.update(id, content),
        onSuccess: (updatedAnecdote) => {
            client.invalidateQueries({ queryKey: ['anecdotes'] })
            setNotification(`anecdote '${updatedAnecdote.content}' voted`)
        },
        onError: (error) => {
            setNotification(error.response.data.error, 'error')
        }
    })

    const removeMutation = useMutation({
        mutationFn: (id) => service.remove(id),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['anecdotes'] })
            setNotification(`anecdote was removed`)
        },
        onError: (error) => {
            setNotification(error.response.data.error, 'error')
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
        return updateVoteMutation.mutate({
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