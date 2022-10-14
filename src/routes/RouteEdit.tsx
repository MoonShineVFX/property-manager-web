import React from 'react';

import { setSelectedTeam, setSelectedMember } from '../redux/uiSlice';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { useGetMembersQuery } from '../redux/propertyApi';
import { FetchResult } from '../components/FetchResult';
import DropdownMenu from '../components/DropdownMenu';


export default function RouteEdit(): JSX.Element {
  const dispatch = useAppDispatch();
  const { selectedTeam, selectedMember } = useAppSelector((state) => state.ui);
  const { data: membersData, error, isFetching } = useGetMembersQuery(undefined);

  return <div className='flex flex-col items-center h-full'>
    <FetchResult
      errorMessage='讀取公司資料發生錯誤'
      error={error}
      isFetching={isFetching}
      resultElement={
        <div className='w-full flex flex-col items-center grow h-1/2 justify-center gap-8 m-8 px-4'>
          {membersData &&
          <DropdownMenu selectValue={selectedTeam} onChange={data => dispatch(setSelectedTeam(data))} dataList={membersData} />}
          {selectedTeam &&
          <DropdownMenu selectValue={selectedMember} onChange={data => dispatch(setSelectedMember(data))} dataList={selectedTeam.value} />}
        </div>
      }
    />
    <div className='shrink w-full h-full flex justify-center'>
      <FetchResult
        isFirst={true}
        welcomeMessage={['請下拉選擇目標同事', '接著輸入產編轉移']}
        errorMessage='轉移資料發生錯誤'
        error={undefined}
        isFetching={false}
        // resultElement=
      />
    </div>
  </div>
}
