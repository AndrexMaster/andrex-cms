import { ImageContainer } from '@components/Image';
import React, { useEffect, useRef, useState } from 'react';
import { AButton } from '@components/Buttons';
import { Upload } from 'lucide-react';
import { useAppDispatch } from '@store/hooks';

interface AddImageProps {
    variant?: 'button' | 'block';
    handleUploadFile: (file: File[]) => void
}

interface SelectedFileItem {
    file: File;
    previewUrl: string;
}

export const FileUpload = (props: AddImageProps) => {
    const {
        variant = 'button',
        handleUploadFile
    } = props;

    const [selectedFiles, setSelectedFiles] = useState<SelectedFileItem[]>([]);
    const [message, setMessage] = useState('');


    const fileInputRef = useRef<HTMLInputElement | null>(null)


    const uploadFiles = (uploadedFiles) => {
        console.log(uploadedFiles);
    }

    useEffect(() => {
        handleUploadFile(selectedFiles)
        return () => {
            selectedFiles.forEach(item => URL.revokeObjectURL(item.previewUrl));
        };
    }, [selectedFiles]);

    useEffect(() => {
        console.log('selectedFiles 2', selectedFiles);
    }, [selectedFiles]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage('');

        if (event.target.files && event.target.files.length > 0) {
            const newFiles = Array.from(event.target.files);

            selectedFiles?.forEach(item => URL.revokeObjectURL(item?.previewUrl));

            // TODO: Не передавать файл в редакс а сразу выгружать в бекенд и возвращать ссылку. Инструкция в конце текущего файла
            const filesWithPreviews: SelectedFileItem[] = newFiles.map((file: File, index) => ({
                file: file,
                previewUrl: URL.createObjectURL(file),
                position: selectedFiles?.length + index + 1
            }));

            if (!selectedFiles || selectedFiles.length <= 0) {
                setSelectedFiles(filesWithPreviews);
            } else {
                setSelectedFiles(prevState => [...prevState, ...filesWithPreviews]);
            }

        } else {
            selectedFiles.forEach(item => URL.revokeObjectURL(item.previewUrl));
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
                    <AButton
                        startIcon={<Upload size={16}/>}
                        className={'text-md'}
                        onClick={() => {
                            if (fileInputRef.current) {
                                fileInputRef.current.click();
                            }
                        }}
                    >
                        Upload File
                    </AButton>
                    <input
                        type={'file'}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple={true}
                        style={{ display: 'none' }}
                    />
                </div>
            )
    }
}


// Я настоятельно рекомендую следовать Сценарию A. Это стандартный и наиболее эффективный подход:
//
//     Файлы загружаются сразу при выборе. Это обеспечивает лучший пользовательский опыт, так как пользователь видит, что файл обрабатывается немедленно, и не нужно ждать загрузки всех файлов при финальном сохранении продукта.
//     Redux хранит только сериализуемые ссылки. Это соответствует принципам Redux и позволяет использовать все преимущества DevTools.
//     API для продукта принимает только ссылки. Ваш бэкенд не должен беспокоиться о приеме бинарных данных при обновлении продукта; он просто обрабатывает ссылки на уже загруженные ресурсы.
//
//     Пошаговая логика для Сценария A:
//
//     Пользователь выбирает изображение (или несколько изображений):
// input type="file" срабатывает onChange.
//     Получаете File объект(ы).
//
//     Асинхронная загрузка файла на сервер:
//     Используйте FormData для отправки файла на специальный эндпоинт загрузки файлов на вашем сервере (например, /api/upload-image).
// Отображайте индикатор загрузки для пользователя.
//     На бэкенде: Сервер получает файл, сохраняет его в файловой системе или облачном хранилище, и возвращает клиенту URL-адрес и/или уникальный ID этого файла (и, возможно, другие метаданные, такие как размер, оригинальное имя).
//
// Обновление Redux-состояния:
// Как только вы получили ответ от сервера (URL/ID), диспатчите экшен (например, product/addImageReference) с сериализуемой информацией об изображении.
//     Ваш редьюсер добавляет эту информацию (URL, ID, имя, позицию) в массив photos в Redux-состоянии продукта.
//
//     Удаление изображений (если нужно):
// Если пользователь удаляет изображение из списка, диспатчите экшен (product/removeImageReference), который удаляет соответствующую ссылку из Redux-состояния.
//     Возможно, вы также захотите отправить запрос на сервер для удаления файла из хранилища, чтобы не загромождать его неиспользуемыми файлами.
//
//     Сохранение продукта:
//     Когда пользователь нажимает "Сохранить", собираете все данные продукта из Redux-состояния, включая массив URL-адресов/ID изображений.
//     Отправляете один запрос POST или PUT к вашему API продукта (например, /api/products/product_123) с полным объектом продукта, который включает ссылки на фото.
//     На бэкенде: Сервер получает этот запрос, обновляет данные продукта в базе данных и связывает с ним ссылки на изображения.
