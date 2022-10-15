import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { DropdownMenuData } from '../components/DropdownMenu';


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


export const propertyApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/x-www-form-urlencoded');
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getItemInfo: builder.mutation<ItemInfo, string>({
      query: (sn) => ({
        url: 'item',
        method: 'POST',
        body: `sn=${sn}`,
        validateStatus: (response, result) => result !== null
      })
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
        validateStatus: (response, result) => result.includes('Successfully')
      })
    })
  })
})


export const { useGetMembersQuery, useGetItemInfoMutation, useEditItemInfoMutation } = propertyApi;
