import { Routes, Route } from 'react-router-dom';
import { Board } from './components/Board/Board';
import { DemoPanel } from './components/DemoPanel/DemoPanel';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Board />} />
      <Route path="/demo" element={<Board demo />} />
    </Routes>
  );
}
