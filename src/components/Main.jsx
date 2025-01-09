import React from 'react'
import {HashRouter, Route, Routes} from 'react-router-dom'
import {navItems} from '../utils/constants'
import AdminPanel from './admin/AdminPanel'
import Login from './authorization/Login'
import Registration from './authorization/Registration'
import Catalog from './catalog/Catalog'
import StartPage from './start page/StartPage'

const Main = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path={navItems[0].path} element={<Login/>}/>
                <Route path={navItems[1].path} element={<Registration/>}/>
                <Route path={navItems[2].path + "*"} element={<AdminPanel/>}/>
                <Route path={navItems[3].path} element={<Catalog/>}/>
                <Route path="/" element={<StartPage/>}/>
            </Routes>
        </HashRouter>
    )
}

export default Main
