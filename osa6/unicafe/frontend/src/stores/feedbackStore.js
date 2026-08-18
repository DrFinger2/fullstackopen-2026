import { create } from 'zustand'

const updateFeedback = (feedback, changes) => {
  const updated = { ...feedback, ...changes };
  updated.all = feedback.good + feedback.neutral + feedback.bad;
  updated.average = updated.all === 0 ? 0 : ((feedback.good - feedback.bad) / updated.all).toFixed(1);
  updated.positive = updated.all === 0 ? 0 : ((feedback.good / updated.all) * 100).toFixed(1);

  return { feedback: updated };
};

export const useFeedbackStore = create(set => ({
  feedback:{
    good: 0,
    bad: 0,
    neutral: 0,
    all: 0,
    average: 0,
    positive: 0,
  },

  actions: {
    incrementGood:    () => set(state => updateFeedback(state.feedback, { good: state.feedback.good + 1 }) ),
    incrementNeutral: () => set(state => updateFeedback(state.feedback, { neutral: state.feedback.neutral + 1 })),
    incrementBad:     () => set(state => updateFeedback(state.feedback, { bad: state.feedback.bad + 1 })),
  }
}));


export const useFeedback = () => useFeedbackStore(state => (
  state.feedback
));

export const useFeedbackControls = () => useFeedbackStore(state => (
  state.actions
));