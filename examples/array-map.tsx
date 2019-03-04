import React from "react"

interface Props {
  names: ReadonlyArray<string>
}

export const ArrayMap = ({ names }: Props) => (
  <>
    {names.map(n => (
      <div />
    ))}
  </>
)
