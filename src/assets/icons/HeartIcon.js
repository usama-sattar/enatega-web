import { SvgIcon, useTheme } from "@mui/material";
import * as React from "react"

function HeartIcon(props) {
  const theme = useTheme();
  return (
    <SvgIcon
      className="prefix__fl-brand-primary"
      width={24}
      height={24}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      data-testid="favorite-entry-not-active"
      {...props}
      style={{ color: theme.palette.primary.main }}
    >
      <path
        d="M18.338 4.438c2.764 1.316 4.015 4.757 2.795 7.686-1.548 3.243-4.436 5.835-8.665 7.776-.254.114-.543.13-.807.05l-.13-.05c-4.228-1.94-7.116-4.533-8.664-7.776-1.22-2.93.031-6.37 2.795-7.686 1.89-.9 3.826-.315 5.378.855.112.084.246.195.403.333l.286.257a.4.4 0 00.542 0l.315-.283c.145-.125.27-.228.374-.307 1.555-1.171 3.49-1.754 5.378-.855zm-.644 1.355c-1.178-.56-2.506-.3-3.831.699l-.151.12c-.115.096-.258.222-.427.376-.207.19-.553.467-1.038.83a.4.4 0 01-.487-.007 99.836 99.836 0 00-.909-.708l-.13-.11-.158-.143a7.024 7.024 0 00-.426-.36c-1.323-.997-2.652-1.258-3.83-.697-2.032.966-2.972 3.553-2.086 5.685 1.335 2.798 3.822 5.087 7.52 6.863l.259.122.259-.121c3.561-1.711 5.998-3.895 7.34-6.493l.149-.301c.888-2.133.034-4.627-1.867-5.66l-.187-.095z"
        fillRule="evenodd"
      />
    </SvgIcon>
  )
}

export default HeartIcon