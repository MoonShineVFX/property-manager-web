import React, { useEffect, useState } from 'react';
import * as Toast from '@radix-ui/react-toast';


export type NotificationPackage = {
  name?: string,
  isSuccess: boolean
};

export default function Notifications(props: { payload?: NotificationPackage }): JSX.Element {
  const [messages, setMessages] = useState<NotificationPackage[]>([]);

  useEffect(() => {
    if (!props.payload) return;
    setMessages([...messages, props.payload]);
  }, [props.payload])

  return <div className='absolute inset-0 pointer-events-none'>
    <Toast.Provider>
      {messages.map((message, idx) => <Toast.Root
        key={idx}
        duration={3000}
        className={'animate-slide-in-down absolute text-center p-4 rounded-md m-4 ' +
          `toast-closed:animate-toast-hide ${message.isSuccess ? 'bg-teal-800' : 'bg-red-900'}`}
      >
        <Toast.Description className={`text-xl ${message.isSuccess ? 'text-gray-300' : 'text-gray-300'}`}>
          {message.isSuccess ? `選擇 ${message.name}` : '掃描同事編號失敗'}
        </Toast.Description>
      </Toast.Root>)}
      <Toast.Viewport className='relative top-0 right-0 w-full z-50 flex justify-center'/>
    </Toast.Provider>
  </div>
}