import React from 'react';

import { setSelectedTeam, setSelectedMember } from '../redux/uiSlice';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { useGetMembersQuery, useEditItemInfoMutation } from '../redux/propertyApi';
import { FetchStateSwitcher } from '../components/FetchStateSwitcher';
import DropdownMenu from '../components/DropdownMenu';
import Icon from "../icons";


export default function RouteEdit(): JSX.Element {
  const dispatch = useAppDispatch();
  const { selectedTeam, selectedMember, isEditFirst } = useAppSelector((state) => state.ui);
  const { data: membersData, error: membersError, isFetching: isMembersFetching } = useGetMembersQuery(undefined);
  const [_, { isLoading, error, data }] = useEditItemInfoMutation({fixedCacheKey: 'shared-edit'});

  return <div className='grid grid-row-5 auto-rows-fr w-full h-full'>
    <div className='row-span-2 w-full h-full flex justify-center items-center'>
      <FetchStateSwitcher
        errorMessage='讀取資料時發生錯誤'
        error={membersError}
        isFetching={isMembersFetching}
        resultElement={
          <div className='flex flex-col gap-8 w-full items-center mx-4 py-8 px-8 bg-gray-700 max-w-xs rounded-xl drop-shadow-eli'>
            {membersData &&
            <DropdownMenu selectValue={selectedTeam} onChange={data => dispatch(setSelectedTeam(data))} dataList={membersData} />}
            {selectedTeam &&
            <DropdownMenu selectValue={selectedMember} onChange={data => dispatch(setSelectedMember(data))} dataList={selectedTeam.value} />}
          </div>
        }
      />
    </div>
    <div className='row-span-3 w-full h-full flex flex-col items-center justify-center'>
      <FetchStateSwitcher
        isFirst={isEditFirst}
        welcomeMessage={['請在上方選擇同事', '接著輸入產編轉移']}
        errorMessage='轉移資料時發生錯誤'
        error={error}
        isFetching={isLoading}
        resultElement={
          <div className='cursor-default select-none'>
            <div className='flex flex-col items-center'>
              <Icon className='w-20 h-20 stroke-teal-500 my-2' icon='success' />
              <div className='text-gray-500 text-3xl'>轉移成功</div>
              <div className='text-gray-500/75 text-center'>{data}</div>
            </div>
          </div>
        }
      />
    </div>
  </div>
}
