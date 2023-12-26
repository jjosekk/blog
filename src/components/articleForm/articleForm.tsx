import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Modal } from 'antd'

import { articleAPI } from '../../services/ArticlesService'

import cl from './articleForm.module.scss'

export interface ICreateArticle {
  title: string
  description: string
  body: string
  tags: { tag: string }[]
}

const ArticleForm = (props: any) => {
  const { status } = props
  const { slug } = useParams()
  const [addArticle, { isSuccess: isAddArticleSuccess, isError: isAddArticleError }] =
    articleAPI.useAddArticleMutation()
  const [editArticle, { isSuccess: isEditArticleSuccess, isError: isEditArticleError }] =
    articleAPI.useEditArticleMutation()
  const { data: article } = articleAPI.useGetArticleQuery(slug)

  const navigate = useNavigate()

  useEffect(() => {
    if (isAddArticleSuccess || isEditArticleSuccess) navigate('/')
  }, [isAddArticleSuccess, isEditArticleSuccess])

  const formTitle: any = {
    edit: 'Edit article',
    new: 'Create new article',
  }

  const errorModal = () => {
    Modal.error({
      title: 'Error',
      content: 'Error adding or editing an article, try again',
    })
  }

  const {
    control,
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<ICreateArticle>({
    mode: 'onChange',
    defaultValues: {
      title: article ? article?.article.title : '',
      description: article ? article?.article.description : '',
      body: article ? article?.article.body : '',
      tags: article ? article?.article.tagList : [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  })

  const submitHandler: SubmitHandler<ICreateArticle> = async (data: ICreateArticle) => {
    const tagList: any = []
    data.tags.map((el) => {
      tagList.push(...Object.values(el))
    })

    if (status === 'edit') {
      editArticle({
        article: {
          title: data.title,
          description: data.description,
          body: data.body,
          tagList: tagList,
          slug: slug,
        },
      }).catch(() => errorModal())
    }

    if (status === 'new') {
      addArticle({
        article: {
          title: data.title,
          description: data.description,
          body: data.body,
          tagList: tagList,
        },
      }).catch(() => errorModal())
    }
  }

  if (isAddArticleError || isEditArticleError) {
    errorModal()
  }

  return (
    <div className={cl.container}>
      <div className={cl.title}>{formTitle[status]}</div>
      <form className={cl.form} onSubmit={handleSubmit(submitHandler)}>
        <label className={cl.label}>
          Title
          <input
            className={cl.input}
            placeholder="Title"
            {...register('title', {
              required: true,
            })}
          ></input>
        </label>
        <label className={cl.label}>
          Short description
          <input
            className={cl.input}
            placeholder="Short description"
            {...register('description', {
              required: true,
            })}
          ></input>
        </label>
        <label className={cl.label}>
          Text
          <textarea
            className={cl.textarea}
            placeholder="Text"
            {...register('body', {
              required: true,
            })}
          ></textarea>
        </label>
        <div className={cl.tags}>
          Tags
          {fields.map((item, index) => (
            <div key={item.id} className={cl.tag}>
              <input
                className={cl['tag-input']}
                {...register(`tags.${index}.tag`, { required: true })}
                defaultValue={article?.article.tagList[index]}
              />
              <button className={cl.delete} type="button" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
          ))}
          <button
            className={`${cl.add} ${fields.length >= 1 && cl.absolute}`}
            type="button"
            onClick={() => append({ tag: '' })}
          >
            Add Tag
          </button>
        </div>
        <button className={cl['create-button']} disabled={!isValid}>
          Send
        </button>
      </form>
    </div>
  )
}

export default ArticleForm
