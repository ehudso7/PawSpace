import * as Sentry from 'sentry-expo';

export function reportError(error: unknown, extra?: Record<string, any>) {
  const err = error instanceof Error ? error : new Error(String(error));
  if (extra) {
    Sentry.Native.captureException(err, { extra });
  } else {
    Sentry.Native.captureException(err);
  }
}
