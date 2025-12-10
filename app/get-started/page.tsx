"use client"
import SocketDemo from "../../components/SocketDemo";
import {GoHome} from '../../helpers/goHome'
export default function getStarted() {
    return (
      <>
      <div className="mt-8 grid grid-cols">
        <div className="flex justify-center">
        <GoHome />
        </div>
        <SocketDemo />
      </div>
      
      </>
    )
}