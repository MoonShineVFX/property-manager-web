import { Dialog } from "@headlessui/react";
import React, { FormEvent, useDeferredValue, useEffect, useRef, useState, useTransition } from 'react';


type ScanCodeDialogProps = {
  open: boolean,
  onClose: () => void,
  isUsingScanner: boolean,
  onSubmit: (scanCode: string) => void,
  submitButtonContent: (string | JSX.Element | null)[],
  isEdit: boolean
}


export default function ScanCodeDialog(props: ScanCodeDialogProps): JSX.Element {
  const [isInvalid, setIsInvalid] = useState(false);
  const [isWorkerMode, setIsWorkerMode] = useState(false);
  const scanCodeInput = useRef<HTMLInputElement>(null);
  const [visualHeight, setVisualHeight] = useState(window.innerHeight);
  const [_, startInputTransition] = useTransition();
  const deferredVisualHeight = useDeferredValue(visualHeight);

  useEffect(() => {
    window.visualViewport?.addEventListener('resize', handleVisualViewportResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleVisualViewportResize);
    }
  }, []);

  const handleVisualViewportResize = () => {
    window.visualViewport && setVisualHeight(window.visualViewport?.height);
  }

  const handleInputChange = (scanCodeValue: string) => {
    startInputTransition(() => {
      if (props.isUsingScanner || !props.isEdit) return;
      const isO = scanCodeValue.startsWith('o');
      if (isO !== isWorkerMode) setIsWorkerMode(isO);
    });
  }

  const onSubmit = (event: FormEvent) => {
    props.onSubmit(scanCodeInput.current!.value);
    event.preventDefault()
    resetDefaultState();
  }

  const onClose = () => {
    resetDefaultState();
    props.onClose();
  }
  
  const resetDefaultState = () => {
    setIsInvalid(false);
    setIsWorkerMode(false);
  }

  return <Dialog
    open={props.open}
    onClose={onClose}
    className='relative z-50'
    initialFocus={scanCodeInput}
  >
    <div className='fixed inset-0 bg-black/25' aria-hidden='true'/>
    <div className={`fixed -translate-y-1/2 p-4 w-full flex flex-col items-center top-0`}>
      <Dialog.Panel
        className={`${props.isUsingScanner ? '' : 'transition-all'} ease-out drop-shadow-eli w-full max-w-sm rounded-xl bg-gray-600 p-6`}
        style={{transform: `translate3d(0, ${deferredVisualHeight / 2}px, 0)`}}>
        <Dialog.Title className='text-gray-200 text-xl tracking-widest select-none'>
          請{props.isUsingScanner ? '掃描' : '輸入'}產編{props.isEdit && '或同事編號'}
        </Dialog.Title>
        <form onSubmit={onSubmit} onInvalid={() => setIsInvalid(true)}>
          <div>
            <input ref={scanCodeInput}
                   className={'tracking-widest border-4 focus:outline-none w-full rounded-md text-4xl sm:text-5xl p-2 ' +
                     'my-6 text-center bg-gray-800 text-teal-500 placeholder:text-gray-600 border-transparent ' +
                     (isInvalid ? 'invalid:border-red-500/60' : '')}
                   type="text"
                   pattern={props.isUsingScanner ? undefined : (props.isEdit ? 'o?\\d{8}' : '\\d{8}')}
                   placeholder="00000000"
                   enterKeyHint="go"
                   spellCheck={false}
                   autoCorrect="off"
                   autoComplete="off"
                   autoCapitalize="none"
                   required={true}
                   onChange={event => handleInputChange(event.target.value)}
            />
          </div>
          <div className='text-right'>
            <button
              className='bg-gray-400 px-4 py-2 rounded-md hover:bg-gray-300 text-xl text-gray-700 tracking-widest indent-[0.1em]'
              type='submit'
            >
              {isWorkerMode ? <div>選擇同事</div> : props.submitButtonContent}
            </button>
          </div>
        </form>
      </Dialog.Panel>
    </div>
  </Dialog>
}
