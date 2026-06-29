import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { ListPassword } from '../components/ListPassword'
import { MenuItems } from '../components/MenuItems'
import { SyncBanner } from '../components/SyncBanner'
import { useDispatch } from 'react-redux'
import { setClientConnected } from '../context/slice/FtpSlice'
const { ipcRenderer } = require("electron");

export  function PagePassword() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Escuchar eventos de conexión FTP del main process
    const onConnected = () => dispatch(setClientConnected(true));
    const onDisconnected = () => dispatch(setClientConnected(false));

    ipcRenderer.on("ftp-client-connected", onConnected);
    ipcRenderer.on("ftp-client-disconnected", onDisconnected);

    return () => {
      ipcRenderer.removeListener("ftp-client-connected", onConnected);
      ipcRenderer.removeListener("ftp-client-disconnected", onDisconnected);
    };
  }, []);

  return (
    <div>
      <SyncBanner />
      <Navbar/>
      <MenuItems/>
      <ListPassword/>
    </div>
  )
}
