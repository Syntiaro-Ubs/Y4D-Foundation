import React, { useState, useEffect } from "react";
import { API_BASE, UPLOADS_BASE } from "../../config/api";
import { mediaService } from "../../api/services/media.service";
import { useApi } from "../../hooks/useApi";
import { useLoadingState } from "../../hooks/useLoadingState";
import logger from "../../utils/logger";
import toast from "../../utils/toast";
import confirmDialog from "../../utils/confirmDialog";
import RichTextToolbar from "../Common/RichTextToolbar";
import RichTextEditor from "../Common/RichTextEditor";

const MediaManager = ({ mediaType, onClose }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    publish_type: "immediate",
    is_published: true,
    tags: [],
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [blogImagePreviews, setBlogImagePreviews] = useState([]); // For blogs
  const [blogSelectedFiles, setBlogSelectedFiles] = useState([]); // For new uploads
  const [existingBlogImages, setExistingBlogImages] = useState([]); // For existing items
  const [publishOptions, setPublishOptions] = useState("immediate");

  // Use useApi hook for fetching items
  const { data: items = [], loading, error, refetch: fetchItems } = useApi(
    () => mediaService.getMediaByType(mediaType),
    [mediaType],
    { defaultData: [] }
  );

  // Use useLoadingState for form submission
  const { loading: isSubmitting, execute } = useLoadingState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      (mediaType === "stories" || mediaType === "blogs") &&
      !formData.content?.replace(/<(.|\n)*?>/g, "").trim()
    ) {
      toast.error("Content is required");
      return;
    }

    await execute(async () => {
      try {
        const formDataToSend = new FormData();

        // Add all form data
        Object.keys(formData).forEach((key) => {
          if (key === "image" && formData.image) {
            // For image uploads (stories, events, documentaries)
            if (mediaType !== 'blogs') {
              formDataToSend.append("image", formData.image);
            }
          } else if (key === "file" && formData.file) {
            // For file uploads (newsletters)
            formDataToSend.append("file", formData.file);
          } else if (key === "tags") {
            // Handle tags specifically
            if (Array.isArray(formData.tags) && formData.tags.length > 0) {
              formDataToSend.append(key, JSON.stringify(formData.tags));
            } else {
              formDataToSend.append(key, "[]");
            }
          } else if (key === "image" && mediaType === 'blogs') {
            // Skip, handled below
          } else {
            formDataToSend.append(key, formData[key]);
          }
        });

        // Special handling for blogs multiple images
        if (mediaType === 'blogs') {
          blogSelectedFiles.forEach(file => {
            formDataToSend.append("image", file);
          });
          if (editingItem) {
            formDataToSend.append("existing_images", JSON.stringify(existingBlogImages));
          }
        }

        // Handle publish options
        formDataToSend.append("publish_type", publishOptions);

        if (publishOptions === "schedule") {
          formDataToSend.append("scheduled_date", formData.scheduled_date || "");
          formDataToSend.append("is_published", "false");
        } else {
          formDataToSend.append("is_published", "true");
        }

        const adminRegion = localStorage.getItem("adminRegion");
        if (adminRegion) {
          formDataToSend.append("region", adminRegion);
        }

        if (editingItem) {
          await mediaService.updateMedia(mediaType, editingItem.id, formDataToSend);
        } else {
          await mediaService.createMedia(mediaType, formDataToSend);
        }

        setEditingItem(null);
        setFormData({ publish_type: "immediate", is_published: true, tags: [] });
        setImagePreview(null);
        setBlogImagePreviews([]);
        setBlogSelectedFiles([]);
        setExistingBlogImages([]);
        setPublishOptions("immediate");
        fetchItems();

        const message =
          publishOptions === "immediate"
            ? `${mediaType.slice(0, -1)} published successfully!`
            : `${mediaType.slice(0, -1)} scheduled for publication!`;

        toast.success(message);
      } catch (error) {
        logger.error(`Error saving ${mediaType}:`, error);
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.details ||
          "Failed to save. Please check console for details.";
        toast.error(errorMessage);
        throw error;
      }
    });
  };

  const handleEdit = (item) => {
    // Parse tags safely
    let parsedTags = [];
    if (item.tags) {
      try {
        parsedTags =
          typeof item.tags === "string" ? JSON.parse(item.tags) : item.tags;
        if (!Array.isArray(parsedTags)) {
          parsedTags = [parsedTags];
        }
      } catch (error) {
        logger.warn("Error parsing tags:", error);
        parsedTags = [];
      }
    }

    setEditingItem(item);
    setFormData({
      ...item,
      tags: parsedTags,
      publish_type: item.is_published ? "immediate" : "schedule",
    });
    setPublishOptions(item.is_published ? "immediate" : "schedule");
    
    if (mediaType === 'blogs') {
      let images = [];
      try {
        images = typeof item.image === 'string' ? JSON.parse(item.image) : item.image;
        if (!Array.isArray(images)) images = item.image ? [item.image] : [];
      } catch (e) {
        images = item.image ? [item.image] : [];
      }
      setExistingBlogImages(images);
      setBlogImagePreviews(images.map(img => `${UPLOADS_BASE}/media/blogs/${img}`));
      setBlogSelectedFiles([]);
    } else if (item.image) {
      setImagePreview(`${UPLOADS_BASE}/media/${mediaType}/${item.image}`);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDialog(
      `Are you sure you want to delete this ${mediaType.slice(0, -1)}?`,
      "Delete"
    );
    if (!confirmed) return;

    await execute(async () => {
      try {
        await mediaService.deleteMedia(mediaType, id);
        fetchItems();
        toast.success(`${mediaType.slice(0, -1)} deleted successfully!`);
      } catch (error) {
        logger.error(`Error deleting ${mediaType}:`, error);
        toast.error(`Error: ${error.response?.data?.error || "Failed to delete"}`);
        throw error;
      }
    });
  };

  const togglePublish = async (id, currentStatus) => {
    await execute(async () => {
      try {
        await mediaService.togglePublishStatus(mediaType, id, !currentStatus);
        fetchItems();
        toast.success(
          `${mediaType.slice(0, -1)} ${!currentStatus ? "published" : "unpublished"
          } successfully!`
        );
      } catch (error) {
        logger.error(`Error toggling publish status:`, error);
        toast.error(
          `Error: ${error.response?.data?.error || "Failed to update status"}`
        );
        throw error;
      }
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (mediaType === "blogs") {
      const newFiles = [...blogSelectedFiles, ...files];
      setBlogSelectedFiles(newFiles);

      // Create previews for new files
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBlogImagePreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    } else {
      const file = files[0];
      if (mediaType === "newsletters") {
        setFormData({ ...formData, file: file });
      } else {
        setFormData({ ...formData, image: file });
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  const removeBlogImage = (index) => {
    const totalExisting = existingBlogImages.length;
    if (index < totalExisting) {
      // It's an existing image
      const newExisting = [...existingBlogImages];
      newExisting.splice(index, 1);
      setExistingBlogImages(newExisting);
      
      const newPreviews = [...blogImagePreviews];
      newPreviews.splice(index, 1);
      setBlogImagePreviews(newPreviews);
    } else {
      // It's a newly selected file
      const fileIndex = index - totalExisting;
      const newFiles = [...blogSelectedFiles];
      newFiles.splice(fileIndex, 1);
      setBlogSelectedFiles(newFiles);

      const newPreviews = [...blogImagePreviews];
      newPreviews.splice(index, 1);
      setBlogImagePreviews(newPreviews);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, file: file });
  };

  const renderPublishOptions = () => (
    <div className="publish-options">
      <h4>Publish Options</h4>
      <div className="publish-radio-group">
        <label>
          <input
            type="radio"
            value="immediate"
            checked={publishOptions === "immediate"}
            onChange={(e) => setPublishOptions(e.target.value)}
          />
          Immediate Publish
        </label>
        <label>
          <input
            type="radio"
            value="schedule"
            checked={publishOptions === "schedule"}
            onChange={(e) => setPublishOptions(e.target.value)}
          />
          Schedule Publish
        </label>
      </div>

      {publishOptions === "schedule" && (
        <div className="form-group">
          <label>Schedule Date & Time:</label>
          <input
            type="datetime-local"
            value={formData.scheduled_date || ""}
            onChange={(e) =>
              setFormData({ ...formData, scheduled_date: e.target.value })
            }
            required={publishOptions === "schedule"}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>
      )}
    </div>
  );

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit} className="media-form">
        <h3>
          {editingItem ? "Edit" : "Add New"} {mediaType.slice(0, -1)}
        </h3>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={formData.title || ""}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        {mediaType !== "newsletters" && (
          <div className="form-group">
            <label>Description:</label>
            <RichTextToolbar
              fieldName="description"
              formState={formData}
              setFormState={setFormData}
              textareaId="media-description-textarea"
            />
            <textarea
              id="media-description-textarea"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="3"
            />
          </div>
        )}

        {(mediaType === "stories" || mediaType === "blogs") && (
          <div className="form-group">
            <label>Content:</label>
            <RichTextEditor
              value={formData.content}
              onChange={(html) =>
                setFormData({ ...formData, content: html })
              }
              placeholder="Write the story content here..."
            />
          </div>
        )}

        {mediaType === "newsletters" ? (
          <div className="form-group">
            <label>PDF File:</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              required={!editingItem}
            />
          </div>
        ) : (
          <div className="form-group">
            <label>{mediaType === 'blogs' ? 'Images:' : 'Image:'}</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              multiple={mediaType === 'blogs'}
            />
            {mediaType === 'blogs' ? (
              <div className="blog-images-preview-container">
                {blogImagePreviews.map((preview, idx) => (
                  <div key={idx} className="blog-image-preview-item">
                    <img src={preview} alt={`Preview ${idx}`} />
                    <button 
                      type="button" 
                      className="remove-image-btn"
                      onClick={() => removeBlogImage(idx)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )
            )}
          </div>
        )}

        {(mediaType === "stories" || mediaType === "blogs") && (
          <div className="form-group">
            <label>Author:</label>
            <input
              type="text"
              value={formData.author || ""}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              required
            />
          </div>
        )}

        {mediaType === "events" && (
          <>
            <div className="form-group">
              <label>Event Date:</label>
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Event Time:</label>
              <input
                type="time"
                value={formData.time || ""}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
          </>
        )}

        {mediaType === "blogs" && (
          <div className="form-group">
            <label>Tags (comma-separated):</label>
            <input
              type="text"
              value={
                Array.isArray(formData.tags)
                  ? formData.tags.join(", ")
                  : formData.tags || ""
              }
              onChange={(e) => {
                const tagsArray = e.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag !== "");
                setFormData({ ...formData, tags: tagsArray });
              }}
              placeholder="technology, education, development"
            />
            <small>Separate tags with commas</small>
          </div>
        )}

        {mediaType === "documentaries" && (
          <>
            <div className="form-group">
              <label>Video URL:</label>
              <input
                type="url"
                value={formData.video_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, video_url: e.target.value })
                }
                required
                placeholder="https://youtube.com/embed/..."
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>Published Date:</label>
          <input
            type="date"
            value={formData.published_date || ""}
            onChange={(e) =>
              setFormData({ ...formData, published_date: e.target.value })
            }
            required
          />
        </div>

        {renderPublishOptions()}

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : editingItem ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setFormData({
                publish_type: "immediate",
                is_published: true,
                tags: [],
              });
              setBlogImagePreviews([]);
              setBlogSelectedFiles([]);
              setExistingBlogImages([]);
              setPublishOptions("immediate");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="media-manager">
      <div className="media-header">
        <h2>
          {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} Management
        </h2>
        <button onClick={onClose} className="close-btn">
          ← Back
        </button>
      </div>

      {renderForm()}

      <div className="media-list">
        <h3>
          Existing {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
        </h3>
        {items.length === 0 ? (
          <p>No {mediaType} found</p>
        ) : (
          <div className="items-grid">
            {items.map((item) => (
              <div key={item.id} className="media-item">
                {item.image && (
                  <div className="item-image">
                    <img
                      src={`${API_BASE}/uploads/media/${mediaType}/${(() => {
                        if (mediaType === 'blogs') {
                          try {
                            const images = typeof item.image === 'string' ? JSON.parse(item.image) : item.image;
                            return Array.isArray(images) && images.length > 0 ? images[0] : (typeof item.image === 'string' && !item.image.startsWith('[') ? item.image : '');
                          } catch (e) {
                            return typeof item.image === 'string' && !item.image.startsWith('[') ? item.image : '';
                          }
                        }
                        return item.image;
                      })()}`}
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                )}
                <div className="item-content">
                  <h4>{item.title}</h4>
                  <p className="item-date">
                    {new Date(item.published_date).toLocaleDateString()}
                  </p>
                  <p
                    className={`status ${item.is_published ? "published" : "draft"
                      }`}
                  >
                    {item.is_published ? "Published" : "Draft"}
                    {!item.is_published &&
                      new Date(item.published_date) > new Date() &&
                      " (Scheduled)"}
                  </p>
                  <div className="item-actions">
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button
                      onClick={() => togglePublish(item.id, item.is_published)}
                    >
                      {item.is_published ? "Unpublish" : "Publish"}
                    </button>
                    <button onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaManager;
