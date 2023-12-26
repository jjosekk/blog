import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Modal } from 'antd'

import { userAPI } from '../../services/UserServices'

import cl from './login-page.module.scss'

export interface ILoginForm {
  email: string
  password: string
}

const LoginPage = () => {
  const [isLogged, setAuth] = useState(false)
  const [login] = userAPI.useLoginMutation()

  const navigate = useNavigate()

  useEffect(() => {
    if (isLogged) navigate('/')
  }, [isLogged])

  const errorModal = () => {
    Modal.error({
      title: 'Authentication error',
      content: 'Try again',
    })
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ILoginForm>({ mode: 'onChange' })

  const submit: SubmitHandler<ILoginForm> = async (formDataSubmit: ILoginForm) => {
    login({ user: { email: formDataSubmit.email, password: formDataSubmit.password } })
      .then((user: any) => {
        const { token } = user.data.user
        localStorage.setItem('token', token)
        setAuth(true)
      })
      .catch(() => errorModal())
  }

  return (
    <div className={cl['sign-in']}>
      <div className={cl['sign-in__container']}>
        <div className={cl['sign-in__title']}>Sign-in</div>
        <form className={cl['sign-in__form']} onSubmit={handleSubmit(submit)}>
          <label>
            Email address
            <input
              className={`${cl.input}  ${errors.email && cl['input-error']}`}
              placeholder="Email address"
              {...register('email', {
                required: true,
                pattern: {
                  /* eslint-disable-next-line */
                  value: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                  message: 'Incorrect email address',
                },
              })}
            ></input>
            {errors.email && <p className={cl['error-message']}>{errors.email.message}</p>}
          </label>

          <label>
            Password
            <input
              className={`${cl.input}  ${errors.password && cl['input-error']}`}
              placeholder="Password"
              {...register('password', {
                required: 'This field is required',
              })}
            ></input>
            {errors.password && <p className={cl['error-message']}>{errors.password.message}</p>}
          </label>

          <button className={cl['sign-in__button']} disabled={!isValid}>
            Login
          </button>
        </form>
        <div className={cl['sign-in__caption']}>
          Don’t have an account?
          <Link to={'/sign-up'}>
            <span className="link"> Sign Up.</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
