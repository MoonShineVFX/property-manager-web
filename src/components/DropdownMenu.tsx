import { Listbox, Transition } from '@headlessui/react';
import Icon from '../icons';
import React, { useEffect } from 'react';


export type DropdownMenuData = {
  key: string;
  name: string;
  value: any;
}


export default function DropdownMenu(props: {selectValue?: DropdownMenuData, onChange: (value: DropdownMenuData) => void, dataList: DropdownMenuData[]}): JSX.Element {
  useEffect(() => {
    if (props.dataList) props.onChange(props.dataList[0]);
  }, [props.dataList])

  return <Listbox value={props.selectValue} onChange={props.onChange}>
    {({ open }) => (
      <div className={`relative max-w-xs w-full mx-4 ${open ? 'z-50' : ''}`}>
        <Listbox.Button
          className='relative flex py-1 w-full rounded-md cursor-pointer focus:outline-none bg-gray-300
              text-gray-500 text-2xl items-center hover:bg-gray-200 transition-colors'
        >
          <div className='grow text-left ml-3'>{props.selectValue?.name}</div>
          <Icon className='relative w-10 h-10 stroke-1' icon='downList' />
        </Listbox.Button>
        <Transition
          enter='transition duration-100 ease-out'
          enterFrom='transform scale-y-0 opacity-0'
          enterTo='transform scale-y-100 opacity-100'
          leave='transition duration-75 ease-out'
          leaveFrom='transform scale-y-100 opacity-100'
          leaveTo='transform scale-y-0 opacity-0'
        >
          <Listbox.Options
            className='absolute focus:outline-none w-full mt-1 bg-gray-300 rounded-md max-h-[50vh] overflow-y-auto
                lg:scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent py-4'
            style={{WebkitOverflowScrolling: 'touch'}}
          >
            {Object.values(props.dataList).map(data => (
              <Listbox.Option key={data.key} value={data}>
                {({ active, selected }) => {
                  let extraClassNames = [];
                  if (active) extraClassNames.push('bg-gray-400/50');
                  if (selected) extraClassNames.push('font-bold');
                  return <div
                    className={`flex gap-2 items-center relative px-4 py-1 cursor-default tracking-wide text-2xl text-gray-500 ${extraClassNames.join(' ')}`}
                  >
                    <div className={`w-3 h-3 mx-2 rounded-full bg-teal-600 ${selected ? 'visible' : 'invisible'}`}></div>
                    <div>{data.name}</div>
                  </div>
                }}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    )}
  </Listbox>
}
