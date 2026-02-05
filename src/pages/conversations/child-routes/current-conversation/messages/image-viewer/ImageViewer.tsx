import type { SetStateAction } from "react";
import styles from "./ImageViewer.module.css";

interface ImageViewerProps {
    currentImageDialogRef: React.RefObject<HTMLDialogElement | null>;
    currentImage: string | undefined;
    setCurrentImage: React.Dispatch<SetStateAction<string | undefined>>;
};

const ImageViewer = ({
    currentImageDialogRef,
    currentImage,
    setCurrentImage
}: ImageViewerProps) => {
    return <dialog
        ref={currentImageDialogRef}
        className={styles["image-visualizer"]}
    >
        <img
            className={styles["current-image"]}
            src={currentImage}
            alt="Current image"
        />
        <button
            className={styles["close-dialog"]}
            onClick={() => setCurrentImage(undefined)}
        >
            <span className="material-symbols-rounded">
                close
            </span>
        </button>
    </dialog>
}

export default ImageViewer;
