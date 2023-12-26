import { Pagination, Rate, Spin } from 'antd'
import { useState } from 'react'
import { format } from 'date-fns'
import { HeartFilled, HeartOutlined, LoadingOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

import { articleAPI } from '../../services/ArticlesService'
import { IArticle } from '../../store/type'

import cl from './articles-list.module.scss'

const ArticlesList = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data, isSuccess, isLoading, isError } = articleAPI.useGetAllArticlesQuery((currentPage - 1) * 5)
  const [favoriteArticle] = articleAPI.useFavoriteArticleMutation()
  const [unFavoriteArticle] = articleAPI.useUnFavoriteArticleMutation()
  const token = localStorage.getItem('token')

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

  if (isSuccess) {
    const { articles, articlesCount } = data
    return (
      <div className={cl.articles}>
        {articles.slice(0, 5).map((item: IArticle) => {
          const { username, image } = item.author
          const { title, tagList, description, createdAt, favoritesCount, favorited, slug } = item

          return (
            <Link to={`/article/${item.slug}`} key={item.slug}>
              <div className={cl.article}>
                <div className={cl.title}>
                  <p>{title}</p>
                  <div className={cl.rating} onClick={(e) => e.preventDefault()}>
                    <Rate
                      disabled={!token}
                      character={favorited ? <HeartFilled /> : <HeartOutlined />}
                      count={1}
                      value={favorited ? 1 : 0}
                      onChange={() => (favorited ? unFavoriteArticle(slug) : favoriteArticle(slug))}
                    />
                    {favoritesCount}
                  </div>
                </div>
                <div className={cl.tags}>
                  {tagList.map((el, index) => {
                    return (
                      <div className={cl.tag} key={index}>
                        {el}
                      </div>
                    )
                  })}
                </div>
                <div className={cl.description}>{description}</div>
                <div className={`${cl.author}`}>
                  <div className={cl.username}>{username}</div>
                  <div className={cl.avatar}>
                    <img src={image} alt="avatar"></img>
                  </div>
                  <div className={cl.date}>{format(new Date(createdAt), 'MMMM d, yyyy')}</div>
                </div>
              </div>
            </Link>
          )
        })}
        <Pagination
          current={currentPage}
          total={articlesCount}
          className={cl.pagination}
          defaultPageSize={5}
          showSizeChanger={false}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    )
  }

  return <div className={cl['not-found']}>Articles not found</div>
}

export default ArticlesList
