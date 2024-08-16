export default function RankingTable({ data }: { data: any }) {
  return (
    <div>
      <h3>Ranking</h3>
      <table className='w-full text-sm text-left text-gray-500 min-h-60 table-auto bg-gray-50 border rounded'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
          <tr>
            <th className='py-2 px-4'>No.</th>
            <th className='py-2 px-4'>Name</th>
            <th className='py-2 px-4'>Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((player: any, index: number) => (
            <tr className=''>
              <td className='py-2 px-4'>{index + 1}</td>
              <td className='py-2 px-4'>{player.id}</td>
              <td className='py-2 px-4'>{Math.floor(player.points)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
