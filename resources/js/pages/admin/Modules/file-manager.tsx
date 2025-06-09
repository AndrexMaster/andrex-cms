import { AppLayout } from '@layouts/app';
import { AdminContentLayout } from '@layouts/admin';
import { FileManagerList, FileManagerActions } from '@components/Modules/FileManager';
import { MakeDirPopUp } from '@components/Modules/FileManager/pop-up';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchFileManagerDirectory, getBreadcrumbs } from '@store/thunks/Modules';
import { useEffect, useMemo } from 'react';
import { UpdateDirPopUp } from '@components/Modules/FileManager/pop-up/UpdateDirPopUp';

export default function FileManager(props) {
    const {
        directory: mainDirectory
    } = props

    const { breadcrumbs, nodeToUpdate } = useAppSelector(state => state.fileManager);
    const dispatch = useAppDispatch();

    //TODO: Перенос директории (Путь к ней (Drag & Drop? | Выпадающий список | попап с grid папками?))
    //TODO: Удаление директории

    //TODO: Добавление файла
    //TODO: Обновление информации файла
    //TODO: Перенос файла (Путь к нему (Drag & Drop? | Выпадающий список | попап с grid папками?))
    //TODO: Удаление файла

    //TODO: Сайдбар
    //TODO: Навигация по стрелочкам (вернуться на уровень выше)
    //TODO: ОЧЕНЬ НА БУДУЩЕЕ!! Высчитывать количество файлов которые вместит в себе текущее разрешение экрана.
    //TODO: Пагинация

    const customBreadcrumbAction = (breadcrumbId) => {
        dispatch(fetchFileManagerDirectory(breadcrumbId))
    }

    return (
        <AppLayout>
            <AdminContentLayout
                breadcrumbs={breadcrumbs}
                customBreadcrumbAction={customBreadcrumbAction}
                customBreadcrumbHeadingAction={customBreadcrumbAction}
                contentActions={<FileManagerActions/>}
            >
                <FileManagerList mainDirectory={mainDirectory}/>
                <MakeDirPopUp/>
                {nodeToUpdate && (
                    <UpdateDirPopUp/>
                )}
            </AdminContentLayout>
        </AppLayout>
    );
}
