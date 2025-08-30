// Redirect page for CITIZEN collections route  
import { redirect } from 'next/navigation';

export default function CitizenCollectionsRedirect() {
  redirect('/academy/agent/citizen/collections');
}