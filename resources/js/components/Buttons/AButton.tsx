import { Button } from '@headlessui/react';
import { JSX, ReactNode, useEffect, useMemo } from 'react';
import { Link } from '@inertiajs/react';

interface ButtonInterface {
    className?: string;
    startIcon?: ReactNode | JSX;
    endIcon?: ReactNode | JSX;
    title?: string;
    children?: string;
    onClick?: () => void;
    variant?: 'filled' | 'outlined' | 'text' | 'iconButton';
    color?: 'primary' | 'warning' | 'danger' | 'info' | 'success' | 'error';
    type?: 'file' | 'submit' | 'button' | 'link';
    href?: string
    disabled?: boolean
}

export const AButton = (props: ButtonInterface) => {
    const {
        className,
        startIcon = null,
        endIcon = null,
        title,
        children,
        onClick,
        color = 'primary',
        variant = 'outlined',
        type = 'button',
        href,
        disabled = false
    } = props;

    const colorBasedStyle = useMemo(() => {
        switch (color) {
            case 'warning':
                return ''
            default:
                if (variant === 'iconButton') {
                    return 'hover:bg-stone-50/10'
                } else {
                    return 'background-white'
                    // return 'border-white background-white'
                }

        }
    }, [color, variant]);

    const getVariantBasedStyles = useMemo(() => {
        switch (variant) {
            case 'outlined':
                return 'border-1 border-solid background-white';
            case 'iconButton':
                return 'hover:'
            case 'text':
                return 'border-none'
        }
    }, [color]);

    const buttonClasses = useMemo(() => {
        let classes = `flex items-center px-2 justify-center gap-1 rounded-md transition hover:bg-white/10 ${colorBasedStyle} ${getVariantBasedStyles}`;

        if (children) {
            classes += ' py-1'
            // if (endIcon) classes += ' pl-2 pr-1';
            // if (startIcon) classes += ' pl-1 pr-2';
            if (!endIcon && !startIcon) classes += ' px-2'
        } else {
            classes += ' p-1'
        }
        if (disabled) {
            classes += ' cursor-not-allowed opacity-[50%]'
        } else {
            classes += ' cursor-pointer'
        }
        if (className?.length > 0) classes += ` ${className}`

        return classes;
    }, [className, startIcon, endIcon, colorBasedStyle, getVariantBasedStyles, disabled]);

    switch (type) {
        case 'link':
            return (
                <Link
                    className={buttonClasses}
                    title={title}
                    href={href}
                >
                    {startIcon && <span className="inline-flex">{startIcon}</span>}
                    {children ?? ''}
                    {endIcon && <span className="inline-flex">{endIcon}</span>}
                </Link>
            );
        default:
            return (
                <Button
                    className={buttonClasses}
                    onClick={() => onClick && !disabled ? onClick() : null}
                    title={title}
                    type={type}
                    disabled={disabled}
                >
                    {startIcon && <span className="inline-flex">{startIcon}</span>}
                    {children ?? ''}
                    {endIcon && <span className="inline-flex">{endIcon}</span>}
                </Button>
            );
    }
};
