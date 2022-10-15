import Icon, { LoadingIndicator } from '../icons';
import React from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';


type FetchStateSwitcherProps = {
  isFirst?: boolean,
  error: FetchBaseQueryError | SerializedError | undefined,
  isFetching: boolean,
  resultElement?: JSX.Element,
  errorMessage: string,
  welcomeMessage?: string | string[]
}

export function FetchStateSwitcher(props: FetchStateSwitcherProps): JSX.Element | null {
  // Welcome
  const welcomeMessages = Array.isArray(props.welcomeMessage) ? props.welcomeMessage : [props.welcomeMessage];
  if (props.isFirst) return <div className='flex flex-col h-full place-content-end pb-12'>
    <div className='mx-4 p-4 flex flex-col items-center rounded-xl max-w-xs border-dashed border-2 border-gray-500 cursor-default select-none'>
      {welcomeMessages.map(message => <div className='text-gray-500 text-xl sm:text-3xl my-1 text-center' key={message}>{message}</div>)}
      <Icon className='mt-4 w-24 h-24 stroke-teal-600/50 stroke-2' icon='downArrow' />
    </div>
  </div>

  // Error
  if (props.error) return <div className='cursor-default select-none'>
    <div className='flex flex-col items-center'>
      <Icon className='w-20 h-20 stroke-red-500 my-2' icon='error' />
      <div className='text-gray-500 text-3xl'>{props.errorMessage}</div>
      {'status' in props.error && <div className='text-gray-500 text'>{props.error.status}</div>}
      {'data' in props.error && typeof props.error.data === 'string' &&
        (props.error.data.includes('div') ?
          <div className='bg-gray-500 rounded-md' dangerouslySetInnerHTML={{__html: props.error.data}}></div> :
          <div className='text-gray-500 text'>{props.error.data as string}</div>)
      }
    </div>
  </div>

  // Fetching
  if (props.isFetching) return <div className=''>
    <div className=''>
      <LoadingIndicator className='w-48 h-48 text-gray-700 fill-teal-600' />
    </div>
  </div>

  // Main
  return props.resultElement || null;
}