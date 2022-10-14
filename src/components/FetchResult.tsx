import Icon, { LoadingIndicator } from '../icons';
import React from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';


type FetchResultProps = {
  isFirst?: boolean,
  error: FetchBaseQueryError | SerializedError | undefined,
  isFetching: boolean,
  resultElement?: JSX.Element,
  errorMessage: string,
  welcomeMessage?: string | string[]
}

export function FetchResult(props: FetchResultProps): JSX.Element | null {
  const welcomeMessages = Array.isArray(props.welcomeMessage) ? props.welcomeMessage : [props.welcomeMessage];
  if (props.isFirst) return <div className='absolute grow flex justify-center items-center bottom-28'>
    <div className='mx-4 p-4 flex flex-col items-center rounded-xl grow max-w-xs border-dashed border-2 border-gray-500'>
      {welcomeMessages.map(message => <div className='text-gray-500 text-xl sm:text-3xl my-1 text-center'>{message}</div>)}
      <Icon className='mt-4 w-24 h-24 stroke-teal-600/50 stroke-2' icon='downArrow' />
    </div>
  </div>

  if (props.error) return <div className='absolute top-1/2'>
    <div className='flex flex-col items-center -translate-y-1/2'>
      <Icon className='w-20 h-20 stroke-red-500' icon='error' />
      <div className='text-gray-500 text-3xl'>{props.errorMessage}</div>
      {'status' in props.error &&
        <div className='text-gray-500 text'>{props.error.status}</div>
      }
    </div>
  </div>

  if (props.isFetching) return <div className='absolute top-1/2'>
    <div className='-translate-y-1/2'>
      <LoadingIndicator className='w-48 h-48 text-gray-700 fill-teal-600' />
    </div>
  </div>

  return props.resultElement || null;
}