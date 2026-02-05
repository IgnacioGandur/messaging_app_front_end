import styles from "./DeleteMessageDialog.module.css";

interface DeleteMessageDialogProps {
    dialogRef: React.RefObject<HTMLDialogElement | null>;
    toggleDeleteDialog: () => void;
    handleMessageDeletion: (id: number) => void;
    targetMessage: number;
}

const DeleteMessageDialog = ({
    dialogRef,
    toggleDeleteDialog,
    handleMessageDeletion,
    targetMessage
}: DeleteMessageDialogProps) => {
    return <dialog
        className={styles["delete-message-dialog"]}
        ref={dialogRef}
    >
        <div className={styles.wrapper}>
            <div className={styles["icon-wrapper"]}>
                <span className={`material-symbols-rounded ${styles.icon}`}>
                    bomb
                </span>
            </div>
            <h2>Warning</h2>
            <p>
                Are you sure you want to delete this message?
            </p>
            <div className={styles.buttons}>
                <button
                    className={styles.cancel}
                    onClick={toggleDeleteDialog}
                >
                    Close modal
                </button>
                <button
                    onClick={() => {
                        handleMessageDeletion(targetMessage);
                        toggleDeleteDialog();
                    }}
                    className={styles.accept}
                >
                    Delete
                </button>
            </div>
            <button
                onClick={toggleDeleteDialog}
                className={styles.close}
            >
                <span className="material-symbols-rounded">
                    close
                </span>
            </button>
        </div>
    </dialog>
}

export default DeleteMessageDialog;
