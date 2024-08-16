'use client';
import LineGraph from '@/components/LineGraph';
import CurrentRoundTable from '@/components/CurrentRoundTable';
import Slider from '@/components/Slider';
import Chat from '@/components/Chat';
import { useEffect, useState } from 'react';
import RankingTable from '@/components/RankingTable';

export default function Home() {
  const [ws, setWs] = useState<any>(null);
  const [multiplier, setMultiplier] = useState(0);
  const [currentRound, setCurrentRound] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [guessPoints, setGuessPoints] = useState(100);
  const [predictedMuliplier, setPredictedMultiplier] = useState(1.0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001');
    setWs(socket);

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type == 'reset') {
        setMultiplier(0);
        setCurrentRound(data.players);
      } else if (data.type == 'multiplier') {
        setMultiplier(data.multiplier);
      } else if (data.type == 'current_round') {
        setCurrentRound(data.players);
        setRanking(data.ranking);
      }
    };

    // return () => socket.close();
  }, []);

  const handleStart = () => {
    if (ws) {
      ws.send(
        JSON.stringify({
          type: 'start',
          data: { speed, guessPoints, predictedMuliplier },
        })
      );
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex gap-10'>
        <div className='w-2/3 flex flex-col gap-2'>
          <div className='flex justify-between gap-1'>
            <div className='flex flex-col'>
              <label className='text-sm'>Points</label>
              <input
                className='border rounded p-2'
                value={guessPoints}
                type='Number'
                step={25}
                max={100}
                onChange={(e) => setGuessPoints(parseInt(e.target.value))}
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-sm'>Multiplier</label>
              <input
                className='border rounded p-2'
                type='number'
                step={0.01}
                min={1}
                max={10}
                value={predictedMuliplier}
                onChange={(e) => setPredictedMultiplier(Number(e.target.value))}
              />
            </div>
          </div>
          <button className='border rounded p-2' onClick={handleStart}>
            Start
          </button>
          <CurrentRoundTable players={currentRound} />
          <Slider speed={speed} onChange={setSpeed} />
        </div>
        <div>
          <LineGraph multiplier={multiplier} />
        </div>
      </div>
      <div className='flex gap-4'>
        <div className='w-3/5'>
          <RankingTable data={ranking} />
        </div>
        <div className='w-2/5'>
          <Chat ws={ws} />
        </div>
      </div>
    </div>
  );
}
