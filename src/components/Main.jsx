import React, { PureComponent } from 'react'
import { Routes, Route } from 'react-router-dom'
import { navItems } from '../utils/constants'
import AdminPanel from './admin/AdminPanel'
import ErrorPage from './ErrorPage'
import Login from './authorization/Login'
import Registration from './authorization/Registration'

const Main = () => {
    return (
        <Routes>
            <Route path={navItems[0].path} element={<Login />} />
            <Route path={navItems[1].path} element={<Registration />} />
            <Route path={navItems[2].path + '*'} element={<AdminPanel />} />
        </Routes>
    )
}

export default Main