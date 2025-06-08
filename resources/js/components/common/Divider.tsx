interface DividerProps {
    color?: string;
    orientation?: 'horizontal' | 'vertical';
}

export const Divider = (props: DividerProps) => {
    const {
        color = '#ac8fd1',
        orientation = 'horizontal'
    } = props
    if (orientation === 'vertical') {
        return (
            <div className={`
                m-0 my-2
                flex-shrink-0
                border-0 border-solid border-gray-200
                border-r border-b-0
                self-stretch
                h-auto
                bg-${color}
                `}>
            </div>
        )
    }

    return (
        <hr/>
    )
}
