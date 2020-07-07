import React from 'react';
import Button from '@material-ui/core/Button';
import {
    DropzoneDialogBase,
    DropzoneDialogBaseProps,
    FileObject,
} from 'material-ui-dropzone';

interface DropzoneProps extends DropzoneDialogBaseProps {
    onBtnClick: React.ComponentProps<typeof Button>['onClick'];
}

export function useDropzone() {
    const [open, setOpen] = React.useState(false);
    const [files, setFiles] = React.useState<FileObject[]>([]);

    const toggleDropzone = React.useCallback(function toggleDropzone(
        value: boolean
    ) {
        return () => {
            setOpen(value);
        };
    },
    []);

    const removeFile = React.useCallback(function removeField<File>(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _file?: File
    ) {
        setFiles([]);
    }, []);

    return { files, open, removeFile, setFiles, setOpen, toggleDropzone };
}

export default function Dropzone({ onBtnClick, ...props }: DropzoneProps) {
    return (
        <>
            <Button variant="contained" color="primary" onClick={onBtnClick}>
                Change Image
            </Button>
            <DropzoneDialogBase
                filesLimit={1}
                acceptedFiles={['image/*']}
                cancelButtonText="cancel"
                submitButtonText="submit"
                dropzoneText="Drag and drop an image here or click"
                onAlert={(message, variant) =>
                    console.log(`${variant}: ${message}`)
                }
                previewGridProps={{ item: { xs: 8 } }}
                {...props}
            />
        </>
    );
}
