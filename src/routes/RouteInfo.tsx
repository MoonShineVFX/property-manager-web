import React, { useEffect, useState, useTransition, useRef, FormEvent } from 'react'
import { skipToken } from "@reduxjs/toolkit/query"

import { useEditItemInfoMutation, useGetItemInfoQuery } from '../redux/api'
import { useAppSelector } from '../redux/store'
import { FetchStateSwitcher } from '../components/FetchStateSwitcher'
import Icon from '../icons'
import { LoadingIndicator } from '../icons'


export default function RouteInfo(): JSX.Element {
  const [isSlide, setIsSlide] = useState(false)
  const {infoSn} = useAppSelector((state) => state.ui)
  const {data, error, isFetching, isUninitialized} = useGetItemInfoQuery(infoSn ?? skipToken)

  useEffect(() => {
    const timeout = setTimeout(() => setIsSlide(true), 500)
    return () => clearTimeout(timeout)
  }, [])

  return <div className="flex h-full justify-center items-center">
    <FetchStateSwitcher
      welcomeMessage="請輸入產編查詢"
      errorMessage="查詢發生錯誤"
      isFirst={isUninitialized}
      error={error}
      isFetching={isFetching}
      resultElement={
        data && <div className='flex flex-col items-center h-full px-4 overflow-y-auto overflow-x-hidden
                         lg:scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent w-full'>
          <ItemDetail itemInfo={data} isSlideActive={isSlide}/>
        </div>
      }
    />
  </div>
}


function ItemDetail(props: {itemInfo: {[key: string]: string}, isSlideActive: boolean}): JSX.Element {
  const {itemInfo} = props
  const [isSlide, setIsSlide] = useState(false)
  const animeStyle = isSlide ? 'animate-slide-in-up' : ''

  // Disable slide animation when switching route
  useEffect(() => {
    if (!props.isSlideActive) return
    setIsSlide(true)
    const timeout = setTimeout(() => setIsSlide(false), 1000)
    return () => clearTimeout(timeout)
  }, [itemInfo])

  return <div
    className={`${animeStyle} w-full drop-shadow-eli max-w-md grow my-12
                rounded-xl px-8 py-4 bg-gray-300 divide-y-[0.1rem] divide-gray-400/50`}>
    {Object.keys(itemInfo)
      .map(key => {
        if (!isNaN(key as any)) return null
        return <div key={key} className="flex py-4 items-center">
          <div className="rounded bg-gray-500 text-gray-200 px-2 py-1">
            {key}
          </div>
          <div className="grow text-right text-gray-500 text-xl font-bold">
            {key === 'note' ?
              <NoteEditor sn={itemInfo.sn} content={itemInfo[key as keyof typeof itemInfo]}/> :
              itemInfo[key as keyof typeof itemInfo]}
          </div>
        </div>
      })}
  </div>
}


function NoteEditor(props: {sn: string, content: string}): JSX.Element {
  const [isEditMode, setIsEditMode] = useState(false)
  const [content, setContent] = useState('')
  const [_, startTransition] = useTransition()
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  let [editItem, {isError, isSuccess, isLoading}] = useEditItemInfoMutation()

  useEffect(() => {
    setContent(props.content)
    resizeTextArea()
  }, [props.content])
  useEffect(() => {
    if (isEditMode) {
      resizeTextArea()
      textAreaRef.current?.setSelectionRange(
        textAreaRef.current?.value.length,
        textAreaRef.current?.value.length
      )
      textAreaRef.current?.focus()
    }
  }, [isEditMode])
  useEffect(() => {
    if (isSuccess && isEditMode) setIsEditMode(false)
  }, [isSuccess])

  const resizeTextArea = () => {
    startTransition(() => {
      if (!textAreaRef.current) return
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'
    })
  }

  const handleNoteSubmit = (event: FormEvent) => {
    const note = textAreaRef.current?.value
    editItem({sn: props.sn, note: note})
    event.preventDefault()
  }

  if (!isEditMode) return <div className="flex items-center justify-end group cursor-pointer relative">
    <div className="absolute rounded-md group-hover:bg-gray-400/30 left-16 -right-2 -top-2 -bottom-2
                    grid place-content-center transition-all"
         onClick={() => setIsEditMode(true)}>
      <Icon
        className="w-6 h-6 opacity-0 text-teal-600 group-hover:opacity-100 group-hover:w-8 group-hover:h-8 transition-all"
        icon="pencil"/>
    </div>
    <span
      className={`text-left group-hover:text-gray-400 transition-colors whitespace-pre-line ${content ? '' : 'text-gray-400'}`}>
    {content || '無備註'}
    </span>
  </div>

  return <form className="flex flex-col items-end" onSubmit={handleNoteSubmit}>
    <div className="relative">
      {isLoading &&
        <div className="absolute w-full h-full grid place-content-center z-10">
          <LoadingIndicator className="w-24 h-24 text-teal-600/50 fill-teal-600"/>
        </div>
      }
      <textarea ref={textAreaRef}
                className={`text-left overflow-hidden rounded-md bg-gray-100 p-3 max-w-[16ch] sm:max-w-full
                            disabled:opacity-50 ${isError ? 'focus:outline-none ring-2 ring-red-400' : 'focus:outline-teal-600'}`}
                onChange={resizeTextArea}
                disabled={isLoading}
                spellCheck={false}
                autoCorrect="off"
                autoComplete="off"
                autoCapitalize="none"
                defaultValue={content}/>
      <div className="text-base mt-2">
        <button className="bg-gray-400 hover:bg-gray-400/50 py-2 px-3 mr-4 rounded-md disabled:opacity-50"
                disabled={isLoading} type="button" onClick={() => setIsEditMode(false)}>Cancel
        </button>
        <button className="bg-teal-600 hover:bg-teal-500 py-2 px-3 text-gray-200 rounded-md disabled:opacity-50"
                disabled={isLoading} type="submit">Apply
        </button>
      </div>
    </div>
  </form>
}