import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { DropdownMenuData } from '../components/DropdownMenu';


export interface Member {
  eid: string;
  truename: string;
  supervisor: boolean;
}

interface MemberTeam {
  tid: string;
  teamname: string;
  member: Member[];
}

type MembersResponse = { [key: string]: MemberTeam };

type ItemInfo = {[key: string]: string};

type EditItemArgs = {
  sn: string,
  oeid: string,
  note?: string
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
      transformResponse: (response: ItemInfo) => {
        const { truename, note, ...others } = response;
        return {
          truename, note, ...others
        }
      }
    }),
    getMembers: builder.query<DropdownMenuData[], void>({
      query: () => ({
        url: 'members',
        responseHandler: (response) => response.text()
      }),
      transformResponse: (response: string) => {
        const membersResponse: MembersResponse = JSON.parse(response.replace('<!DOCTYPE html>', ''));
        return Object.values(membersResponse).map(team => ({
          key: team.tid,
          name: team.teamname,
          value: team.member.map(member => ({
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
        body: `action=save&sn=${args.sn}&oeid=${args.oeid}${args.note ? '&note=' + args.note : ''}`,
        responseHandler: (response) => response.text(),
        validateStatus: (response, result) => result.includes('Successfully'),
      }),
      invalidatesTags: (result, error, arg) => error ? [] : [{type: 'Item', id: arg.sn}]
    })
  })
})


export const { useGetMembersQuery, useGetItemInfoQuery, useEditItemInfoMutation } = api;
