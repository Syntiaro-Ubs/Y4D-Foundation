import React, { useState, useEffect } from "react";
import { API_BASE, UPLOADS_BASE } from "../../config/api";
import { partnersService } from "../../api/services/partners.service";
import logger from "../../utils/logger";
import toast from "../../utils/toast";
import {
  canView,
  canCreate,
  canEdit,
  canDelete,
  canPublish,
} from "../../utils/permissions";

const PartnerManagement = ({
  action,
  onClose,
  onActionChange,
  currentUser,
  onShowConfirmation,
  onHideConfirmation,
}) => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    logo: null,
    region: "global",
    carousel_line: "line1",
    display_order: 0,
    is_active: true,
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [error, setError] = useState("");
  const [filterRegion, setFilterRegion] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Permission check functions
  const canUserPerformAction = (actionType) => {
    if (!currentUser) return false;
    if (currentUser.role === "super_admin") return true;

    switch (actionType) {
      case "view":
        return canView(currentUser, "partners");
      case "create":
        return canCreate(currentUser, "partners");
      case "edit":
        return canEdit(currentUser, "partners");
      case "delete":
        return canDelete(currentUser, "partners");
      case "publish":
        return canPublish(currentUser, "partners");
      default:
        return false;
    }
  };

  useEffect(() => {
    if (action === "view") {
      fetchPartners();
    }
  }, [action]);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      // Pass filterRegion to service if needed, or query all and filter on frontend.
      // The backend accepts a region query param: /api/partners?region=xxx
      const data = await partnersService.getPartners("global");
      setPartners(data || []);
    } catch (error) {
      logger.error("Error fetching partners:", error);
      setError("Failed to fetch partners");
      toast.error(`Error fetching partners: ${error.message}`);
    }
    setLoading(false);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canUserPerformAction(editingItem ? "edit" : "create")) {
      toast.warning("You don't have permission to perform this action");
      return;
    }

    if (!editingItem && !formData.logo) {
      toast.error("Logo image file is required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("region", formData.region);
      formDataToSend.append("carousel_line", formData.carousel_line);
      formDataToSend.append("display_order", formData.display_order);
      formDataToSend.append("is_active", formData.is_active ? "true" : "false");
      
      if (formData.logo) {
        formDataToSend.append("logo", formData.logo);
      }

      if (editingItem) {
        await partnersService.updatePartner(editingItem.id, formDataToSend);
      } else {
        await partnersService.createPartner(formDataToSend);
      }

      resetForm();
      onActionChange("view");
      fetchPartners();
      toast.success(
        `Partner ${editingItem ? "updated" : "created"} successfully!`
      );
    } catch (error) {
      logger.error("Error saving partner:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.details ||
        "Failed to save partner";
      setError(errorMessage);
      toast.error(`Error saving partner: ${errorMessage}`);
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    if (!canUserPerformAction("edit")) {
      toast.warning("You don't have permission to edit partners");
      return;
    }
    setEditingItem(item);
    setFormData({
      name: item.name,
      logo: null,
      region: item.region || "global",
      carousel_line: item.carousel_line || "line1",
      display_order: item.display_order || 0,
      is_active: item.is_active === 1 || item.is_active === true || item.is_active === "true",
    });
    if (item.logo) {
      setLogoPreview(`${API_BASE}/uploads/partners/${item.logo}`);
    }
    onActionChange("update");
  };

  const handleDelete = async (id) => {
    if (!canUserPerformAction("delete")) {
      toast.warning("You don't have permission to delete partners");
      return;
    }

    setLoading(true);
    try {
      await partnersService.deletePartner(id);
      fetchPartners();
      toast.success("Partner deleted successfully!");
    } catch (error) {
      logger.error("Error deleting partner:", error);
      toast.error(`Error deleting partner: ${error.message}`);
    }
    setLoading(false);
  };

  const toggleStatus = async (id, currentStatus) => {
    if (!canUserPerformAction("publish")) {
      toast.warning("You don't have permission to change partner status");
      return;
    }

    setLoading(true);
    try {
      await partnersService.togglePartnerStatus(id, !currentStatus);
      fetchPartners();
      toast.success(
        `Partner ${!currentStatus ? "activated" : "deactivated"} successfully!`
      );
    } catch (error) {
      logger.error("Error toggling partner status:", error);
      toast.error(`Error updating partner status: ${error.message}`);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      logo: null,
      region: "global",
      carousel_line: "line1",
      display_order: 0,
      is_active: true,
    });
    setLogoPreview(null);
    setError("");
  };

  const cancelAction = () => {
    resetForm();
    onActionChange("view");
  };

  // Filter partners based on search query
  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItemActions = (item) => {
    const canEditItem = canUserPerformAction("edit");
    const canDeleteItem = canUserPerformAction("delete");
    const canPublishItem = canUserPerformAction("publish");
    const isActive = item.is_active === 1 || item.is_active === true || item.is_active === "true";

    if (!canEditItem && !canDeleteItem && !canPublishItem) {
      return (
        <div className="item-actions">
          <span className="view-only-badge">View Only</span>
        </div>
      );
    }

    return (
      <div className="item-actions">
        {canPublishItem && (
          <button
            className={`status-toggle-btn ${isActive ? "btn-inactive" : "btn-active"}`}
            onClick={() => {
              onShowConfirmation(
                isActive ? "Deactivate Partner" : "Activate Partner",
                `Are you sure you want to ${isActive ? "deactivate" : "activate"} "${item.name}"?`,
                isActive ? "deactivate" : "activate",
                item.id,
                "partners",
                item.name,
                () => toggleStatus(item.id, isActive)
              );
            }}
            disabled={loading}
          >
            {isActive ? "Deactivate" : "Activate"}
          </button>
        )}

        {canEditItem && (
          <button
            className="btn-edit"
            onClick={() => handleEdit(item)}
            disabled={loading}
          >
            Edit
          </button>
        )}

        {canDeleteItem && (
          <button
            className="btn-delete"
            onClick={() => {
              onShowConfirmation(
                "Delete Partner",
                `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
                "delete",
                item.id,
                "partners",
                item.name,
                () => handleDelete(item.id)
              );
            }}
            disabled={loading}
          >
            Delete
          </button>
        )}
      </div>
    );
  };

  const renderViewMode = () => {
    if (loading && partners.length === 0) return <div className="loading">Loading...</div>;

    return (
      <div className="accreditation-management">
        <div className="accreditation-header">
          <h2>Partners Management</h2>
          {canUserPerformAction("create") && (
            <button
              onClick={() => {
                resetForm();
                onActionChange("add");
              }}
              className="btn-primary"
              disabled={loading}
            >
              + Add New Partner
            </button>
          )}
        </div>

        <div className="filter-search-container" style={{ display: "flex", gap: "15px", margin: "15px 0", flexWrap: "wrap" }}>
          <div className="search-box" style={{ flex: "1", minWidth: "200px" }}>
            <input
              type="text"
              placeholder="Search partner by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="accreditation-list">
          {filteredPartners.length === 0 ? (
            <div className="no-items">
              <p>No partners found</p>
              <p>
                <small>
                  Click "Add New Partner" to upload your first partner logo.
                </small>
              </p>
            </div>
          ) : (
            <div className="items-grid">
              {filteredPartners.map((item) => {
                const isActive =
                  item.is_active === true ||
                  item.is_active === 1 ||
                  item.is_active === "true";

                return (
                  <div
                    key={item.id}
                    className="item-card"
                    style={{
                      borderLeft: `4px solid ${isActive ? "#4CAF50" : "#ff9800"}`,
                    }}
                  >
                    {item.logo && (
                      <div className="item-image" style={{ background: "#f5f6f8", display: "flex", alignItems: "center", justifyContent: "center", height: "120px", padding: "10px" }}>
                        <img
                          src={`${API_BASE}/uploads/partners/${item.logo}`}
                          alt={item.name}
                          style={{ maxHeight: "100px", maxWidth: "100%", objectFit: "contain" }}
                          onError={(e) => {
                            // Fallback to static public path if server isn't serving it or local dev fallback
                            e.target.src = `/partners/${item.logo}`;
                          }}
                        />
                      </div>
                    )}
                    <div className="item-content" style={{ paddingTop: "10px" }}>
                      <div className="accreditation-header" style={{ marginBottom: "5px" }}>
                        <h4 style={{ margin: "0" }}>{item.name}</h4>
                        <span className={`status-badge ${isActive ? "active" : "inactive"}`}>
                          {isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </div>

                      <div className="item-meta" style={{ fontSize: "0.85em", color: "#555", margin: "10px 0" }}>
                        <p style={{ margin: "3px 0" }}>
                          <strong>Display Order:</strong> {item.display_order}
                        </p>
                      </div>

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

  const renderFormMode = () => {
    return (
      <div className="accreditation-management">
        <div className="accreditation-form-header">
          <div className="form-header-top">
            <button
              onClick={cancelAction}
              className="back-to-accreditations-btn"
            >
              <span className="back-arrow">←</span>
              <span>Back to Partners List</span>
            </button>
          </div>

          <div className="form-header-title">
            <h2>{editingItem ? "Edit" : "Add New"} Partner Logo</h2>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="accreditation-form">
          <div className="form-group">
            <label>Partner/Company Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Wema Foundation"
              required
            />
          </div>

          {/* Target Region and Carousel row line are auto-configured for global website partners */}

          <div className="form-row" style={{ display: "flex", gap: "20px" }}>
            <div className="form-group" style={{ flex: "1" }}>
              <label>Display Order (Numerical sequence):</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                }
                min="0"
              />
            </div>

            <div className="form-group" style={{ flex: "1" }}>
              <label>Active/Publish Status:</label>
              <select
                value={formData.is_active}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_active: e.target.value === "true",
                  })
                }
              >
                <option value={true}>Active (Visible)</option>
                <option value={false}>Inactive (Hidden)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Partner Logo Image File:</label>
            <input type="file" accept="image/*" onChange={handleLogoChange} required={!editingItem} />
            <small style={{ color: "#777", display: "block", marginTop: "5px" }}>
              Recommended: transparent background PNG files. Max size: 5MB.
            </small>
            {logoPreview && (
              <div className="image-preview" style={{ background: "#f5f6f8", display: "inline-flex", padding: "10px", marginTop: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
                <img src={logoPreview} alt="Logo preview" style={{ maxHeight: "80px", maxWidth: "200px", objectFit: "contain" }} />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading
                ? "Saving..."
                : editingItem
                  ? "Update Partner"
                  : "Create Partner"}
            </button>
            <button
              type="button"
              onClick={cancelAction}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  if (action === "view") {
    return renderViewMode();
  } else if (action === "add" || action === "update") {
    return renderFormMode();
  }

  return null;
};

export default PartnerManagement;
