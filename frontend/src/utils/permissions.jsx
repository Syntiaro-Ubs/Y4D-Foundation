import axios from "axios";
import { API_BASE } from "../config/api";
import logger from "./logger";

// Cache for user permissions
let userPermissionsCache = null;

export const fetchUserPermissions = async (currentUser) => {
  if (!currentUser) return null;

  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/permissions/my-permissions`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    userPermissionsCache = response.data;
    return userPermissionsCache;
  } catch (error) {
    if (import.meta.env.DEV) {
      logger.error("Error fetching user permissions:", error);
    }
    // Fall back to role-based permissions
    return getRoleBasedPermissions(currentUser.role);
  }
};

export const checkPermission = (
  currentUser,
  section,
  subSection = null,
  action = "view"
) => {
  if (!currentUser) return false;

  // Super admin has all permissions
  if (currentUser.role === "super_admin") return true;

  // If we have cached permissions, use them
  if (userPermissionsCache) {
    if (userPermissionsCache.roleBased) {
      // Use role-based permissions
      return userPermissionsCache.permissions[`can_${action}`] || false;
    } else {
      // Use custom permissions
      const perm = userPermissionsCache.permissions.find(
        (p) => p.section === section && p.sub_section === subSection
      );

      if (perm) {
        return perm[`can_${action}`] || false;
      }

      // If no specific permission, check main section permission
      const mainSectionPerm = userPermissionsCache.permissions.find(
        (p) => p.section === section && p.sub_section === null
      );

      if (mainSectionPerm) {
        return mainSectionPerm[`can_${action}`] || false;
      }

      // If section is not found at all in custom permissions, fallback to role-based permissions
      const sectionExists = userPermissionsCache.permissions.some(
        (p) => p.section === section
      );
      if (!sectionExists) {
        const rolePermissions = getRoleBasedPermissions(currentUser.role);
        return rolePermissions[`can_${action}`] || false;
      }
    }
  }

  // Fallback to role-based permissions
  const rolePermissions = getRoleBasedPermissions(currentUser.role);
  return rolePermissions[`can_${action}`] || false;
};

const getRoleBasedPermissions = (role) => {
  const rolePermissions = {
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
  };

  return rolePermissions[role] || rolePermissions.viewer;
};

// Helper functions for common permission checks
export const canView = (currentUser, section, subSection = null) =>
  checkPermission(currentUser, section, subSection, "view");

export const canCreate = (currentUser, section, subSection = null) =>
  checkPermission(currentUser, section, subSection, "create");

export const canEdit = (currentUser, section, subSection = null) =>
  checkPermission(currentUser, section, subSection, "edit");

export const canDelete = (currentUser, section, subSection = null) =>
  checkPermission(currentUser, section, subSection, "delete");

export const canPublish = (currentUser, section, subSection = null) =>
  checkPermission(currentUser, section, subSection, "publish");

// Clear cache (call this on logout)
export const clearPermissionsCache = () => {
  userPermissionsCache = null;
};
