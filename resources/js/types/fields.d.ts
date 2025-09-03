export interface DefaultFieldProps<Type> {
    title: string;
    defaultValue?: string | number;
    placeholder: string;
    type?: Type;
    className?: string;
    disabled?: boolean;
    onChange?: (value) => void;
    onFocus?: (value) => void;
    onBlur?: (value) => void;
    name?: string;
    required?: boolean;
}
