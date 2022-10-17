import React, { useEffect, useRef, useState } from 'react';

import { setSelectedTeam, setSelectedMember, EditItemResult } from '../redux/uiSlice';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { useGetMembersQuery } from '../redux/api';
import { FetchStateSwitcher } from '../components/FetchStateSwitcher';
import DropdownMenu from '../components/DropdownMenu';
import Icon, { LoadingIndicator } from "../icons";


export default function RouteEdit(): JSX.Element {
  const dispatch = useAppDispatch();
  const resultListRef = useRef<HTMLDivElement>(null);
  const [smoothScroll, setSmoothScroll] = useState(false);
  const { selectedTeam, selectedMember, editItemResultList } = useAppSelector((state) => state.ui);
  const { data: membersData, error: membersError, isFetching: isMembersFetching } = useGetMembersQuery(undefined);


  // Scroll management
  useEffect(() => {
    if (editItemResultList.length === 0) return;
    if (resultListRef.current) {
      resultListRef.current.scrollTo({
        top: resultListRef.current.scrollHeight,
        behavior: smoothScroll ? 'smooth' : 'auto'
      })
    }
  }, [editItemResultList]);
  useEffect(() => {
    const timeout = setTimeout(() => setSmoothScroll(true), 500);
    return () => clearTimeout(timeout);
  }, []);


  return <div className='grid grid-row-5 auto-rows-fr w-full h-full'>
    <div className='relative row-span-2 w-full h-full flex justify-center items-center z-10'>
      <FetchStateSwitcher
        errorMessage='讀取資料時發生錯誤'
        error={membersError}
        isFetching={isMembersFetching}
        resultElement={
          <div className='flex flex-col gap-8 w-full items-center mx-4 py-8 px-8 bg-gray-700 max-w-xs rounded-xl drop-shadow-xl'>
            {membersData &&
            <DropdownMenu selectValue={selectedTeam} onChange={data => dispatch(setSelectedTeam(data))} dataList={membersData} />}
            {selectedTeam &&
            <DropdownMenu selectValue={selectedMember} onChange={data => dispatch(setSelectedMember(data))} dataList={selectedTeam.value} />}
          </div>
        }
      />
    </div>
    <div className='relative row-span-3 w-full h-full flex flex-col items-center justify-center'>
      <FetchStateSwitcher
        isFirst={editItemResultList.length === 0}
        welcomeMessage={['請在上方選擇同事', '接著輸入產編轉移']}
      />
      {editItemResultList.length !== 0 &&
        <div ref={resultListRef} className='w-full h-full overflow-y-auto overflow-x-hidden lg:scrollbar-thin scrollbar-thumb-gray-700/50
                      scrollbar-track-transparent flex flex-col items-center'
        >
          <div className='absolute w-full'>
            <div className='relative w-full h-[12vh] bg-gradient-to-b from-gray-800 to-gray-800/0'></div>
          </div>
          <div className='flex flex-col divide-y-2 divide-gray-700/50 py-[25vh]'>
            {editItemResultList.map(
              (editItemResult, idx, resulList) =>
                <EditItemResultIndicator key={idx} result={editItemResult} highlight={idx + 1 === resulList.length} />
            )}
          </div>
        </div>
      }
    </div>
  </div>
}


function EditItemResultIndicator(props: {result: EditItemResult, highlight: boolean}): JSX.Element {
  return <div className='flex items-center gap-3'>
    {props.result.state === 'LOADING' ?
      <LoadingIndicator className='w-10 h-10 mx-1 my-3 text-gray-700 fill-gray-500' /> :
      <Icon
        className={`w-12 h-12 ${props.result.state === 'SUCCESS' ? 'stroke-teal-500' : 'stroke-red-500'} my-2`}
        icon={props.result.state === 'SUCCESS' ? 'success' : 'failed'} />
    }
    <div className={`transition-colors text-2xl ${props.highlight ? 'text-gray-200': 'text-gray-400'} min-w-[8ch]`}>{props.result.sn}</div>
  </div>
}