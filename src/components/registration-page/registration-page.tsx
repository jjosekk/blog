import { Link, useNavigate } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Modal } from 'antd'

import { userAPI } from '../../services/UserServices'

import cl from './registration-page.module.scss'

export interface IRegistrationForm {
  username: string
  email: string
  password: string
  repeatPassword: string
  agreementForPersonalData: boolean
}

const RegistrationPage = () => {
  const [registration, { isSuccess }] = userAPI.useRegistrationMutation()

  const navigate = useNavigate()

  const errorModal = () => {
    Modal.error({
      title: 'Registration error',
      content: 'Try again',
    })
  }

  const successModal = () => {
    Modal.success({
      content: 'Successful registration.',
      okText: 'Sign In',
      onOk() {
        navigate('/sign-in')
      },
    })
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<IRegistrationForm>({ mode: 'onChange' })

  const submit: SubmitHandler<IRegistrationForm> = async (data: IRegistrationForm) => {
    registration({ user: { username: data.username, email: data.email, password: data.password } }).catch(() =>
      errorModal()
    )
  }

  if (isSuccess) {
    successModal()
  }

  return (
    <div className={cl['sign-up']}>
      <div className={cl['sign-up__container']}>
        <div className={cl['sign-up__title']}>Create new account</div>
        <form className={cl['sign-up__form']} onSubmit={handleSubmit(submit)}>
          <label>
            Username
            <input
              className={`${cl['input']}  ${errors.username && cl['input-error']}`}
              placeholder="Username"
              {...register('username', {
                required: true,
                minLength: {
                  value: 3,
                  message: 'Username must be between 3 and 20 characters',
                },
                maxLength: {
                  value: 20,
                  message: 'Username must be between 3 and 20 characters',
                },
              })}
            ></input>
            {errors.username && <p className={cl['error-message']}>{errors.username.message}</p>}
          </label>

          <label>
            Email address
            <input
              className={`${cl['input']}  ${errors.email && cl['input-error']}`}
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
              className={`${cl['input']}  ${errors.password && cl['input-error']}`}
              placeholder="Password"
              {...register('password', {
                required: true,
                minLength: {
                  value: 6,
                  message: 'Password must contain from 6 to 40 characters',
                },
                maxLength: {
                  value: 40,
                  message: 'Password must contain from 6 to 40 characters',
                },
              })}
            ></input>
            {errors.password && <p className={cl['error-message']}>{errors.password.message}</p>}
          </label>

          <label>
            Repeat Password
            <input
              className={`${cl['input']}  ${errors.repeatPassword && cl['input-error']}`}
              placeholder="Password"
              {...register('repeatPassword', {
                required: true,
                validate: (value: string) => value === watch('password') || 'The passwords do not match',
              })}
            ></input>
            {errors.repeatPassword && <p className={cl['error-message']}>{errors.repeatPassword.message}</p>}
          </label>

          <div className={cl['sign-up__personal-data']}>
            <label>
              <input
                type="checkbox"
                {...register('agreementForPersonalData', {
                  required: 'Required',
                })}
              />
              I agree to the processing of my personal information
            </label>
          </div>

          <button className={cl['sign-up__button']} disabled={!isValid}>
            Create
          </button>
        </form>
        <div className={cl['sign-up__caption']}>
          Already have an account?
          <Link to={'/sign-in'}>
            <span className="link"> Sign In.</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegistrationPage
