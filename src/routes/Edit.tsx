import React from "react";

import { useGetMembersQuery } from "../redux/propertyApi";


export default function Edit(): JSX.Element {
  const { data: MembersData, error, isLoading } = useGetMembersQuery(undefined);

  return <div>
    {error ? (
      <>Error fetching</>
    ) : isLoading ? (
      <>Loading...</>
    ) : MembersData ? (
      Object.values(MembersData).map(group => <div key={group.tid}>
        <div>{group.teamname}</div>
        <div>{group.member.map(member => member.truename).join(', ')}</div>
      </div>)
    ) : null}
  </div>
}
