import { useId, useState } from 'react'

export function ExpandableText({
  text = '',
  previewLines = 5,
  className = '',
  style = {},
  buttonClassName = '',
  buttonStyle = {},
  moreLabel = 'More Info',
  lessLabel = 'Show Less',
}) {
  const [expanded, setExpanded] = useState(false)
  const contentId = useId()

  return (
    <div>
      <p
        id={contentId}
        className={className}
        style={{
          ...style,
          display: expanded ? 'block' : '-webkit-box',
          WebkitBoxOrient: expanded ? undefined : 'vertical',
          WebkitLineClamp: expanded ? undefined : previewLines,
          overflow: 'hidden',
        }}
      >
        {text}
      </p>

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded((current) => !current)}
        className={buttonClassName}
        style={buttonStyle}
      >
        {expanded ? lessLabel : moreLabel}
      </button>
    </div>
  )
}
