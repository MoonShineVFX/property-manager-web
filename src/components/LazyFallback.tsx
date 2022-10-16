import React from "react"
import { LoadingIndicator } from "../icons";

const LazyFallback = <div className='grid place-content-center w-full h-full'>
  <LoadingIndicator className='w-24 h-24 text-gray-700 fill-gray-500' />
</div>
export default LazyFallback;
