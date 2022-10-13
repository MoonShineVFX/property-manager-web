import React from 'react';
import { infoData } from '../mock';


export default function Info(): JSX.Element {

  return <div className='flex justify-center my-8'>
    <div className='max-w-md grow mx-4 rounded-3xl px-8 py-4 bg-gray-300 divide-y-[0.1rem] divide-gray-400/50'>
      {
        Object.keys(infoData).map(key => {
          if (!isNaN(key as any)) return null;
          return <div key={key} className='flex py-4 items-center'>
            <div className='rounded bg-gray-500 text-gray-200 px-2 py-1'>
              {key}
            </div>
            <div className='grow text-right text-gray-500 text-xl font-bold'>
              {infoData[key as keyof typeof infoData]}
            </div>
          </div>
        })
      }
    </div>
  </div>
}
