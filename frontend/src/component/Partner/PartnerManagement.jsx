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
    display_order: 0,
    is_active: true,
    carousel_line: "line1",
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [error, setError] = useState("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const token = localStorage.getItem("token");

  // Selection handlers & bulk operations
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds(new Set());
  };

  const toggleSelectItem = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAllPartners = () => {
    if (selectedIds.size === partners.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(partners.map((p) => p.id)));
    }
  };

  const handleBulkStatusChange = async (isActive) => {
    if (selectedIds.size === 0) return;
    setLoading(true);
    try {
      const idsToUpdate = Array.from(selectedIds);
      await Promise.all(
        idsToUpdate.map((id) =>
          partnersService.togglePartnerStatus(id, isActive)
        )
      );
      setPartners(
        partners.map((p) =>
          selectedIds.has(p.id) ? { ...p, is_active: isActive } : p
        )
      );
      toast.success(
        `Successfully updated status for ${selectedIds.size} partner logos!`
      );
      setSelectedIds(new Set());
      setIsSelectionMode(false);
    } catch (error) {
      logger.error("Error bulk updating status:", error);
      toast.error(`Failed to update status for some partners: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setLoading(true);
    try {
      const idsToDelete = Array.from(selectedIds);
      await Promise.all(
        idsToDelete.map((id) => partnersService.deletePartner(id))
      );
      setPartners(partners.filter((p) => !selectedIds.has(p.id)));
      toast.success(`Successfully deleted ${selectedIds.size} partner logos!`);
      setSelectedIds(new Set());
      setIsSelectionMode(false);
    } catch (error) {
      logger.error("Error bulk deleting partners:", error);
      toast.error(`Failed to delete some partners: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const triggerBulkDeleteConfirm = () => {
    if (selectedIds.size === 0) return;
    onShowConfirmation(
      "Delete Selected Partners",
      `Are you sure you want to delete the ${selectedIds.size} selected partner logos? This action cannot be undone.`,
      "delete",
      null,
      "partners",
      `${selectedIds.size} Partners`,
      handleBulkDelete
    );
  };

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
    // Clear selection state on action change
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  }, [action]);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const adminRegion = localStorage.getItem("adminRegion") || "india";
      const data = await partnersService.getPartners(adminRegion);
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
      toast.warning("Partner logo is required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("display_order", formData.display_order);
      formDataToSend.append("is_active", formData.is_active ? "1" : "0");
      formDataToSend.append("carousel_line", formData.carousel_line);
      
      if (formData.logo) {
        formDataToSend.append("logo", formData.logo);
      }

      const adminRegion = localStorage.getItem("adminRegion") || "india";
      formDataToSend.append("region", adminRegion);

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
      name: item.name || "",
      logo: null,
      display_order: item.display_order || 0,
      is_active: item.is_active === 1 || item.is_active === true,
      carousel_line: item.carousel_line || "line1",
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
      toast.error(`Failed to delete partner: ${error.message}`);
    }
    setLoading(false);
  };

  const handleToggleStatus = async (item) => {
    if (!canUserPerformAction("edit")) {
      toast.warning("You don't have permission to edit partners");
      return;
    }
    const newStatus = !(item.is_active === 1 || item.is_active === true);
    try {
      await partnersService.togglePartnerStatus(item.id, newStatus);
      // Update local state directly to be fast
      setPartners(
        partners.map((p) =>
          p.id === item.id ? { ...p, is_active: newStatus } : p
        )
      );
      toast.success(
        `Partner status ${newStatus ? "activated" : "deactivated"} successfully!`
      );
    } catch (error) {
      logger.error("Error toggling partner status:", error);
      toast.error(`Failed to update partner status: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      logo: null,
      display_order: 0,
      is_active: true,
      carousel_line: "line1",
    });
    setLogoPreview(null);
    setEditingItem(null);
    setError("");
  };

  const cancelAction = () => {
    resetForm();
    onActionChange("view");
  };

  // Render actions for grid item
  const renderItemActions = (item) => {
    const canEditItem = canUserPerformAction("edit");
    const canDeleteItem = canUserPerformAction("delete");

    return (
      <div className="item-actions">
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
                `Are you sure you want to delete "${item.name || "this partner"}"? This action cannot be undone.`,
                "delete",
                item.id,
                "partners",
                item.name || "Partner",
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

  // Render View Mode
  const renderViewMode = () => {
    if (loading) return <div className="loading">Loading...</div>;

    return (
      <div className="accreditation-management">
        <div className="accreditation-header">
          <h2>Partners Logo Management</h2>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {partners.length > 0 && (
              <button
                onClick={toggleSelectionMode}
                className={isSelectionMode ? "btn-secondary" : "btn-primary"}
                style={{
                  backgroundColor: isSelectionMode ? "#6c757d" : "#4a90e2",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                {isSelectionMode ? "Cancel" : "Select"}
              </button>
            )}
            {!isSelectionMode && canUserPerformAction("create") && (
              <button
                onClick={() => {
                  resetForm();
                  onActionChange("add");
                }}
                className="btn-primary"
                disabled={loading}
              >
                + Add New Partner Logo
              </button>
            )}
          </div>
        </div>

        {isSelectionMode && (
          <div
            className="bulk-actions-bar"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px 20px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #e2e8f0",
              flexWrap: "wrap",
              gap: "15px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", margin: 0, fontWeight: "500" }}>
                <input
                  type="checkbox"
                  ref={el => { if (el) el.indeterminate = selectedIds.size > 0 && selectedIds.size < partners.length; }}
                  checked={partners.length > 0 && selectedIds.size === partners.length}
                  onChange={selectAllPartners}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                Select All
              </label>
              <span style={{ color: "#64748b", fontSize: "14px", fontWeight: "500" }}>
                {selectedIds.size} of {partners.length} selected
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleBulkStatusChange(true)}
                disabled={selectedIds.size === 0 || loading}
                style={{
                  backgroundColor: selectedIds.size === 0 ? "#cbd5e1" : "#10b981",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: selectedIds.size === 0 ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s",
                }}
              >
                Active
              </button>
              <button
                onClick={() => handleBulkStatusChange(false)}
                disabled={selectedIds.size === 0 || loading}
                style={{
                  backgroundColor: selectedIds.size === 0 ? "#cbd5e1" : "#f59e0b",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: selectedIds.size === 0 ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s",
                }}
              >
                Inactive
              </button>
              <button
                onClick={triggerBulkDeleteConfirm}
                disabled={selectedIds.size === 0 || loading}
                style={{
                  backgroundColor: selectedIds.size === 0 ? "#cbd5e1" : "#ef4444",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: selectedIds.size === 0 ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="accreditation-list">
          {partners.length === 0 ? (
            <div className="no-items">
              <p>No partner logos found</p>
              <p>
                <small>
                  Click "Add New Partner Logo" to upload your first partner logo.
                </small>
              </p>
            </div>
          ) : (
            <div className="items-grid">
              {partners.map((item) => {
                const isActive =
                  item.is_active === true ||
                  item.is_active === 1 ||
                  item.is_active === "true";

                const isSelected = selectedIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`item-card ${isSelectionMode ? "selection-mode-card" : ""} ${isSelected ? "selected-card" : ""}`}
                    onClick={isSelectionMode ? () => toggleSelectItem(item.id) : undefined}
                    style={{
                      borderLeft: `4px solid ${isActive ? "#4CAF50" : "#ff9800"}`,
                      position: "relative",
                      cursor: isSelectionMode ? "pointer" : "default",
                      boxShadow: isSelected ? "0 0 0 2px #4a90e2, 0 4px 12px rgba(74, 144, 226, 0.2)" : undefined,
                      transform: isSelected ? "translateY(-2px)" : undefined,
                      borderColor: isSelected ? "#4a90e2" : undefined,
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    {isSelectionMode && (
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          zIndex: 10,
                          backgroundColor: "white",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(item.id)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: "16px",
                            height: "16px",
                            margin: 0,
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    )}
                    {item.logo && (
                      <div className="item-image" style={{ height: "120px", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", background: "#f8f9fa" }}>
                        <img
                          src={`${API_BASE}/uploads/partners/${item.logo}`}
                          alt={item.name || "Partner Logo"}
                          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    <div className="item-content">
                      <div className="accreditation-header" style={{ marginBottom: "10px" }}>
                        <h4>{item.name || "Unnamed Partner"}</h4>
                        <span
                          className={`status-badge ${isActive ? "active" : "inactive"}`}
                          onClick={isSelectionMode ? undefined : () => handleToggleStatus(item)}
                          style={{ cursor: isSelectionMode ? "default" : "pointer" }}
                          title={isSelectionMode ? undefined : "Click to toggle status"}
                        >
                          {isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </div>

                      <div className="item-meta" style={{ marginBottom: "15px" }}>
                        <p>
                          <strong>Display Order:</strong> {item.display_order || 0}
                        </p>
                        <p>
                          <strong>Carousel Line:</strong> {item.carousel_line === 'line2' ? 'Line 2' : 'Line 1'}
                        </p>
                        <p>
                          <strong>Region:</strong> {item.region}
                        </p>
                      </div>

                      {!isSelectionMode && renderItemActions(item)}
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

  // Render Form Mode
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
              <span>Back to Partners</span>
            </button>
            <h3>{editingItem ? "Edit Partner Logo" : "Add Partner Logo"}</h3>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="accreditation-form">
          <div className="form-group">
            <label htmlFor="name">Partner Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter partner name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="logo">Logo Image</label>
            <input
              type="file"
              id="logo"
              onChange={handleLogoChange}
              accept="image/*"
              required={!editingItem}
            />
            <small className="form-text text-muted">
              Recommended: PNG format with transparent background (max 5MB).
            </small>

            {logoPreview && (
              <div className="image-preview" style={{ marginTop: "15px", maxWidth: "200px" }}>
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  style={{ width: "100%", height: "auto", border: "1px solid #ddd", padding: "5px", background: "#f8f9fa" }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="carousel_line">Carousel Line Position</label>
            <select
              id="carousel_line"
              value={formData.carousel_line}
              onChange={(e) => setFormData({ ...formData, carousel_line: e.target.value })}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
            >
              <option value="line1">Line 1 (Top Slider)</option>
              <option value="line2">Line 2 (Bottom Slider)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="display_order">Display Order</label>
            <input
              type="number"
              id="display_order"
              value={formData.display_order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  display_order: parseInt(e.target.value) || 0,
                })
              }
              placeholder="0"
              min="0"
            />
            <small className="form-text text-muted">
              Lower numbers will be displayed first.
            </small>
          </div>

          <div className="form-group checkbox-group" style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              style={{ width: "auto", margin: 0 }}
            />
            <label htmlFor="is_active" style={{ margin: 0 }}>Active</label>
          </div>

          <div className="form-actions" style={{ marginTop: "20px" }}>
            <button
              type="button"
              onClick={cancelAction}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : editingItem ? "Update Partner" : "Add Partner"}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return action === "view" ? renderViewMode() : renderFormMode();
};

export default PartnerManagement;
