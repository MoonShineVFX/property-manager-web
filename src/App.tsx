import React, { KeyboardEvent as ReactKeyboardEvent, useEffect, useState, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import ScanCodeDialog from "./components/ScanCodeDialog";
import LazyFallback from "./components/LazyFallback";
import Icon, { IconResourceKey } from './icons';
import { useAppDispatch, useAppSelector } from './redux/store';
import { setInfoSn, applyMember } from './redux/uiSlice';
import { useEditItemInfoMutation } from './redux/api';
import Notifications, { NotificationPackage } from "./components/Notifications";


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
  const [notificationPackage, setNotificationPackage] = useState<NotificationPackage>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedMember } = useAppSelector((state) => state.ui);
  const isEditMode = location.pathname === '/edit';
  const [editItem] = useEditItemInfoMutation({fixedCacheKey: 'shared-edit'});


  // Default to /info
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/info');
    }
  }, [location]);

  // Event Listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  // Handlers
  const onScanDialogSubmit = (scanCode: string) => {
    if (scanCode) {
      if (!isEditMode) {
        dispatch(setInfoSn(scanCode));
      } else {
        if (scanCode.startsWith('o')) {
          dispatch(applyMember(scanCode.slice(1))).then(result => {
            if ('error' in result) {
              setNotificationPackage({isSuccess: false});
              return;
            }
            setNotificationPackage({name: result.payload, isSuccess: true});
          })
        } else {
          editItem({
            sn: scanCode,
            oeid: selectedMember!.value.eid
          });
        }
      }
    }

    if (isUsingScanner) setIsUsingScanner(false);
    setIsScanDialogOpen(false);
  }

  const handleKeyDown = (event: KeyboardEvent | ReactKeyboardEvent) => {
    switch (event.key) {
      case '!':
        setIsUsingScanner(true);
        if (!isScanDialogOpen) setIsScanDialogOpen(true);
        event.preventDefault();
        break;
      default:
        break;
    }
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
                     onClick={() => (location.pathname !== route.path) && navigate(route.path)}/>
      )}
    </div>

    {/* Dialog */}
    <ScanCodeDialog open={isScanDialogOpen}
                    onClose={() => setIsScanDialogOpen(false)}
                    isUsingScanner={isUsingScanner}
                    onSubmit={onScanDialogSubmit}
                    submitButtonContent={menuRoutes.map(v => {
                      if (v.path !== location.pathname) return null;
                      if (isEditMode) return <span key={v.text}>{`${v.text}至 `}<span
                        className='font-bold'>{selectedMember?.name}</span></span>;
                      return v.text;
                    })}
                    isEdit={isEditMode}/>

    {/* Notifications */}
    <Notifications payload={notificationPackage}/>
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