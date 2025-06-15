import { ImageContainer } from '@components/Image';
import React, { Ref, useEffect, useRef, useState } from 'react';
import { AButton } from '@components/Buttons';
import { Upload } from 'lucide-react';
import { useAppDispatch } from '@store/hooks'; // Assuming this import is correct

interface AddImageProps {
    variant?: 'button' | 'block';
    handleUploadFile: (file: File[]) => void,
    fileInputRef?: Ref<HTMLInputElement>,
}

interface SelectedFileItem {
    file: File;
    previewUrl: string;
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
        if (selectedFiles.length > 0) {
            handleUploadFile(selectedFiles.map(item => item.file));
        }

        return () => {
            selectedFiles.forEach(item => {
                if (item?.previewUrl) {
                    URL.revokeObjectURL(item.previewUrl);
                }
            });
        };
    }, [selectedFiles]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage('');

        if (event.target.files && event.target.files.length > 0) {
            const newFiles = Array.from(event.target.files);

            selectedFiles.forEach(item => {
                if (item?.previewUrl) {
                    URL.revokeObjectURL(item.previewUrl);
                }
            });

            const filesWithPreviews: SelectedFileItem[] = newFiles.map((file: File) => ({
                file: file,
                previewUrl: URL.createObjectURL(file),
            }));

            setSelectedFiles(filesWithPreviews); // Заменяем текущие файлы на новые выбранные

            event.target.value = '';

        } else {
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
