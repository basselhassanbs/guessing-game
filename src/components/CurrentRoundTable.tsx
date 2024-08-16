interface Player {
  id: string;
  points: number;
  multiplier: number;
}

interface CurrentRoundTableProps {
  players: Player[];
}

export default function CurrentRoundTable({ players }: CurrentRoundTableProps) {
  return (
    <div>
      <h3>Current Round</h3>
      <table className='w-full text-sm text-left text-gray-500 min-h-60 table-auto bg-gray-50 border rounded'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
          <tr>
            <th className='py-1 px-4'>Name</th>
            <th className='py-1 px-4'>Point</th>
            <th className='py-1 px-4'>Multiplier</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr>
              <td className='py-1 px-4'>{player.id}</td>
              <td className='py-1 px-4'>{Math.floor(player.points)}</td>
              <td className='py-1 px-4'>{player.multiplier.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
