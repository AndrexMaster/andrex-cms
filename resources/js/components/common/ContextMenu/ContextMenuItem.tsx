import React from 'react';

interface ContextMenuItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
    'data-action': string;
    'data-hover-color'?: string;
    children: React.ReactNode;
}

export const ContextMenuItem: React.FC<ContextMenuItemProps> = ({ children, ...props }) => {
    return (
        <li {...props}>
            {children}
        </li>
    );
};

export const ContextMenuDivider: React.FC = () => {
    return <hr className="border-t border-gray-700 my-1 mx-2" />;
};
