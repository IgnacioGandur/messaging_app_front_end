import toast from "react-hot-toast";
import supabase from "../supabase/supabase";

export default async function uploadFileToSupabase(
    file: File,
    bucketName: string,
    baseFilePath: string
): Promise<string> {
    const filePath = `${baseFilePath}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

    if (error) {
        console.error("Supabase error:", error);
        toast.error("We are not able to upload your file at this moment, sorry...");
        throw "Supabase error.";
    } else {
        const fileData = supabase
            .storage
            .from(bucketName)
            .getPublicUrl(data.path);

        return fileData.data.publicUrl;
    }
};
