import React from 'react'
import * as Toast from '@radix-ui/react-toast'
import { useAppSelector } from '../redux/store'


export default function Notifications(): JSX.Element {
  const notifications = useAppSelector((state) => state.ui.notifications)

  return <div className="absolute inset-0 pointer-events-none">
    <Toast.Provider>
      {notifications.map((notiPackage, idx) => <Toast.Root
        key={idx}
        duration={3000}
        className={'animate-slide-in-down absolute text-center p-4 rounded-md m-4 ' +
          `toast-closed:animate-toast-hide ${notiPackage.isSuccess ? 'bg-teal-800' : 'bg-red-900'}`}
      >
        <Toast.Description className={`text-xl ${notiPackage.isSuccess ? 'text-gray-300' : 'text-gray-300'}`}>
          {notiPackage.message}
        </Toast.Description>
      </Toast.Root>)}
      <Toast.Viewport className='relative top-0 right-0 w-full z-50 flex justify-center'/>
    </Toast.Provider>
  </div>
}