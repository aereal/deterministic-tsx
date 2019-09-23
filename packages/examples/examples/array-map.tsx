import React from "react"

interface Props {
  names: readonly string[];
}

export const ArrayMap = ({ names }: Props) => (
  <>
    {names.map(n => (
      <div />
    ))}
  </>
)
