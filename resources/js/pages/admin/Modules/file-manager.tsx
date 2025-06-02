import { AppLayout } from '@layouts/app';
import { AdminContentLayout } from '@layouts/admin';
import { FileManagerList, FileManagerActions } from '@components/Modules/FileManager';
import { MakeDirPopUp } from '@components/Modules/FileManager/pop-up';

export default function FileManager(props) {
    const {
        directories,
        files
    } = props

    //TODO: Написать thunk для подгрузки вложенности
    //TODO: Обновление директории (название)
    //TODO: Перенос директории (Путь к ней (Drag & Drop? | Выпадающий список | попап с grid папками?))
    //TODO: Удаление директории

    //TODO: Добавление файла
    //TODO: Обновление информации файла
    //TODO: Перенос файла (Путь к нему (Drag & Drop? | Выпадающий список | попап с grid папками?))
    //TODO: Удаление файла

    //TODO: Бредкрамбс
    //TODO: Сайдбар
    //TODO: Навигация по стрелочкам (вернуться на уровень выше)
    //TODO: ОЧЕНЬ НА БУДУЩЕЕ!! Высчитывать количество файлов которые вместит в себе текущее разрешение экрана. Пагинация


    return (
        <AppLayout>
            <AdminContentLayout contentActions={<FileManagerActions/>}>
                <FileManagerList directories={directories} files={files}/>
                <MakeDirPopUp/>
            </AdminContentLayout>
        </AppLayout>
    );
}
