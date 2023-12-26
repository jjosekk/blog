import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { articleAPI } from '../services/ArticlesService'
import { userAPI } from '../services/UserServices'

const rootReducer = combineReducers({
  [userAPI.reducerPath]: userAPI.reducer,
  [articleAPI.reducerPath]: articleAPI.reducer,
})

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userAPI.middleware, articleAPI.middleware),
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
