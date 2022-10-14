import React from 'react';

import { useGetItemInfoQuery } from "../redux/propertyApi";
import { useAppSelector } from '../redux/store'


export default function Info(): JSX.Element {
  const isFirst = useAppSelector((state) => state.ui.isFirst);
  const scanCode = useAppSelector((state) => state.ui.scanCode);
  const { data: itemInfo, error, isFetching } = useGetItemInfoQuery(scanCode || '');

  return <div className='flex justify-center my-8'>
    {isFirst ? (
      <div>FIRST MEET</div>
    ) : error ? (
      <div>Error fetching</div>
    ) : isFetching ? (
      <div>Loading...</div>
    ) : itemInfo ? (
      <ItemDetail itemInfo={itemInfo} />
    ) : null}
  </div>
}


function ItemDetail(props: {itemInfo: {[key: string]: string}}): JSX.Element {
  const { itemInfo } = props;

  return <div className='animate-slide-in drop-shadow-eli max-w-md grow mx-4 rounded-3xl px-8 py-4 bg-gray-300 divide-y-[0.1rem] divide-gray-400/50'>
    {Object.keys(itemInfo).map(key => {
      if (!isNaN(key as any)) return null;
      return <div key={key} className='flex py-4 items-center'>
        <div className='rounded bg-gray-500 text-gray-200 px-2 py-1'>
          {key}
        </div>
        <div className='grow text-right text-gray-500 text-xl font-bold'>
          {itemInfo[key as keyof typeof itemInfo]}
        </div>
      </div>
    })}
  </div>
}