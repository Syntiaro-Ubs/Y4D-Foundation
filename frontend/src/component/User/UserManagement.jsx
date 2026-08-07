import React, { useState, useEffect } from "react";
import { usersService } from "../../api/services/users.service";
import { useApi } from "../../hooks/useApi";
import { useLoadingState } from "../../hooks/useLoadingState";
import { API_BASE } from "../../config/api";
import "./UserManagement.css";
import logger from "../../utils/logger";
import toast from "../../utils/toast";

const UserManagement = ({ activeSubTab: propActiveSubTab = "users" }) => {
  const [activeSubTab, setActiveSubTab] = useState(propActiveSubTab);
  const [selectedUserForPermissions, setSelectedUserForPermissions] =
    useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "viewer",
    mobile_number: "",
    address: "",
  });
  const [permissions, setPermissions] = useState([]);

  const token = localStorage.getItem("token");

  // Use useApi hook for fetching users
  const { data: users = [], loading, error, refetch: fetchUsers } = useApi(
    () => {
      if (!token) {
        return Promise.resolve([]);
      }
      return usersService.getAllUsers();
    },
    [token],
    { defaultData: [], immediate: !!token }
  );

  // Use useLoadingState for async operations
  const { loading: isProcessing, execute } = useLoadingState();
  const onShowConfirmation = (title, message, actionType, id, entityType, entityName, onConfirm) => {
    setConfirmationData({
      title,
      message,
      actionType,
      id,
      entityType,
      entityName,
      onConfirm
    });
    setShowConfirmationModal(true);
  };
  const handleConfirmationClose = () => {
    setShowConfirmationModal(false);
    setConfirmationData(null);
  };

  // Add this handler to confirm action
  const handleConfirmationConfirm = () => {
    if (confirmationData && confirmationData.onConfirm) {
      toast.info(`Deleting "${confirmationData.entityName}"...`);
      confirmationData.onConfirm();
    }
    setShowConfirmationModal(false);
    setConfirmationData(null);
  };
  // Sync with prop changes
  useEffect(() => {
    setActiveSubTab(propActiveSubTab);
  }, [propActiveSubTab]);

  // Define all sections and sub-sections for permissions
  const allSections = [
    {
      section: "interventions",
      label: "Interventions",
      subSections: [
        "quality_education",
        "livelihood",
        "healthcare",
        "environment_sustainability",
        "integrated_development",
      ],
    },
    {
      section: "media",
      label: "Media Corner",
      subSections: [
        "newsletters",
        "stories",
        "events",
        "blogs",
        "documentaries",
      ],
    },
    { section: "impact", label: "Impact Data", subSections: [] },
    { section: "banners", label: "Banner Management", subSections: [] },
    { section: "accreditations", label: "Milestones & Awards", subSections: [] },
    { section: "partners", label: "Partners Logo", subSections: [] },
    {
      section: "team",
      label: "Team",
      subSections: ["mentors", "management", "board-trustees"],
    },
    { section: "careers", label: "Career", subSections: [] },
    { section: "reports", label: "Legal Report", subSections: [] },
    {
      section: "users",
      label: "User Management",
      subSections: ["users", "registrations"],
    },
  ];

  const fetchUserPermissions = async (userId) => {
    await execute(async () => {
      try {
        const permissionsData = await usersService.getUserPermissions(userId);
        setPermissions(permissionsData || []);
      } catch (error) {
        logger.error("Error fetching permissions:", error);
        // If permissions API doesn't exist yet, set empty permissions
        setPermissions([]);
      }
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    await execute(async () => {
      try {
        await usersService.createUser({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          mobile_number: formData.mobile_number,
          address: formData.address,
        });

        setShowCreateModal(false);
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "viewer",
          mobile_number: "",
          address: "",
        });
        fetchUsers();
        toast.success(`User "${formData.username}" created successfully!`);
      } catch (error) {
        const errorMsg = error.response?.data?.error || "Failed to create user";
        toast.error(errorMsg);
        throw error;
      }
    });
  };

  const handleStatusChange = async (userId, newStatus) => {
    await execute(async () => {
      try {
        await usersService.updateUserStatus(userId, newStatus);
        fetchUsers();
        toast.success(`User status updated to ${newStatus}`);
      } catch (error) {
        const errorMsg = error.response?.data?.error || "Failed to update user status";
        toast.error(`Error updating user status: ${errorMsg}`);
        throw error;
      }
    });
  };

  const handleRoleChange = async (userId, newRole) => {
    await execute(async () => {
      try {
        await usersService.updateUserRole(userId, newRole);
        fetchUsers();
        toast.success(`User role updated to ${newRole}`);
      } catch (error) {
        const errorMsg = error.response?.data?.error || "Failed to update user role";
        toast.error(`Error updating user role: ${errorMsg}`);
        throw error;
      }
    });
  };

  const handleDeleteUser = async (userId, username) => {
    await execute(async () => {
      try {
        await usersService.deleteUser(userId);
        fetchUsers();
        toast.success(`User "${username}" deleted successfully!`);
      } catch (error) {
        const errMsg = error.response?.data?.error || "Failed to delete user";
        toast.error(errMsg);
        throw error;
      }
    });
  };

  // Permission Management Functions
  const handleUserSelectForPermissions = (userId) => {
    const user = users.find((u) => u.id === userId);
    setSelectedUserForPermissions(user);
    fetchUserPermissions(userId);
  };

  const getPermissionForSection = (section, subSection = null) => {
    const perm = permissions.find(
      (p) => p.section === section && p.sub_section === subSection
    );

    if (perm) return perm;

    // Return default permissions based on role
    const defaultPerms = {
      viewer: {
        can_view: true,
        can_create: false,
        can_edit: false,
        can_delete: false,
        can_publish: false,
      },
      editor: {
        can_view: true,
        can_create: true,
        can_edit: true,
        can_delete: false,
        can_publish: false,
      },
      admin: {
        can_view: true,
        can_create: true,
        can_edit: true,
        can_delete: true,
        can_publish: true,
      },
      super_admin: {
        can_view: true,
        can_create: true,
        can_edit: true,
        can_delete: true,
        can_publish: true,
      },
    };

    return (
      defaultPerms[selectedUserForPermissions?.role] || defaultPerms.viewer
    );
  };

  const updatePermission = async (section, subSection, field, value) => {
    const updatedPermissions = [...permissions];
    const existingIndex = updatedPermissions.findIndex(
      (p) => p.section === section && p.sub_section === subSection
    );

    if (existingIndex >= 0) {
      updatedPermissions[existingIndex][field] = value;
    } else {
      updatedPermissions.push({
        user_id: selectedUserForPermissions.id,
        section,
        sub_section: subSection,
        can_view: field === "can_view" ? value : false,
        can_create: field === "can_create" ? value : false,
        can_edit: field === "can_edit" ? value : false,
        can_delete: field === "can_delete" ? value : false,
        can_publish: field === "can_publish" ? value : false,
      });
    }

    setPermissions(updatedPermissions);
  };

  const savePermissions = async () => {
    // Validate we have a selected user
    if (!selectedUserForPermissions) {
      toast.warning("No user selected");
      return;
    }

    // Validate permissions data
    if (!permissions || permissions.length === 0) {
      toast.warning("No permissions data to save");
      return;
    }

    await execute(async () => {
      try {
        logger.log("Saving permissions:", {
          userId: selectedUserForPermissions.id,
          permissions: permissions,
        });

        await usersService.updateUserPermissions(selectedUserForPermissions.id, { permissions });

        logger.log("Permissions saved successfully");
        toast.success("Permissions updated successfully!");

        // Refresh the permissions to ensure sync
        fetchUserPermissions(selectedUserForPermissions.id);
      } catch (error) {
        logger.error("Error saving permissions:", error);
        const errorMessage = error.response?.data?.error || "Failed to save permissions";
        toast.error(errorMessage);
        throw error;
      }
    });
  };

  const resetToRoleDefault = async () => {
    if (!selectedUserForPermissions) return;

    try {
      // Note: This endpoint may not exist, so we'll use hardcoded defaults
      // If the API exists, we can add it to usersService later
      const defaultPerms = {
        viewer: {
          can_view: true,
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_publish: false,
        },
        editor: {
          can_view: true,
          can_create: true,
          can_edit: true,
          can_delete: false,
          can_publish: false,
        },
        admin: {
          can_view: true,
          can_create: true,
          can_edit: true,
          can_delete: true,
          can_publish: true,
        },
        super_admin: {
          can_view: true,
          can_create: true,
          can_edit: true,
          can_delete: true,
          can_publish: true,
        },
      };
      const newPermissions = [];

      // Apply default permissions to all sections
      allSections.forEach((sectionConfig) => {
        newPermissions.push({
          user_id: selectedUserForPermissions.id,
          section: sectionConfig.section,
          sub_section: null,
          ...defaultPerms,
        });

        sectionConfig.subSections.forEach((subSection) => {
          newPermissions.push({
            user_id: selectedUserForPermissions.id,
            section: sectionConfig.section,
            sub_section: subSection,
            ...defaultPerms,
          });
        });
      });

      setPermissions(newPermissions);
    } catch (error) {
      logger.error("Error resetting permissions:", error);
      // If API doesn't exist, use hardcoded defaults
      const defaultPerms = {
        viewer: {
          can_view: true,
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_publish: false,
        },
        editor: {
          can_view: true,
          can_create: true,
          can_edit: true,
          can_delete: false,
          can_publish: false,
        },
        admin: {
          can_view: true,
          can_create: true,
          can_edit: true,
          can_delete: true,
          can_publish: true,
        },
        super_admin: {
          can_view: true,
          can_create: true,
          can_edit: true,
          can_delete: true,
          can_publish: true,
        },
      };

      const userDefaultPerms =
        defaultPerms[selectedUserForPermissions.role] || defaultPerms.viewer;
      const newPermissions = [];

      allSections.forEach((sectionConfig) => {
        newPermissions.push({
          user_id: selectedUserForPermissions.id,
          section: sectionConfig.section,
          sub_section: null,
          ...userDefaultPerms,
        });

        sectionConfig.subSections.forEach((subSection) => {
          newPermissions.push({
            user_id: selectedUserForPermissions.id,
            section: sectionConfig.section,
            sub_section: subSection,
            ...userDefaultPerms,
          });
        });
      });

      setPermissions(newPermissions);
    }
  };

  // Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange, id, disabled = false }) => {
    return (
      <label className="usermgmt-toggle-switch" htmlFor={id}>
        <input
          type="checkbox"
          id={id}
          checked={checked || false}
          onChange={onChange}
          disabled={disabled}
        />
        <span className="usermgmt-toggle-slider"></span>
      </label>
    );
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      approved: "status-approved",
      pending: "status-pending",
      rejected: "status-rejected",
      suspended: "status-suspended",
    };

    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleClasses = {
      super_admin: "role-super-admin",
      admin: "role-admin",
      editor: "role-editor",
      viewer: "role-viewer",
    };

    return (
      <span className={`role-badge ${roleClasses[role]}`}>
        {role.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderUserList = () => (
    <div className="users-table-container">
      <div className="table-header">
        <h3>All Users</h3>
        <span className="table-count">{users.length} users found</span>
      </div>

      <div className="table-responsive">
        <table className="users-table">
          <thead>
            <tr>
              <th>User Information</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  <i className="fas fa-users"></i>
                  <p>No users found</p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="user-row">
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-details">
                        <strong>{user.username}</strong>
                        {user.created_by_name && (
                          <small>Created by: {user.created_by_name}</small>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div>{user.email}</div>
                      {user.mobile_number && (
                        <small>{user.mobile_number}</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className="role-select"
                      disabled={user.role === "super_admin"}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={user.status}
                      onChange={(e) =>
                        handleStatusChange(user.id, e.target.value)
                      }
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td>
                    <div className="date-info">
                      {formatDate(user.created_at)}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => {
                          // Show toast when delete action is initiated
                          toast.info(`Please confirm deletion of "${user.username}"`);

                          onShowConfirmation(
                            "Delete User",
                            `Are you sure you want to delete user "${user.username}"? This action cannot be undone.`,
                            "delete",
                            user.id,
                            "users",
                            user.username,
                            () => handleDeleteUser(user.id, user.username)
                          );
                        }}
                        className="btn btn-danger btn-sm"
                        disabled={user.role === "super_admin"}
                        title={
                          user.role === "super_admin"
                            ? "Cannot delete super admin"
                            : "Delete user"
                        }
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                      <button
                        onClick={() => {
                          setActiveSubTab("permissions");
                          handleUserSelectForPermissions(user.id);
                        }}
                        className="btn btn-info btn-sm"
                        title="Manage Permissions"
                      >
                        <i className="fas fa-shield-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAddUserForm = () => (
    <div className="add-user-form-container">
      <div className="form-header">
        <h3>Add New User Manually</h3>
        <p>Create a new user account with specific role and permissions</p>
      </div>

      <form onSubmit={handleCreateUser} className="user-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Username *</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              placeholder="Enter password (min 6 characters)"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
              required
              placeholder="Confirm password"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Role *</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="tel"
              value={formData.mobile_number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mobile_number: e.target.value,
                })
              }
              placeholder="Optional mobile number"
            />
          </div>

          <div className="form-group full-width">
            <label>Address</label>
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Optional address"
              rows="3"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("users")}
            className="btn btn-secondary"
          >
            Back to Users
          </button>
        </div>
      </form>
    </div>
  );

  const renderPermissionManagement = () => (
    <div className="permission-management">
      <div className="permission-header">
        <h3>User Permission Management</h3>
        <p>Control section-wise access for each user</p>
      </div>

      {/* User Selection */}
      <div className="user-selection">
        <label>Select User:</label>
        <select
          value={selectedUserForPermissions?.id || ""}
          onChange={(e) =>
            handleUserSelectForPermissions(parseInt(e.target.value))
          }
        >
          <option value="">Choose a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username} ({user.role}) - {user.email}
            </option>
          ))}
        </select>
      </div>

      {selectedUserForPermissions && (
        <div className="permission-content">
          <div className="user-info">
            <h4>Permissions for: {selectedUserForPermissions.username}</h4>
            <p>
              Role: <strong>{selectedUserForPermissions.role}</strong>
            </p>
            <div className="permission-actions">
              <button
                onClick={resetToRoleDefault}
                className="btn btn-secondary"
              >
                Reset to Role Default
              </button>
              <button
                onClick={savePermissions}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Permissions"}
              </button>
              <button
                onClick={() => setActiveSubTab("users")}
                className="btn btn-outline"
              >
                Back to Users
              </button>
            </div>
          </div>

          {/* Permissions Grid */}
          <div className="permissions-grid">
            {allSections.map((sectionConfig) => (
              <div key={sectionConfig.section} className="permission-section">
                <div className="section-header">
                  <h5>{sectionConfig.label}</h5>
                  <div className="usermgmt-action-labels">
                    {["view", "create", "edit", "delete", "publish"].map(
                      (action) => (
                        <span key={action} className="usermgmt-action-label">
                          {action.charAt(0).toUpperCase() + action.slice(1)}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Main Section Permissions */}
                <div className="usermgmt-permission-row usermgmt-main-section">
                  <span className="usermgmt-section-label">Main Section</span>
                  <div className="usermgmt-toggle-container">
                    {["view", "create", "edit", "delete", "publish"].map(
                      (action) => (
                        <div key={action} className="usermgmt-toggle-item">
                          <ToggleSwitch
                            id={`${sectionConfig.section}-main-${action}`}
                            checked={
                              getPermissionForSection(sectionConfig.section)[
                              `can_${action}`
                              ]
                            }
                            onChange={(e) =>
                              updatePermission(
                                sectionConfig.section,
                                null,
                                `can_${action}`,
                                e.target.checked
                              )
                            }
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Sub-section Permissions */}
                {sectionConfig.subSections.map((subSection) => (
                  <div
                    key={subSection}
                    className="usermgmt-permission-row usermgmt-sub-section"
                  >
                    <span className="usermgmt-section-label">
                      <span className="usermgmt-subsection-icon">↳</span>
                      {subSection.replace(/_/g, " ")}
                    </span>
                    <div className="usermgmt-toggle-container">
                      {["view", "create", "edit", "delete", "publish"].map(
                        (action) => (
                          <div key={action} className="usermgmt-toggle-item">
                            <ToggleSwitch
                              id={`${sectionConfig.section}-${subSection}-${action}`}
                              checked={
                                getPermissionForSection(
                                  sectionConfig.section,
                                  subSection
                                )[`can_${action}`]
                              }
                              onChange={(e) =>
                                updatePermission(
                                  sectionConfig.section,
                                  subSection,
                                  `can_${action}`,
                                  e.target.checked
                                )
                              }
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (loading && activeSubTab === "users")
    return (
      <div className="user-management-loading">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h2>User Management</h2>
        <div className="header-actions">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <i className="fas fa-plus"></i> Create New User
          </button>
          <button onClick={fetchUsers} className="btn btn-secondary">
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
          <button onClick={() => setError("")} className="alert-close">
            &times;
          </button>
        </div>
      )}

      <div className="user-stats">
        <div className="stat-card">
          <h3>{users.length}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <h3>{users.filter((u) => u.status === "approved").length}</h3>
          <p>Active Users</p>
        </div>
        <div className="stat-card">
          <h3>{users.filter((u) => u.status === "pending").length}</h3>
          <p>Pending Users</p>
        </div>
      </div>

      {/* Content based on active sub tab */}
      <div className="sub-tab-content">
        {activeSubTab === "users" && renderUserList()}
        {activeSubTab === "add-user" && renderAddUserForm()}
        {activeSubTab === "permissions" && renderPermissionManagement()}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New User</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="modal-close"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                    placeholder="Enter username"
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    placeholder="Enter email address"
                  />
                </div>

                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    placeholder="Enter password (min 6 characters)"
                    minLength={6}
                  />
                </div>

                <div className="form-group">
                  <label>Confirm Password *</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    placeholder="Confirm password"
                    minLength={6}
                  />
                </div>

                <div className="form-group">
                  <label>Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    value={formData.mobile_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mobile_number: e.target.value,
                      })
                    }
                    placeholder="Optional mobile number"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Optional address"
                    rows="3"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create User"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showConfirmationModal && confirmationData && (
        <div className="modal-overlay">
          <div className="modal confirmation-modal">
            <div className="modal-header">
              <h3>{confirmationData.title}</h3>
              <button onClick={handleConfirmationClose} className="modal-close">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="confirmation-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <p>{confirmationData.message}</p>
            </div>
            <div className="modal-actions">
              <button
                onClick={handleConfirmationConfirm}
                className={`btn btn-${confirmationData.actionType === "delete" ? "danger" : "primary"
                  }`}
              >
                Confirm
              </button>
              <button
                onClick={handleConfirmationClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserManagement;
