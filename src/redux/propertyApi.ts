import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


interface Member {
  eid: string;
  truename: string;
  supervisor: boolean;
}

interface MemberGroup {
  tid: string;
  teamname: string;
  member: Member[];
}

type MembersResponse = {[key: string]: MemberGroup}

type ItemInfo = {[key: string]: string}


export const propertyApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL,
    prepareHeaders: (headers) => {
      headers.set('authorization', `auth_token ${process.env.API_TOKEN}`);
      headers.set('Content-Type', 'application/x-www-form-urlencoded');
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getItemInfo: builder.query<ItemInfo, string>({
      query: (sn) => ({
        url: 'item',
        method: 'POST',
        body: `sn=${sn}`,
        validateStatus: (response, result) => result !== null
      })
    }),
    getMembers: builder.query<MembersResponse, void>({
      query: () => ({
        url: 'members',
        responseHandler: (response) => response.text()
      }),
      transformResponse: (response: string) => {
        return JSON.parse(response.replace('<!DOCTYPE html>', ''));
      }
    })
  })
})


export const { useGetMembersQuery, useGetItemInfoQuery } = propertyApi;
