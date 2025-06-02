import { useState, useEffect } from 'react';

/**
 * Хук `useDebounce` для откладывания обновления значения.
 *
 * @param value Значение, которое нужно "дебounced".
 * @param delay Задержка в миллисекундах, после которой значение будет обновлено.
 * @returns Отложенное (debounced) значение.
 */
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => {
                clearTimeout(handler);
            };
        },
        [value, delay]
    );

    return debouncedValue;
}

export default useDebounce;
