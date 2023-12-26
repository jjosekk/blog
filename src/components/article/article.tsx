import { Link, useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { useEffect } from 'react'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import { Popconfirm, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { userAPI } from '../../services/UserServices'
import { articleAPI } from '../../services/ArticlesService'

import cl from './article.module.scss'

const Article = () => {
  const { slug } = useParams()
  const { data: article, isLoading, isError } = articleAPI.useGetArticleQuery(slug)
  const { data: user } = userAPI.useGetUserQuery('')
  const [deleteArticle, { isSuccess }] = articleAPI.useDeleteArticleMutation()

  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) navigate('/')
  }, [isSuccess])

  const confirm = () => {
    deleteArticle(slug)
  }

  if (isLoading) {
    return (
      <div className={cl.loading}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 64 }} spin />} />
      </div>
    )
  }

  if (isError) {
    return <div className={cl.error}>Loading error</div>
  }

  if (article) {
    const { username: authorName, image } = article.article.author
    const { title, tagList, description, createdAt, body } = article.article

    return (
      <div className={cl.article}>
        <div className={cl.author}>
          <div className={cl.avatar}>
            <img src={image} alt="avatar" />
          </div>
          <div className={cl.username}>{authorName}</div>
          <div className={cl.date}>{format(new Date(createdAt), 'MMMM d, y')}</div>
        </div>
        {user?.user.username === authorName && (
          <div className={cl.buttons}>
            <Popconfirm
              placement="rightTop"
              title="Are you sure to delete this article?"
              okText="Yes"
              cancelText="No"
              onConfirm={confirm}
            >
              <button className={cl.delete}>Delete</button>
            </Popconfirm>

            <Link to={`/articles/${slug}/edit`} replace>
              <button className={cl.edit}>Edit</button>
            </Link>
          </div>
        )}
        <div className={cl.title}>{title}</div>
        <div className={cl.tags}>
          {tagList.map((el: any) => {
            return (
              <div className={cl.tag} key={el.slug}>
                {el}
              </div>
            )
          })}
        </div>
        <div className={cl.description}>{description}</div>
        <div className={cl.body}>
          <ReactMarkdown className={cl.markdown} remarkPlugins={[remarkGfm, remarkMath]}>
            {body}
          </ReactMarkdown>
        </div>
      </div>
    )
  }

  return <div className={cl['not-found']}>Article was not found</div>
}

export default Article
