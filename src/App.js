import './App.css';
import Router from './components/routes/routes';
import { Navigation } from './components/navigation';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Router />
    </div>
  );
}

export default App;
