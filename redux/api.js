import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';



const getToken = () => {
  return localStorage.getItem('LoggedUserToken');
};

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/' }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'users',
      providesTags: ['User'],
    }),
    getUser: builder.query({
      query: (id) => `users/fetchuser/${id}`,
    }),
    getSingleUser: builder.query({
      query: () => ({
        url: `users/getSingle`,
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })
    }),
    deleteUser: builder.mutation({
        query: (userId) => ({
          url: `users/deleteuser/${userId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['User'],
      }),
    addUser: builder.mutation({
      query:(user)=>({
        url: 'users',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ userId, updatedData }) => ({
        url: `users/updateuser/${userId}`,
        method: 'PUT', 
        body: updatedData,
      }),
      invalidatesTags: ['User'],
    }),
    logInUser: builder.mutation({
      query:(data)=>({
        url: 'users/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
  
});



export const {useGetSingleUserQuery, useGetUsersQuery, useGetUserQuery, useAddUserMutation,useDeleteUserMutation, useUpdateUserMutation, useLogInUserMutation } = usersApi;
