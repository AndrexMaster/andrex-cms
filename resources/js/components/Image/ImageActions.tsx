import { AButton } from '@components/Buttons';
import { Settings, Trash2 } from 'lucide-react';

interface ImageActionsProps {
    className?: string;
}

export const ImageActions = (props: ImageActionsProps) => {
    const {
        className
    } = props;

    return (
        <div className={className ?? 'flex flex-row gap-2 items-center justify-start'}>
            <AButton endIcon={<Settings size={22}/>} variant={'iconButton'} className={'text-sm'} />
            <AButton endIcon={<Trash2 size={22}/>} variant={'iconButton'} className={'text-sm'} />
        </div>
    )
}
