import React, { useEffect } from 'react';

import { useGetItemInfoQuery } from "../redux/propertyApi";
import { useAppSelector, useAppDispatch } from '../redux/store'
import { disableSlide } from '../redux/uiSlice';
import { FetchResult } from '../components/FetchResult';


export default function RouteInfo(): JSX.Element {
  const { infoScanCode, isInfoFirst, isSlideActive } = useAppSelector((state) => state.ui);
  const { data: itemInfo, error, isFetching } = useGetItemInfoQuery(infoScanCode || '');

  return <div className='flex justify-center my-8'>
    <FetchResult
      welcomeMessage='請輸入產編查詢'
      errorMessage='查詢發生錯誤'
      isFirst={isInfoFirst}
      error={error}
      isFetching={isFetching}
      resultElement={
        itemInfo && <ItemDetail itemInfo={itemInfo} isSlideActive={isSlideActive} />
      }
    />
  </div>
}


function ItemDetail(props: {itemInfo: {[key: string]: string}, isSlideActive: boolean}): JSX.Element {
  const { itemInfo } = props;
  const animeStyle = props.isSlideActive ? 'animate-slide-in' : '';
  const dispatch = useAppDispatch();

  // Disable slide animation when switching route
  useEffect(() => {
    const timeout = setTimeout(() => dispatch(disableSlide()), 1000);
    return () => clearTimeout(timeout);
  }, [])

  return <div className={`${animeStyle} drop-shadow-eli max-w-md grow mx-4 rounded-xl px-8 py-4 bg-gray-300 divide-y-[0.1rem] divide-gray-400/50`}>
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