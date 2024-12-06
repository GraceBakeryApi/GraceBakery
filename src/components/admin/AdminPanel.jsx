import React from 'react'
import SettingList from './SettingList'
import SettingConstructor from './SettingConstructor'

function AdminPanel() {
    return (
        <div className='bg-cream'>
            <h1 className='text-4xl text-beige p-2'>Инструменты администратора</h1>
            <div className='grid grid-cols-12'>
                <SettingList />
                <SettingConstructor />
            </div>
        </div>
    )
}

export default AdminPanel