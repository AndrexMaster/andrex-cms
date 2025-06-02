export interface DefaultFieldProps {
    title: string;
    defaultValue?: string | number;
    placeholder: string;
    type?: 'text';
    className?: string;
    disabled?: boolean;
    onChange?: (e) => void;
    onFocus?: (e) => void;
    onBlur?: (e) => void;
}
