import { SubmitHandler, useForm } from 'react-hook-form'
import { Modal } from 'antd'
import { useNavigate } from 'react-router-dom'

import { userAPI } from '../../services/UserServices'

import cl from './edit-profile.module.scss'

export interface IEditProfileForm {
  username: string
  email: string
  bio: string
  newPassword: string
  image: string
}

const EditProfile = () => {
  const [editProfile, { isSuccess }] = userAPI.useEditProfileMutation()

  const errorModal = () => {
    Modal.error({
      title: 'Error',
      content: 'Data change error, try again',
    })
  }

  const successModal = () => {
    Modal.success({
      content: 'Data successfully changed',
      onOk() {
        navigate('/')
      },
    })
  }

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IEditProfileForm>({ mode: 'onChange' })

  const submit: SubmitHandler<IEditProfileForm> = async (data: IEditProfileForm) => {
    editProfile({
      user: data,
    }).catch(() => errorModal())
  }

  if (isSuccess) {
    successModal()
  }

  return (
    <div className={cl.container}>
      <div className={cl.title}>Edit Profile</div>
      <form className={cl.form} onSubmit={handleSubmit(submit)}>
        <label>
          Username
          <input
            className={`${cl.input}  ${errors.username && cl['input-error']}`}
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
          Biography
          <input
            className={`${cl.input}  ${errors.bio && cl['input-error']}`}
            placeholder="bio"
            {...register('bio', {
              required: 'This field is required',
            })}
          ></input>
          {errors.bio && <p className={cl['error-message']}>{errors.bio.message}</p>}
        </label>

        <label>
          New password
          <input
            className={`${cl.input}  ${errors.newPassword && cl['input-error']}`}
            placeholder="New password"
            {...register('newPassword', {
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
          {errors.newPassword && <p className={cl['error-message']}>{errors.newPassword.message}</p>}
        </label>

        <label>
          Avatar image (url)
          <input
            className={`${cl.input}  ${errors.image && cl['input-error']}`}
            placeholder="Avatar image"
            {...register('image', {
              pattern: {
                value: /^((http|https|ftp):\/\/)?(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)/i,
                message: 'Incorrect url address',
              },
            })}
          ></input>
          {errors.image && <p className={cl['error-message']}>{errors.image.message}</p>}
        </label>

        <button className={cl.button} disabled={!isValid}>
          Save
        </button>
      </form>
    </div>
  )
}

export default EditProfile
