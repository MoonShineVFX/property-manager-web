import React, { useEffect, useState } from 'react';
import { skipToken } from "@reduxjs/toolkit/query";

import { useGetItemInfoQuery } from '../redux/api';
import { useAppSelector } from '../redux/store'
import { FetchStateSwitcher } from '../components/FetchStateSwitcher';



export default function RouteInfo(): JSX.Element {
  const [isSlide, setIsSlide] = useState(false);
  const {infoSn} = useAppSelector((state) => state.ui);
  const {data, error, isFetching, isUninitialized} = useGetItemInfoQuery(infoSn ?? skipToken);

  useEffect(() => {
    const timeout = setTimeout(() => setIsSlide(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  return <div className='flex h-full justify-center items-center'>
    <FetchStateSwitcher
      welcomeMessage='請輸入產編查詢'
      errorMessage='查詢發生錯誤'
      isFirst={isUninitialized}
      error={error}
      isFetching={isFetching}
      resultElement={
        data && <div className='flex flex-col items-center h-full px-4 overflow-y-auto overflow-x-hidden
                         lg:scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent w-full'>
          <ItemDetail itemInfo={data} isSlideActive={isSlide}/>
        </div>
      }
    />
  </div>
}


function ItemDetail(props: {itemInfo: {[key: string]: string}, isSlideActive: boolean}): JSX.Element {
  const {itemInfo} = props;
  const [isSlide, setIsSlide] = useState(false);
  const animeStyle = isSlide ? 'animate-slide-in-up' : '';

  // Disable slide animation when switching route
  useEffect(() => {
    if (!props.isSlideActive) return;
    setIsSlide(true);
    const timeout = setTimeout(() => setIsSlide(false), 1000);
    return () => clearTimeout(timeout);
  }, [itemInfo])

  return <div
    className={`${animeStyle} w-full drop-shadow-eli max-w-md grow my-12 rounded-xl px-8 py-4 bg-gray-300 divide-y-[0.1rem] divide-gray-400/50`}>
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
