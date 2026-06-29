const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const ALLOWED_PDF_TYPES = ["application/pdf"];

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

function createFileFilter({ allowPdf = false, allowVideo = false } = {}) {
  return (req, file, cb) => {
    const allowed = [...ALLOWED_IMAGE_TYPES];
    if (allowPdf) allowed.push(...ALLOWED_PDF_TYPES);
    if (allowVideo) allowed.push(...ALLOWED_VIDEO_TYPES);

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}`), false);
    }
  };
}

const imageFileFilter = createFileFilter();
const imageAndPdfFileFilter = createFileFilter({ allowPdf: true });
const imageAndVideoFileFilter = createFileFilter({ allowVideo: true });

const IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const PDF_MAX_SIZE = 10 * 1024 * 1024;

module.exports = {
  createFileFilter,
  imageFileFilter,
  imageAndPdfFileFilter,
  imageAndVideoFileFilter,
  IMAGE_MAX_SIZE,
  PDF_MAX_SIZE,
};
