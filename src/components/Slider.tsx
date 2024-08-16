import { Dispatch, SetStateAction } from 'react';

export default function Slider({
  speed,
  onChange,
}: {
  speed: number;
  onChange: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className='relative'>
      <label className='sr-only'>Labels range</label>
      <input
        type='range'
        min={1}
        max={5}
        value={speed}
        onChange={(e) => {
          onChange(parseInt(e.target.value));
        }}
        className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
      />
      <span className='text-sm text-gray-500 absolute start-0 -bottom-6'>
        1x
      </span>
      <span className='text-sm text-gray-500 absolute start-1/4 -translate-x-1/2 -bottom-6'>
        2x
      </span>
      <span className='text-sm text-gray-500 absolute start-2/4 -translate-x-1/2 -bottom-6'>
        3x
      </span>
      <span className='text-sm text-gray-500 absolute start-3/4 -translate-x-1/2 -bottom-6'>
        4x
      </span>
      <span className='text-sm text-gray-500 absolute end-0 -bottom-6'>5x</span>
    </div>
  );
}
