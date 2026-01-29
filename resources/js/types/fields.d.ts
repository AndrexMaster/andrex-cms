export interface DefaultFieldProps<Type> {
    title: string;
    defaultValue?: string | number;
    placeholder: string;
    type?: Type;
    className?: string;
    disabled?: boolean;
    onChange?: (value: Type extends 'text' ? string : any) => void;
    onFocus?: (value: any) => void;
    onBlur?: (value: any) => void;
    name?: string;
    required?: boolean;
}