import type { AnchorHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant
}

function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  const classes = ['btn', `btn--${variant}`]
  if (className) classes.push(className)
  return <a className={classes.join(' ')} {...rest} />
}

export default Button