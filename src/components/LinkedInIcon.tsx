/** Official LinkedIn "In" bug (white), used per the LinkedIn Brand Guidelines: unmodified, original aspect ratio. */
export function LinkedInIcon({
  size = 16,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <img
      src="/InBug-White.png"
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={`inline-block shrink-0 object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
