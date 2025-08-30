// Redirect page for CITIZEN treasury route
import { redirect } from 'next/navigation';

export default function CitizenTreasuryRedirect() {
  redirect('/academy/agent/citizen/treasury');
}