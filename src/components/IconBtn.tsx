const IconBtn = ({
  children,
  className,
  onClick,
  tooltip,
}: {
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
  tooltip: string
}) => {
  return (
    <button
      className={`tooltip rounded-full p-2 hover:bg-zinc-600 ${
        className ? className : "tooltip-bottom"
      }`}
      onClick={onClick}
      data-tip={tooltip}
    >
      {children}
    </button>
  )
}
export default IconBtn
