import { Metadata } from 'next';
import HomePage from './home-page';

export const metadata: Metadata = {
  title: 'ConSERVERtive VPN - Combatting Censorship Worldwide',
  description: 'ConSERVERtive VPN provides secure, private internet access while fighting censorship globally. Pay for one account, sponsor a free user in a censored country.',
};

export default function Page() {
  return <HomePage />;
}
