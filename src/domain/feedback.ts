import type { DislikeReason, Feedback } from './message';

/** Choosing the current rating again clears it. A fresh dislike starts with no reasons. */
export function applyRating(current: Feedback | undefined, rating: Feedback['rating']): Feedback | undefined {
  if (current?.rating === rating) {
    return undefined;
  }
  return rating === 'like' ? { rating: 'like' } : { rating: 'dislike', reasons: [] };
}

/** Reasons only exist on a dislike; anything else is returned unchanged. */
export function toggleReason(current: Feedback | undefined, reason: DislikeReason): Feedback | undefined {
  if (current?.rating !== 'dislike') {
    return current;
  }
  const { reasons } = current;
  const next = reasons.includes(reason) ? reasons.filter((item) => item !== reason) : [...reasons, reason];
  return { rating: 'dislike', reasons: next };
}
