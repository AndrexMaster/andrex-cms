import React, { useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { clsx } from 'clsx';

interface ContextMenuProps {
    isOpen: boolean;
    x: number;
    y: number;
    data: any;
    onClose: () => void;
    onAction: (action: string, data: any) => void;
    children?: React.ReactNode;
    color?: 'error' | 'warning';
}

export const ContextMenu: React.FC<ContextMenuProps> = (props) => {
    const {
        isOpen,
        x,
        y,
        data,
        onClose,
        onAction,
        children,
        color,
    } = props;
    const menuRef = useRef<HTMLDivElement>(null);

    const getColor = useMemo(() => {
        switch (color) {
            case 'error':
                return '[#F00]/10'
            case 'warning':
                return '[#F00]/10'
            default:
                return 'white/10'
        }
    }, [color])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
            window.addEventListener('scroll', onClose);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            window.removeEventListener('scroll', onClose);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            window.removeEventListener('scroll', onClose);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return ReactDOM.createPortal(
        <div
            ref={menuRef}
            className={clsx(
                "absolute index-[9999]",
                "bg-[#222] border border-[#555]",
                "rounded-md shadow-lg",
                "p-1 min-w-[150px]",
                "text-gray-200 text-sm"
            )}
            style={{
                top: y,
                left: x,
            }}
        >
            <ul className="list-none p-0 m-0">
                {React.Children.map(children, child => {
                    if (React.isValidElement(child) && !Array.isArray(child?.props?.children)) {
                        return React.cloneElement(child, {
                            onClick: () => {
                                const action = (child.props as any)['data-action'];
                                if (action) {
                                    onAction(action, data);
                                }
                                onClose();
                            },
                            className: clsx(
                                "py-2 px-3 cursor-pointer rounded-sm",
                                `hover:bg-white/10`,
                                // TODO: Сделать возможность принимать кастомные цвета
                                // `hover:bg-${(child.props as any)['data-hover-color'] ?? 'white/10'}`,
                                (child.props as any).className
                            )
                        });
                    }
                    return child;
                })}
            </ul>
        </div>,
        document.body
    );
};
