import React from 'react'

function Registration() {
    return (
        <div className='bg-cream'>
            <h1 className='text-3xl text-beige justify-center flex py-3'>Создание аккаунта</h1>
            <div className='grid grid-cols-10 gap-0 place-content-center py-0'>
                <input type="text" name="login" placeholder='Логин*' className='bg-cream border-2 border-gray-500 rounded-lg m-2 focus:placeholder:text-transparent col-start-4 col-end-6' />
                <input type="text" name="email" placeholder='E-Mail' className='bg-cream border-2 border-gray-500 rounded-lg m-2 focus:placeholder:text-transparent col-start-6 col-end-8' />
                <input type="text" name="password" placeholder='Пароль*' className='bg-cream border-2 border-gray-500 rounded-lg m-2 focus:placeholder:text-transparent col-start-4 col-end-6' />
                <input type="text" name="phone" placeholder='Номер телефона*' className='bg-cream border-2 border-gray-500 rounded-lg m-2 focus:placeholder:text-transparent col-start-6 col-end-8' />
                <input type="text" name="confirmPassword" placeholder='Повторите пароль*' className='bg-cream border-2 border-gray-500 rounded-lg m-2 focus:placeholder:text-transparent col-start-4 col-end-6' />
                <input type="text" name="nameField" placeholder='Имя' className='bg-cream border-2 border-gray-500 rounded-lg m-2 focus:placeholder:text-transparent col-start-6 col-end-8' />
                <p className='col-start-4 col-span-2 pl-3 text-beige'>* - обязательное</p>
                <button className='border-2 border-gray-500 col-start-6 col-end-8 mt-4 mb-5 mr-2 ml-2 rounded-lg bg-beige-dark text-cream'>Создать аккаунт</button>
            </div>
        </div>
    )
}

export default Registration