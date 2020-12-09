import { Configuration } from './interfaces';

declare const interactionTracker : {
  initialize:(configuration: Configuration) => void
}

export * from './interfaces';
export default interactionTracker
