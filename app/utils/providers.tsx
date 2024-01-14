'use client'
// import {NextUIProvider} from '@nextui-org/react'
import { ContextProvider } from './contexts/Context';


export function Providers({children}: { children: React.ReactNode }) {


  return (
      //<NextUIProvider>
          <ContextProvider>
            {children}
          </ContextProvider>
      //</NextUIProvider>
  )
}