"use client"
import SocketDemo from "../../components/SocketDemo";
import {GoHome} from '../../helpers/goHome'
export default function getStarted() {
    return (
      <div className="mt-8 justify-center flex flex-col items-center">
        <GoHome />
        <SocketDemo />
      </div>)
}