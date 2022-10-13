import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Icon, { IconResourceKey } from './icons';


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

  // Default to /info
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/info');
    }
  }, [location])

  return <div className='flex flex-col max-w-3xl h-screen h-screen-ios mx-auto'>
    <div className='grow overflow-y-auto lg:scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-gray-900/30' style={{WebkitOverflowScrolling: 'touch'}}>
      <Outlet />
    </div>

    <div className='w-full max-w-3xl columns-2 gap-0 bg-gray-700 sm:rounded-t-xl'>
      {menuRoutes.map(route =>
        <RouteButton key={route.path}
                     text={route.text} routeTarget={route.path}
                     active={location.pathname === route.path}
                     onClick={() => navigate(route.path)} />
      )}
    </div>
  </div>;
}


function RouteButton(props: {text: string, routeTarget: string, active: boolean, onClick?: React.MouseEventHandler<HTMLDivElement>}): JSX.Element {
  const activeStyle = props.active ? 'opacity-100' : 'opacity-50'
  return <div className={'flex h-16 mx-auto transition-opacity ' + activeStyle}>
    <div className='m-auto flex items-center cursor-pointer' onClick={props.onClick}>
      <Icon className='w-8 h-8 mr-2 stroke-gray-300' icon={props.routeTarget.substring(1) as IconResourceKey} />
      {[...props.text].map(letter =>
        <span key={letter} className='mx-1 text-xl text-gray-300'>{letter}</span>
      )}
    </div>
  </div>
}