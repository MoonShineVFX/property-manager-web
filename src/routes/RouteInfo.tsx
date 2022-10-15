import React, { useEffect } from 'react';

import { useGetItemInfoMutation } from '../redux/propertyApi';
import { useAppSelector, useAppDispatch } from '../redux/store'
import { toggleSlide } from '../redux/uiSlice';
import { FetchStateSwitcher } from '../components/FetchStateSwitcher';


export default function RouteInfo(): JSX.Element {
  const { isInfoFirst, isSlideActive } = useAppSelector((state) => state.ui);
  const [_, { data: itemInfo, error, isLoading }] = useGetItemInfoMutation({fixedCacheKey: 'shared-info'});

  return <div className='flex h-full justify-center items-center'>
    <FetchStateSwitcher
      welcomeMessage='請輸入產編查詢'
      errorMessage='查詢發生錯誤'
      isFirst={isInfoFirst}
      error={error}
      isFetching={isLoading}
      resultElement={
        itemInfo && <div className='flex flex-col items-center h-full px-4 overflow-y-auto overflow-x-hidden
                         lg:scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent w-full'>
          <ItemDetail itemInfo={itemInfo} isSlideActive={isSlideActive} />
        </div>
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
    const timeout = setTimeout(() => dispatch(toggleSlide(false)), 1000);
    return () => clearTimeout(timeout);
  }, [])

  return <div className={`${animeStyle} w-full drop-shadow-eli max-w-md grow my-12 rounded-xl px-8 py-4 bg-gray-300 divide-y-[0.1rem] divide-gray-400/50`}>
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