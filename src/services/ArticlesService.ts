import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'

export const articleAPI = createApi({
  reducerPath: 'articleAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://blog.kata.academy/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Articles', 'Article'],

  endpoints: (build) => ({
    getAllArticles: build.query({
      query: (page) => ({
        url: '/articles',
        params: {
          offset: page,
        },
      }),
      providesTags: () => ['Articles'],
    }),

    getArticle: build.query({
      query: (slug) => ({
        url: `/articles/${slug}`,
      }),
      providesTags: () => ['Article'],
    }),

    addArticle: build.mutation({
      query: (data) => ({
        url: '/articles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Articles'],
    }),

    editArticle: build.mutation({
      query: (data) => ({
        url: `/articles/${data.article.slug}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Articles', 'Article'],
    }),

    deleteArticle: build.mutation({
      query: (slug) => ({
        url: `/articles/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Articles'],
    }),

    favoriteArticle: build.mutation({
      query: (slug) => ({
        url: `/articles/${slug}/favorite`,
        method: 'POST',
      }),
      invalidatesTags: ['Articles'],
    }),

    unFavoriteArticle: build.mutation({
      query: (slug) => ({
        url: `/articles/${slug}/favorite`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Articles'],
    }),
  }),
})
