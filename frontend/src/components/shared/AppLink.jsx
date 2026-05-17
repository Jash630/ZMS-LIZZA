import { useNavigation } from '../../context/NavigationContext.jsx'

export function AppLink({ page, id = null, className, style, children, onClick, ...props }) {
  const { navigateTo, hrefFor } = useNavigation()
  const href = hrefFor(page, id)

  return (
    <a
      {...props}
      href={href}
      className={className}
      style={style}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === '_blank') return
        event.preventDefault()
        navigateTo(page, id)
      }}
    >
      {children}
    </a>
  )
}
