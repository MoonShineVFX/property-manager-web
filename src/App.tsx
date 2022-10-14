import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import Icon, { IconResourceKey } from './icons';
import { useAppDispatch, useAppSelector } from "./redux/store";
import { setScanCode } from "./redux/uiSlice";


const menuRoutes = [
  {
    text: '查詢',
    path: '/info'
  },
  {
    text: '編輯',
    path: '/edit'
  }
]


export default function App(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const scanCode = useAppSelector((state) => state.ui.scanCode);

  // Default to /info
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/info');
    }
  }, [location])

  const onScanButtonClick = () => {
    if (!scanCode) {
      dispatch(setScanCode('01010130'));
      return;
    }
    dispatch(setScanCode(`0${parseInt(scanCode) + 1}`))
  }

  return <div className='flex flex-col max-w-3xl h-screen h-screen-ios mx-auto'>
    {/* Content */}
    <div className='grow overflow-y-auto lg:scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent' style={{WebkitOverflowScrolling: 'touch'}}>
      <Outlet />
    </div>

    {/* Menu */}
    <div className='drop-shadow-eli w-full max-w-3xl columns-2 gap-0 bg-gray-700 sm:rounded-t-xl'>
      {/* Scan */}
      <div onClick={onScanButtonClick} className='transition-colors group hover:bg-teal-500 drop-shadow-eli absolute rounded-full left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-teal-600 flex items-center justify-center cursor-pointer'>
        <Icon className='transition-colors w-12 h-12 stroke-gray-300 group-hover:stroke-white' icon='qrCode'></Icon>
      </div>
      {/* Routes */}
      {menuRoutes.map(route =>
        <RouteButton key={route.path}
                     text={route.text} routeTarget={route.path}
                     active={location.pathname === route.path}
                     onClick={() => (location.pathname !== route.path) && navigate(route.path)} />
      )}
    </div>
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