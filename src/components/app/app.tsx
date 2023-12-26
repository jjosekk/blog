import { Routes, Route } from 'react-router-dom'

import ArticlesList from '../articles-list/articles-list'
import Header from '../header/header'
import Article from '../article/article'
import RegistrationPage from '../registration-page/registration-page'
import LoginPage from '../login-page/login-page'
import EditProfile from '../edit-profile/edit-profile'
import NewArticle from '../new-article/new-article'
import PrivateRoute from '../../utils/privateRoute'
import EditArticle from '../editArticle/editArticle'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<ArticlesList />} />
          <Route path="article" element={<Article />} />
          <Route path="article/:slug" element={<Article />} />
          <Route path="profile" element={<EditProfile />} />
          <Route path="sign-in" element={<LoginPage />} />
          <Route path="sign-up" element={<RegistrationPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="new-article" element={<NewArticle />} />
            <Route path="articles/:slug/edit" element={<EditArticle />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
