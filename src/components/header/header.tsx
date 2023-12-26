import { Link, Outlet, useNavigate } from 'react-router-dom'

import { useAppDispatch } from '../../hooks/redux'
import { userAPI } from '../../services/UserServices'

import cl from './header.module.scss'

const Header = () => {
  const dispatch = useAppDispatch()

  const token = localStorage.getItem('token')
  const { data: user } = userAPI.useGetUserQuery(token)
  const [resetState] = userAPI.useResetStateMutation()

  const navigate = useNavigate()

  return (
    <>
      <div className={cl.header}>
        <Link to={'/'}>
          <div className={cl['header__title']}>Realworld Blog</div>
        </Link>

        <div className={cl['header__buttons']}>
          {user && Object.keys(user).length !== 0 ? (
            <>
              <Link to={'/new-article'}>
                <button className={`${cl['header__button']} ${cl['header__button--create-article']}`}>
                  Create article
                </button>
              </Link>
              <div className={cl['header__user']}>
                <Link to={'/profile'}>{user.user.username}</Link>
                <img src={user.user.image} alt="avatar" />
              </div>
              <button
                className={`${cl['header__button']} ${cl['header__button--log-out']}`}
                onClick={() => {
                  localStorage.removeItem('token')

                  resetState('').then(() => {
                    dispatch(userAPI.util.resetApiState())
                    navigate('/sign-in')
                  })
                }}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to={'/sign-in'}>
                <button className={`${cl['header__button']} ${cl['header__button--sign-in']}`}>Sign In</button>
              </Link>
              <Link to={'/sign-up'}>
                <button className={`${cl['header__button']} ${cl['header__button--sign-up']}`}>Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
      <Outlet />
    </>
  )
}

export default Header
