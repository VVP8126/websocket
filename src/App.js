import WebSocket from './WebSocket';
import './styles/styles.css';

function App() {
  return (
    <div>
      <h1 className='centered'>CHAT</h1>
      <h3 className='centered margined'>WebSocket approach used</h3>
      <WebSocket />
    </div>
  );
}
export default App;
