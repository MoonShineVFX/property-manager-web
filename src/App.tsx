import React, { KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Dialog } from '@headlessui/react';

import Icon, { IconResourceKey } from './icons';
import { useAppDispatch, useAppSelector } from "./redux/store";
import { setInfoScanCode } from "./redux/uiSlice";


const menuRoutes = [
  {
    text: '查詢',
    path: '/info'
  },
  {
    text: '轉移',
    path: '/edit'
  }
]


export default function App(): JSX.Element {
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedMember } = useAppSelector((state) => state.ui);
  const scanCodeInput = useRef<HTMLInputElement>(null);
  const isEditMode = location.pathname === '/edit';

  // Default to /info
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/info');
    }
  }, [location])

  // Bind keys
  const keyHandler = (event: KeyboardEvent | ReactKeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        if (isScanDialogOpen) {
          onScanButtonClick();
          event.preventDefault();
        }
        break;
      case 'Tab':
        setIsScanDialogOpen(!isScanDialogOpen);
        event.preventDefault();
        break;
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [])

  const onScanButtonClick = () => {
    const sn = scanCodeInput.current!.value;

    if (sn) {
      if (!isEditMode) {
        dispatch(setInfoScanCode(scanCodeInput.current!.value));
      } else {

      }
    }

    setIsScanDialogOpen(false);
  }

  return <div className='flex flex-col max-w-3xl h-screen h-screen-ios mx-auto'>
    {/* Content */}
    <div className='grow overflow-x-hidden overflow-y-auto lg:scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent'
         style={{WebkitOverflowScrolling: 'touch'}}>
      <Outlet />
    </div>

    {/* Menu */}
    <div className='drop-shadow-eli w-full max-w-3xl columns-2 gap-16 bg-gray-700 sm:rounded-t-xl sm:gap-0'>
      {/* Scan */}
      <button disabled={isEditMode && !selectedMember} onClick={() => setIsScanDialogOpen(true)} className='transition-opacity disabled:opacity-50 transition-colors group hover:bg-teal-500 drop-shadow-eli absolute rounded-full left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-teal-600 flex items-center justify-center cursor-pointer'>
        <Icon className='transition-colors w-12 h-12 stroke-gray-300 group-hover:stroke-white' icon='qrCode'></Icon>
      </button>
      {/* Routes */}
      {menuRoutes.map(route =>
        <RouteButton key={route.path}
                     text={route.text} routeTarget={route.path}
                     active={location.pathname === route.path}
                     onClick={() => (location.pathname !== route.path) && navigate(route.path)} />
      )}
    </div>

    {/* Dialog */}
    <Dialog
      open={isScanDialogOpen}
      onClose={() => setIsScanDialogOpen(false)}
      className='relative z-50'
      initialFocus={scanCodeInput}
    >
      <div className='fixed inset-0 bg-black/25' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center p-8'>
        <Dialog.Panel className='drop-shadow-eli  w-full max-w-sm rounded-xl bg-gray-600 p-6 -translate-y-1/3 sm:-translate-y-0'>
          <Dialog.Title className='text-gray-200 text-xl tracking-widest'>掃描或輸入產編</Dialog.Title>
          <div>
            <input ref={scanCodeInput}
                   className='tracking-widest focus:outline-none w-full rounded-md text-4xl sm:text-5xl p-2 my-6 text-center bg-gray-800 text-teal-500 placeholder:text-gray-600'
                   type='tel'
                   placeholder='00000000'
                   onKeyDown={keyHandler}
            />
          </div>
          <div className='text-right'>
            <button
              onClick={onScanButtonClick}
              className='bg-gray-400 px-4 py-2 rounded-md hover:bg-teal-700 hover:text-gray-300 text-xl text-gray-700 tracking-widest indent-[0.1em]'
            >
              {menuRoutes.map(v => {
                if (v.path !== location.pathname) return null;
                if (isEditMode) return `${v.text}至 ${selectedMember?.name}`;
                return v.text;
              })}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  </div>;
}


function RouteButton(props: {text: string, routeTarget: string, active: boolean, onClick?: React.MouseEventHandler<HTMLDivElement>}): JSX.Element {
  return <div className={'flex h-16 mx-auto select-none'}>
    <div className={'group m-auto flex items-center ' + (props.active ? 'cursor-default' : 'cursor-pointer')} onClick={props.onClick}>
      <Icon className={'w-8 h-8 mr-2 transition-colors stroke-gray-200 ' + (props.active ? '' : 'stroke-gray-400 group-hover:stroke-white')} icon={props.routeTarget.substring(1) as IconResourceKey} />
      {[...props.text].map(letter =>
        <span key={letter} className={'mx-1 text-xl transition-colors text-gray-200 ' + (props.active ? '' : 'text-gray-400 group-hover:text-white')}>{letter}</span>
      )}
    </div>
  </div>
}