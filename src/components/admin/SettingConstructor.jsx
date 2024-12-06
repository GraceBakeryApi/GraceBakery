import React from 'react'
import { adminNavItems, navItems } from '../../utils/constants'
import { Route, Routes } from 'react-router-dom'
import ErrorPage from '../ErrorPage'
import AdminTable from './AdminTable';

function SettingConstructor() {
    return (
        <div className='col-span-10 col-start-3 px-4'>
            <Routes>
                <Route path="/:entity" element={<AdminTable items={adminNavItems} />} />
                {adminNavItems.map((item, index) => (
                    item.constructor && (
                        <Route
                            key={index}
                            path={item.path + "/add"}
                            element={<item.constructor mode={"Добавить"} />}
                        />
                    )
                ))}
                {adminNavItems.map((item, index) => (
                    item.constructor && (
                        <Route
                            key={index}
                            path={item.path + "/edit"}
                            element={<item.constructor mode={"Редактировать"} />}
                        />
                    )
                ))}
                <Route path='*' element={<ErrorPage />} />
            </Routes>
        </div>
    );
}


export default SettingConstructor