import { create } from 'zustand'

// just to keep it as a number
const toFixedNumber = (num, decimals) => {
  const factor = 10 ** decimals;
  return Math.round((num + Number.EPSILON) * factor) / factor;
};

const updateFeedback = (feedback, changes) => {
  const updated = { ...feedback, ...changes };
  updated.all = updated.good + updated.neutral + updated.bad;
  updated.average = updated.all === 0 ? 0 : toFixedNumber((updated.good - updated.bad) / updated.all, 1)
  updated.positive = updated.all === 0 ? 0 : toFixedNumber((updated.good / updated.all) * 100, 1);
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