/** A slot the user booked with the human astrologer from a consultation card. */
export type ConsultationBooking = {
  /** What the call is about, e.g. "Career and Saturn". */
  focus: string;
  minutes: number;
  /** Epoch ms of the slot start. */
  startsAt: number;
};

const SLOT_MINUTES = 30;
const OPENS_AT = 9;
const LAST_START = 20.5;

/** True for slot starts within the astrologer's working hours (9:00 to 20:30). */
function isWorkingHour(time: number): boolean {
  const date = new Date(time);
  const hour = date.getHours() + date.getMinutes() / 60;
  return hour >= OPENS_AT && hour <= LAST_START;
}

/** The next few half-hour slots in working hours, at least an hour from now. Computed, never hard-coded. */
export function upcomingSlots(now = Date.now(), count = 6): number[] {
  const step = SLOT_MINUTES * 60_000;
  const slots: number[] = [];
  for (let time = Math.ceil((now + 60 * 60_000) / step) * step; slots.length < count; time += step) {
    if (isWorkingHour(time)) {
      slots.push(time);
    }
  }
  return slots;
}

export function slotLabel(time: number, now = Date.now()): string {
  const date = new Date(time);
  const sameDay = date.toDateString() === new Date(now).toDateString();
  const clock = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return sameDay ? `Today, ${clock}` : `${date.toLocaleDateString(undefined, { weekday: 'short' })}, ${clock}`;
}
