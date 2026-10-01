// "Simulate offline" from the session menu. Every request checks this first.
let online = true;

export function setSimulatedOnline(value: boolean): void {
  online = value;
}

export function isOnline(): boolean {
  return online;
}

export class OfflineError extends Error {
  constructor() {
    super('You are offline');
  }
}
