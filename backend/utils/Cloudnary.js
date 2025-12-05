const cloudinary = require('cloudinary').v2;
require('dotenv').config()
const fs = require('fs').promises;
const path = require('path');

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    cloud_name: process.env.CLOUD_NAME
});

const uploadPDF = async (file) => {
    try {
        const pdf = await cloudinary.uploader.upload(file, {
            folder: 'artists'
        })
        return { pdf: pdf.secure_url, public_id: pdf.public_id }
    } catch (error) {
        console.error(error)
        throw new Error('Failed to upload PDF');
    }
}

const uploadPDFTwo = async (file) => {
    try {
        const pdf = await cloudinary.uploader.upload(file)
        return pdf.secure_url
    } catch (error) {
        console.log(error)
    }
}

// const uploadImage = async (file) => {
//     console.log('file',file)
//     try {
//         const result = await cloudinary.uploader.upload(file, {
//             folder: "artists"
//         });
//         return { image: result.secure_url, public_id: result.public_id };
//     } catch (error) {
//         console.error(error);
//         throw new Error('Failed to upload Image');
//     }
// };

const uploadImage = async (filePath) => {
    try {
        // console.log('Attempting to upload file at:', filePath);

        // Ensure file exists before upload
        if (await fs.access(filePath).then(() => true).catch(() => false)) {
            const result = await cloudinary.uploader.upload(filePath, {
                folder: "artists"
            });
            // console.log('Upload successful:', result.secure_url);
            return { image: result.secure_url, public_id: result.public_id };
        } else {
            // console.error('File not found at:', filePath);
            throw new Error('File does not exist for upload');
        }
    } catch (error) {
        console.error('Error during image upload:', error);
        throw new Error('Failed to upload Image');
    }
};

const uploadVideo = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: "artists",
            resource_type: "video"
        });
        // return result.secure_url;
        return {video:result.secure_url, public_id:result.public_id}
    } catch (error) {
        console.error(error);
        throw new Error('Failed to upload video');
    }
};

const deleteVideoFromCloudinary = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id)
    } catch (error) {
        console.error("Error deleting Video from Cloudinary:",error)
        throw new Error('Failed to delete video from Cloudinary');
    }
}

const deleteImageFromCloudinary = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
        console.log("Image Deleted");
    } catch (error) {
        console.error("Error deleting Image from Cloudinary", error);
        throw new Error('Failed to delete Image from Cloudinary');
    }
};

const deletePdfFromCloudinary = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
        console.log('Image Deleted')
    } catch (error) {
        console.error('Error in deleting PDF from Cloudinary', error)
        throw new Error('Failed to delete Pdf fron the Cloudinary')
    }
}

// Upload Voice Note to Cloudinary
const uploadVoiceNote = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: "voice-notes",           // Store in 'voice-notes' folder
            resource_type: "video",          // Audio files treated as 'video' in Cloudinary
            public_id: `voice_${Date.now()}`, // Unique file name with timestamp
            format: "mp3"                    // Force mp3 format
        });

        return { url: result.secure_url, public_id: result.public_id };
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error('Failed to upload voice note');
    }
};


// Delete Voice Note from Cloudinary
const deleteVoiceNoteFromCloudinary = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
        console.log("Voice note deleted");
    } catch (error) {
        console.error("Error deleting voice note from Cloudinary", error);
        throw new Error('Failed to delete voice note from Cloudinary');
    }
};

// const uploadPDF = async (filePath) => {
//     try {
//         const result = await cloudinary.uploader.upload(filePath, {
//             resource_type: 'raw', // Important: Specify that the resource is raw (for non-image files)
//             eager: [{ width: 300, height: 300, crop: 'fit' }]
//         });
//         return {
//             pdf: result.secure_url, // URL to access the PDF
//             public_id: result.public_id
//         };
//     } catch (error) {
//         throw new Error('Failed to upload PDF: ' + error.message);
//     }
// };

module.exports = {
    uploadImage, deleteVideoFromCloudinary, uploadVideo, uploadVoiceNote, deleteVoiceNoteFromCloudinary, deleteImageFromCloudinary, uploadPDF, deletePdfFromCloudinary, uploadPDFTwo
};