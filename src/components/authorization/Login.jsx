import React from 'react'

function Login() {
    return (
        <div className='bg-cream'>
            <h1 className='text-3xl text-beige justify-center flex py-3'>Войти в аккаунт</h1>
            <div className='grid grid-cols-5 gap-0 place-content-center py-0'>
                <input type="text" name="login" placeholder='Логин' className='bg-cream border-2 border-gray-500 rounded-lg m-2 focus:placeholder:text-transparent col-start-3' />
                <input type="text" name="password" placeholder='Пароль' className='bg-cream border-2 border-gray-500 rounded-lg m-2 focus:placeholder:text-transparent row-start-2 col-start-3' />
                <button className='border-2 border-gray-500 col-start-3 mt-4 mb-5 mr-2 ml-2 rounded-lg bg-beige-dark text-cream'>Войти</button>
            </div>
        </div>
    )

}

export default Login