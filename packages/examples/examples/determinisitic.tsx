import React from "react"

export const DeterministicComponent: React.SFC<{
  name: string;
}> = ({ name }) => <div>Hi {name}</div>
