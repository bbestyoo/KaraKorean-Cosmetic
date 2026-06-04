import { Suspense } from 'react';
import CallbackPage from './CallbackContext';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackPage />
    </Suspense>
  );
}