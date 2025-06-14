import { ImageContainer } from '@components/Image';
import React, { Ref, useEffect, useRef, useState } from 'react';
import { AButton } from '@components/Buttons';
import { Upload } from 'lucide-react';
import { useAppDispatch } from '@store/hooks'; // Assuming this import is correct

interface AddImageProps {
    variant?: 'button' | 'block';
    handleUploadFile: (file: File[]) => void, // Prop ожидает массив File[]
    fileInputRef?: Ref<HTMLInputElement>,
}

interface SelectedFileItem {
    file: File;
    previewUrl: string;
    // position?: number; // Это поле не используется в текущей логике, можно оставить, если оно нужно для других целей
}

export const ContextFileUpload = (props: AddImageProps) => {
    const {
        variant = 'button',
        handleUploadFile,
        fileInputRef,
    } = props;

    const [selectedFiles, setSelectedFiles] = useState<SelectedFileItem[]>([]);
    const [message, setMessage] = useState(''); // Для сообщений, если нужно

    useEffect(() => {
        // --- КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: Передаем только сами объекты File ---
        if (selectedFiles.length > 0) { // Передаем данные только если есть выбранные файлы
            handleUploadFile(selectedFiles.map(item => item.file));
        }
        // --- КОНЕЦ ИСПРАВЛЕНИЯ ---

        // Функция очистки Object URL для предотвращения утечек памяти
        return () => {
            selectedFiles.forEach(item => {
                if (item?.previewUrl) {
                    URL.revokeObjectURL(item.previewUrl);
                }
            });
        };
    }, [selectedFiles, handleUploadFile]); // handleUploadFile добавлен в зависимости useEffect

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(''); // Сброс сообщения

        if (event.target.files && event.target.files.length > 0) {
            const newFiles = Array.from(event.target.files);

            // Отзываем предыдущие URL-ы для выбранных файлов перед добавлением новых
            selectedFiles.forEach(item => {
                if (item?.previewUrl) {
                    URL.revokeObjectURL(item.previewUrl);
                }
            });

            // Создаем новые SelectedFileItem с предварительными URL
            const filesWithPreviews: SelectedFileItem[] = newFiles.map((file: File) => ({
                file: file,
                previewUrl: URL.createObjectURL(file),
                // position: (selectedFiles ? selectedFiles.length : 0) + index + 1 // Если нужно, добавьте index
            }));

            // Обновляем состояние: если нет предыдущих, устанавливаем новые; иначе добавляем к существующим
            // В вашем исходном коде логика `if (!selectedFiles || selectedFiles.length <= 0)`
            // не совсем корректна, так как `selectedFiles` всегда массив.
            // Я предположил, что вы хотите заменить текущие файлы, если это новый выбор,
            // или добавить к ним, если это мульти-выбор. Исправленная логика:
            setSelectedFiles(filesWithPreviews); // Заменяем текущие файлы на новые выбранные

            // ВАЖНО: Сбрасываем значение input, чтобы событие onChange сработало,
            // даже если пользователь выберет те же самые файлы повторно.
            event.target.value = '';

        } else {
            // Если файлы не выбраны (например, пользователь закрыл диалог выбора файла без выбора)
            selectedFiles.forEach(item => {
                if (item.previewUrl) {
                    URL.revokeObjectURL(item.previewUrl);
                }
            });
            setSelectedFiles([]);
        }
    };

    switch (variant) {
        case 'block':
            return (
                <ImageContainer>
                    <Upload/>
                </ImageContainer>
            )
        case 'button':
            return (
                <div>
                    <input
                        type={'file'}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple={true}
                        style={{ display: 'none' }}
                    />
                </div>
            )
        default:
            return null;
    }
}
