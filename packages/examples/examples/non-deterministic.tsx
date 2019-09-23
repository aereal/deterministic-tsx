import React from "react"

export const NonDeterministicComponent: React.SFC<{
  nameCallback: () => string;
}> = ({ nameCallback }) => <div onClick={() => {}}>hi {nameCallback()}</div>
