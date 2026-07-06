import React, { useState, useEffect } from "react";
import { API_BASE, UPLOADS_BASE } from "../../config/api";
import { ourworkService } from "../../api/services/ourwork.service";
import { useApi } from "../../hooks/useApi";
import { useLoadingState } from "../../hooks/useLoadingState";
import toast from "../../utils/toast";
import logger from "../../utils/logger";
import confirmDialog from "../../utils/confirmDialog";
import "./OurWorkManagement.css";
import {
  canView,
  canCreate,
  canEdit,
  canDelete,
  canPublish,
} from "../../utils/permissions";

const OurWorkManagement = ({
  category,
  action,
  onClose,
  onActionChange,
  currentUser,
  onShowConfirmation,
  onHideConfirmation,
}) => {
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    image_url: "",
    video_url: "",
    additional_images: [],
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    is_active: true,
    display_order: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  // Use useApi hook for fetching items
  const { data: items = [], loading, refetch: fetchItems } = useApi(
    () => {
      if (!category || (action !== "view" && action !== "update")) {
        return Promise.resolve([]);
      }
      return ourworkService.getItemsByCategory(category);
    },
    [category, action],
    { defaultData: [], immediate: !!(category && (action === "view" || action === "update")) }
  );

  // Use useLoadingState for form submission
  const { loading: submitting, execute } = useLoadingState();

  // Permissions
  const canUserPerformAction = (actionType) => {
    if (!currentUser) return false;
    if (currentUser.role === "super_admin") return true;

    switch (actionType) {
      case "view":
        return canView(currentUser, "interventions", category);
      case "create":
        return canCreate(currentUser, "interventions", category);
      case "edit":
        return canEdit(currentUser, "interventions", category);
      case "delete":
        return canDelete(currentUser, "interventions", category);
      case "publish":
        return canPublish(currentUser, "interventions", category);
      default:
        return false;
    }
  };

  const categoryLabels = {
    quality_education: "Quality Education",
    livelihood: "Sustainable Livelihood",
    healthcare: "Healthcare",
    environment_sustainability: "Environment Sustainability",
    integrated_development: "Integrated Development Program (IDP)",
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl;
    if (imageUrl.startsWith("/uploads/")) {
      return `${API_BASE}${imageUrl}`;
    }
    return `${API_BASE}/uploads/our-work/${category}/${imageUrl}`;
  };

  // Items are automatically fetched via useApi hook
  // No need for manual fetchItems function

  // Save / Update Item
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canUserPerformAction(editingItem ? "edit" : "create")) {
      toast.warning("You don't have permission to perform this action");
      return;
    }

    setError("");

    await execute(async () => {
      try {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
          if (key === "additional_images") {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else if (key === "is_active") {
            formDataToSend.append(key, formData[key] ? "1" : "0");
          } else {
            formDataToSend.append(key, formData[key]);
          }
        });

        if (imageFile) {
          formDataToSend.append("image", imageFile);
        }

        const adminRegion = localStorage.getItem("adminRegion");
        if (adminRegion) {
          formDataToSend.append("region", adminRegion);
        }

        if (editingItem) {
          await ourworkService.updateItem(category, editingItem.id, formDataToSend);
        } else {
          await ourworkService.createItem(category, formDataToSend);
        }

        // Reset form
        resetForm();

        // Then change view and refresh items
        onActionChange("view");
        fetchItems();

        toast.success(`Item ${editingItem ? "updated" : "created"} successfully!`);
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || "Failed to save item";
        setError(errorMessage);
        toast.error(errorMessage);
        throw error;
      }
    });
  };

  // Edit Item
  const handleEdit = (item) => {
    if (!canUserPerformAction("edit")) {
      toast.warning("You don't have permission to edit items");
      return;
    }
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      content: item.content,
      image_url: item.image_url,
      video_url: item.video_url,
      additional_images: item.additional_images || [],
      meta_title: item.meta_title,
      meta_description: item.meta_description,
      meta_keywords: item.meta_keywords,
      is_active: item.is_active,
      display_order: item.display_order,
    });
    if (item.image_url) {
      setImagePreview(getImageUrl(item.image_url));
    }
    onActionChange("update");
  };

  // Delete Item
  const handleDelete = async (id) => {
    if (!canUserPerformAction("delete")) {
      toast.warning("You don't have permission to delete items");
      return;
    }

    await execute(async () => {
      try {
        await ourworkService.deleteItem(category, id);
        fetchItems();
        toast.success("Item deleted successfully!");
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to delete item");
        throw error;
      }
    });
  };

  // Toggle Status
  const toggleStatus = async (id, currentStatus) => {
    if (!canUserPerformAction("publish")) {
      toast.warning("You don't have permission to change item status");
      return;
    }

    await execute(async () => {
      try {
        await ourworkService.toggleItemStatus(category, id, !currentStatus);
        fetchItems();
        toast.success(`Item ${!currentStatus ? "activated" : "deactivated"
          } successfully!`);
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to update item status");
        throw error;
      }
    });
  };

  // Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      content: "",
      image_url: "",
      video_url: "",
      additional_images: [],
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      is_active: true,
      display_order: 0,
    });
    setImageFile(null);
    setImagePreview(null);
    setError("");
  };

  const cancelAction = () => {
    resetForm();
    onActionChange("view");
  };

  // Last modified info
  const renderLastModifiedInfo = (item) => {
    if (
      !currentUser ||
      (currentUser.role !== "admin" && currentUser.role !== "super_admin")
    ) {
      return null;
    }

    if (!item.last_modified_by_name && !item.last_modified_at) return null;

    return (
      <div className="last-modified-info admin-only">
        <small>
          Last modified by: <strong>{item.last_modified_by_name}</strong> •{" "}
          {item.last_modified_at
            ? new Date(item.last_modified_at).toLocaleDateString()
            : "Unknown date"}
        </small>
      </div>
    );
  };

  // Action buttons
  const renderItemActions = (item) => {
    const canEditItem = canUserPerformAction("edit");
    const canDeleteItem = canUserPerformAction("delete");
    const canPublishItem = canUserPerformAction("publish");

    if (!canEditItem && !canDeleteItem && !canPublishItem) {
      return (
        <div className="item-actions">
          <span className="view-only-badge">View Only</span>
        </div>
      );
    }

    // Handle status toggle with confirmation
    const handleToggleStatus = () => {
      if (onShowConfirmation) {
        onShowConfirmation(
          item.is_active ? "Deactivate Item" : "Activate Item",
          `Are you sure you want to ${item.is_active ? "deactivate" : "activate"
          } "${item.title}"?`,
          item.is_active ? "deactivate" : "activate",
          item.id,
          category,
          item.title,
          () => toggleStatus(item.id, item.is_active)
        );
      } else {
        // Fallback to confirmDialog utility
        (async () => {
          const confirmed = await confirmDialog(
            `Are you sure you want to ${item.is_active ? "deactivate" : "activate"
            } "${item.title}"?`,
            item.is_active ? "Deactivate Item" : "Activate Item"
          );
          if (confirmed) {
            toggleStatus(item.id, item.is_active);
          }
        })();
      }
    };

    // Handle delete with confirmation
    const handleDeleteClick = () => {
      if (onShowConfirmation) {
        onShowConfirmation(
          "Delete Item",
          `Are you sure you want to delete "${item.title}"? This action cannot be undone.`,
          "delete",
          item.id,
          category,
          item.title,
          () => handleDelete(item.id)
        );
      } else {
        // Fallback to confirmDialog utility
        (async () => {
          const confirmed = await confirmDialog(
            `Are you sure you want to delete "${item.title}"? This action cannot be undone.`,
            "Delete Item"
          );
          if (confirmed) {
            handleDelete(item.id);
          }
        })();
      }
    };

    return (
      <div className="item-actions">
        {canPublishItem && (
          <button
            className={`btn-status ${item.is_active ? "btn-deactivate" : "btn-activate"
              }`}
            onClick={handleToggleStatus}
          >
            {item.is_active ? "Deactivate" : "Activate"}
          </button>
        )}

        {canEditItem && (
          <button className="btn-edit" onClick={() => handleEdit(item)}>
            Edit
          </button>
        )}

        {canDeleteItem && (
          <button className="btn-delete" onClick={handleDeleteClick}>
            Delete
          </button>
        )}
      </div>
    );
  };

  // VIEW MODE
  const renderViewMode = () => {
    if (loading) return <div className="loading">Loading...</div>;

    return (
      <div className="our-work-manager">
        <div className="our-work-header">
          <div className="header-left">
            <h2>View {categoryLabels[category]}</h2>
          </div>

          <div className="header-right">
            {canUserPerformAction("create") && (
              <button
                onClick={() => onActionChange("add")}
                className="btn-primary"
              >
                + Add New Item
              </button>
            )}

            <button onClick={onClose} className="btn-back-right">
              ← Back to Interventions
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="our-work-list">
          <h3>Existing Items ({items.length})</h3>

          {items.length === 0 ? (
            <div className="no-items">
              <p>No items found for {categoryLabels[category]}</p>
            </div>
          ) : (
            <div className="items-grid">
              {items.map((item) => {
                const imageUrl = getImageUrl(item.image_url);
                return (
                  <div key={item.id} className="item-card">
                    {imageUrl ? (
                      <div className="item-image">
                        <img
                          src={imageUrl}
                          alt={item.title || "No title"}
                          onError={(e) => {
                            logger.error("Image failed to load:", imageUrl);
                            e.target.style.display = "none";
                            const placeholder = document.createElement("div");
                            placeholder.className = "image-placeholder";
                            placeholder.innerHTML = "📷 Image not available";
                            e.target.parentNode.appendChild(placeholder);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="image-placeholder">📷 No image</div>
                    )}

                    <div className="item-content">
                      <h4>{item.title || "Untitled"}</h4>
                      <p className="item-description">
                        {item.description || "No description"}
                      </p>

                      <div className="item-meta">
                        <span
                          className={`status ${item.is_active ? "active" : "inactive"
                            }`}
                        >
                          {item.is_active ? "Active" : "Inactive"}
                        </span>

                        <span className="order">
                          Order: {item.display_order || 0}
                        </span>
                      </div>

                      {renderLastModifiedInfo(item)}
                      {renderItemActions(item)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // FORM MODE
  const renderFormMode = () => {
    return (
      <div className="our-work-manager">
        <div className="our-work-header">
          <div className="header-left">
            <h2>
              {editingItem ? "Edit" : "Add New"} {categoryLabels[category]}
            </h2>
          </div>

          <div className="header-right">
            <button onClick={cancelAction} className="btn-back-right">
              ← Back to View {categoryLabels[category]}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="our-work-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="3"
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Content:</label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows="6"
              placeholder="Detailed content (HTML supported)"
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Image URL:</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Or Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={submitting}
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Video URL:</label>
            <input
              type="url"
              value={formData.video_url}
              onChange={(e) =>
                setFormData({ ...formData, video_url: e.target.value })
              }
              placeholder="https://youtube.com/embed/video-id"
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Status:</label>
            <select
              value={formData.is_active ? "true" : "false"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_active: e.target.value === "true",
                })
              }
              disabled={submitting}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={submitting}
              className={submitting ? "btn-submitting" : "btn-primary"}
            >
              {submitting ? (
                <>
                  <span className="spinner"></span> Saving...
                </>
              ) : editingItem ? (
                "Update Item"
              ) : (
                "Create Item"
              )}
            </button>

            <button type="button" onClick={cancelAction} disabled={submitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  if (action === "view") return renderViewMode();
  if (action === "add" || action === "update") return renderFormMode();

  return null;
};

export default OurWorkManagement;
