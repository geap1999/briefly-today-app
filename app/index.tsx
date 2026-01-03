import ConsentHandler from '@/components/consent-handler';
import HomeScreen from './home-screen';

export default function App() {
  return (
    <ConsentHandler>
      <HomeScreen />
    </ConsentHandler>
  );
}
