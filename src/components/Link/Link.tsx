import { Link as RouterLink, LinkProps } from "@tanstack/react-location"

type Props = Pick<LinkProps, 'to' | 'children' | 'onClick'>

export const Link = (props: Props) => (<RouterLink {...props} />)
