interface ChipProps {
    title: string;
    className?: string;
}

/**
 * UI Chip.
 * @returns {ReactNode}
 * @param {ChipProps} props
 */

export const Chip = (props: ChipProps) => {
  const {
      title,
      className = '',
  } = props;
    return (
        <span
            className={`flex text-[10px] bg-[#FFFFFF17] p-1 rounded-sm w-fit ${className}`}>
            {title}
        </span>
    )
}
