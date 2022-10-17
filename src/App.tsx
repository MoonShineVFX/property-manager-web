import React, { KeyboardEvent as ReactKeyboardEvent, ChangeEvent, useEffect, useRef, useState, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Dialog } from '@headlessui/react';

import LazyFallback from "./components/LazyFallback";
import Icon, { IconResourceKey } from './icons';
import { useAppDispatch, useAppSelector } from './redux/store';
import { setInfoSn } from './redux/uiSlice';
import { useEditItemInfoMutation } from './redux/api';


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
  const [isUsingScanner, setIsUsingScanner] = useState(false);
  const [visualHeight, setVisualHeight] = useState(window.innerHeight);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedMember } = useAppSelector((state) => state.ui);
  const scanCodeInput = useRef<HTMLInputElement>(null);
  const [scanCodeInputValue, setScanCodeInputValue] = useState('');
  const isEditMode = location.pathname === '/edit';
  const [editItem] = useEditItemInfoMutation({fixedCacheKey: 'shared-edit'});


  // Default to /info
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/info');
    }
  }, [location]);

  // Clean scancode input
  useEffect(() => {
    if (!isScanDialogOpen) setScanCodeInputValue('');
  }, [isScanDialogOpen]);

  // Event Listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.visualViewport?.addEventListener('resize', handleVisualViewportResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.visualViewport?.removeEventListener('resize', handleVisualViewportResize);
    }
  }, []);

  // Handlers
  const onScanButtonClick = () => {
    const scanValue = scanCodeInput.current!.value;

    if (scanValue) {
      if (!isEditMode) {
        dispatch(setInfoSn(scanValue));
      } else {
        editItem({
          sn: scanValue,
          oeid: selectedMember!.value.eid
        });
      }
    }

    setIsScanDialogOpen(false);
  }

  const handleScanCodeInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (isUsingScanner) {
      setScanCodeInputValue(event.target.value);
      return;
    }
    const result = event.target.value.replace(/\D/g, '');
    setScanCodeInputValue(result);
  }

  const handleKeyDown = (event: KeyboardEvent | ReactKeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        if (isScanDialogOpen) {
          onScanButtonClick();
          event.preventDefault();
        }
        if (isUsingScanner) setIsUsingScanner(false);
        break;
      case '!':
        setIsUsingScanner(true);
        if (!isScanDialogOpen) setIsScanDialogOpen(true);
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  const handleVisualViewportResize = () => {
    window.visualViewport && setVisualHeight(window.visualViewport?.height);
  }

  return <div className='flex flex-col max-w-3xl h-full mx-auto'>
    {/* Content */}
    <div className='grow overflow-hidden'>
      <Suspense fallback={LazyFallback}>
        <Outlet />
      </Suspense>
    </div>

    {/* Footer Menu */}
    <div className='drop-shadow-eli w-full max-w-3xl columns-2 gap-16 bg-gray-700 sm:rounded-t-xl sm:gap-0 pb-safe'>
      {/* Scan */}
      <button
        disabled={isEditMode && !selectedMember}
        onClick={() => setIsScanDialogOpen(true)}
        className='focus:outline-none transition-colors disabled:bg-teal-800 group
        hover:enabled:bg-teal-500 drop-shadow-eli absolute rounded-full left-1/2 -translate-x-1/2
        -translate-y-1/2 w-16 h-16 bg-teal-600 flex items-center justify-center enabled:cursor-pointer'>
        <Icon className='transition-colors w-12 h-12 stroke-gray-300 group-disabled:stroke-gray-500 group-hover:stroke-white' icon='qrCode'></Icon>
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
      <div className={`fixed -translate-y-1/2 p-4 w-full flex flex-col items-center top-0`}>
        <Dialog.Panel className={`${isUsingScanner ? '' : 'transition-all'} ease-out drop-shadow-eli w-full max-w-sm rounded-xl bg-gray-600 p-6`} style={{transform: `translate3d(0, ${visualHeight / 2}px, 0)`}}>
          <Dialog.Title className='text-gray-200 text-xl tracking-widest select-none'>掃描或輸入產編</Dialog.Title>
          <div>
            <input ref={scanCodeInput}
                   className='tracking-widest focus:outline-none w-full rounded-md text-4xl sm:text-5xl p-2 my-6 text-center bg-gray-800 text-teal-500 placeholder:text-gray-600'
                   type='text'
                   pattern={isUsingScanner ? undefined : '[0-9]*'}
                   placeholder='00000000'
                   value={scanCodeInputValue}
                   onChange={handleScanCodeInput}
                   onKeyDown={handleKeyDown}
                   enterKeyHint='go'
            />
          </div>
          <div className='text-right'>
            <button
              onClick={onScanButtonClick}
              className='bg-gray-400 px-4 py-2 rounded-md hover:bg-teal-700 hover:text-gray-300 text-xl text-gray-700 tracking-widest indent-[0.1em]'
            >
              {menuRoutes.map(v => {
                if (v.path !== location.pathname) return null;
                if (isEditMode) return <span key={v.text}>{`${v.text}至 `}<span className='font-bold'>{selectedMember?.name}</span></span>;
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