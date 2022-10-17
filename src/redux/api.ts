import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { DropdownMenuData } from '../components/DropdownMenu';
import { addEditItemResult, updateLastEditItemResult, toggleSlide } from "./uiSlice";


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

type MembersResponse = {[key: string]: MemberGroup};

type ItemInfo = {[key: string]: string};

interface EditItemArgs {
  sn: string;
  oeid: string;
}


export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/x-www-form-urlencoded');
      return headers;
    }
  }),
  tagTypes: ['Item', 'FETCH_ERROR'],
  endpoints: (builder) => ({
    getItemInfo: builder.query<ItemInfo, string>({
      query: (sn) => ({
        url: 'item',
        method: 'POST',
        body: `sn=${sn}`,
        validateStatus: (response, result) => result !== null
      }),
      providesTags: (result, error, arg) => error ? ['FETCH_ERROR'] : [{type: 'Item', id: arg}],
      async onCacheEntryAdded(_, { dispatch}) {
        dispatch(toggleSlide(true));
      }
    }),
    getMembers: builder.query<DropdownMenuData[], void>({
      query: () => ({
        url: 'members',
        responseHandler: (response) => response.text()
      }),
      transformResponse: (response: string) => {
        const membersResponse: MembersResponse = JSON.parse(response.replace('<!DOCTYPE html>', ''));
        return Object.values(membersResponse).map(group => ({
          key: group.tid,
          name: group.teamname,
          value: group.member.map(member => ({
            key: member.eid,
            name: member.truename,
            value: member
          }))
        }));
      }
    }),
    editItemInfo: builder.mutation<string, EditItemArgs>({
      query: (args) => ({
        url: 'item_edit',
        method: 'POST',
        body: `action=save&sn=${args.sn}&oeid=${args.oeid}`,
        responseHandler: (response) => response.text(),
        validateStatus: (response, result) => result.includes('Successfully'),
      }),
      invalidatesTags: (result, error, arg) => error ? [] : [{type: 'Item', id: arg.sn}],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        dispatch(addEditItemResult({state: 'LOADING', sn: arg.sn}));
        let isSuccess = false;
        try {
          await queryFulfilled;
          isSuccess = true;
        } catch {}
        dispatch(updateLastEditItemResult(isSuccess ? 'SUCCESS' : 'ERROR'));
      },
    })
  })
})


export const { useGetMembersQuery, useGetItemInfoQuery, useEditItemInfoMutation } = api;
