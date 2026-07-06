import React, { useState, useEffect } from "react";
import { API_BASE, UPLOADS_BASE } from "../../config/api";
import { impactService } from "../../api/services/impact.service";
import { careersService } from "../../api/services/careers.service";
import { mediaService } from "../../api/services/media.service";
import { useLoadingState } from "../../hooks/useLoadingState";
import UserManagement from "../User/UserManagement";
import RegistrationRequests from "../Registration/RegistrationRequests";
import MediaManager from "../Media/MediaManager";
import OurWorkManagement from "../OurWork/OurWorkManagement";
import ImpactDataEditor from "../Impact/ImpactDataEditor";
import AccreditationManagement from "../Accreditation/AccreditationManagement";
import BannerManagement from "../Banner/BannerManagement";
import PartnerManagement from "../Partner/PartnerManagement";
import SanitizedHTML from "../Common/SanitizedHTML";
import "./Dashboard.css";
import logger from "../../utils/logger";
import {
  canView,
  canCreate,
  canEdit,
  canDelete,
  canPublish,
  fetchUserPermissions,
  clearPermissionsCache,
} from "../../utils/permissions";
import toast from "../../utils/toast";

const GRID_MEDIA_TYPES = [
  "newsletters",
  "stories",
  "events",
  "blogs",
  "documentaries",
];

const Dashboard = ({ currentUser: propCurrentUser }) => {
  const [activeTab, setActiveTab] = useState("ourWork");
  const [reports, setReports] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [management, setManagement] = useState([]);
  const [boardTrustees, setBoardTrustees] = useState([]);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(propCurrentUser || null);
  const [mediaAction, setMediaAction] = useState("view");
  const [editingMediaId, setEditingMediaId] = useState(null);

  // Add confirmation modal state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    title: "",
    message: "",
    type: "", // 'delete', 'publish', 'unpublish', 'activate', 'deactivate', 'status'
    itemId: null,
    itemType: null,
    itemName: "",
    onConfirm: null,
  });

  const [mediaForm, setMediaForm] = useState({
    title: "",
    description: "",
    content: "",
    image: null,
    pdf: null,
    date: "",
    time: "",
    location: "",
    video_url: "",
    video_file: null,
    is_active: true,
  });
  const [currentMediaType, setCurrentMediaType] = useState(null);
  const [currentOurWorkCategory, setCurrentOurWorkCategory] = useState(null);
  const [currentTeamType, setCurrentTeamType] = useState(null);
  const [teamAction, setTeamAction] = useState("view");
  const [careerAction, setCareerAction] = useState("current");
  const [legalReportAction, setLegalReportAction] = useState("view");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mediaSubDropdown, setMediaSubDropdown] = useState(null);
  const [interventionsSubDropdown, setInterventionsSubDropdown] =
    useState(null);
  const [interventionsAction, setInterventionsAction] = useState("view");
  const [currentAccreditationType, setCurrentAccreditationType] =
    useState(null);
  const [accreditationAction, setAccreditationAction] = useState("view");
  const [currentBannerType, setCurrentBannerType] = useState(null);
  const [bannerAction, setBannerAction] = useState("view");
  const [currentPartnerType, setCurrentPartnerType] = useState(null);
  const [partnerAction, setPartnerAction] = useState("view");

  // Form states - UPDATED: Added pdf field to reportForm
  const [reportForm, setReportForm] = useState({
    title: "",
    description: "",
    content: "",
    image: null,
    pdf: null,
  });
  const [mentorForm, setMentorForm] = useState({
    name: "",
    position: "",
    bio: "",
    image: null,
    social_links: "{}",
  });
  const [managementForm, setManagementForm] = useState({
    name: "",
    position: "",
    bio: "",
    image: null,
    social_links: "{}",
  });
  const [trusteeForm, setTrusteeForm] = useState({
    name: "",
    position: "",
    bio: "",
    image: null,
    social_links: "{}",
  });
  const [careerForm, setCareerForm] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    type: "full-time",
    is_active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);

  // Blog Multiple Image State
  const [blogImagePreviews, setBlogImagePreviews] = useState([]);
  const [blogSelectedFiles, setBlogSelectedFiles] = useState([]);
  const [existingBlogImages, setExistingBlogImages] = useState([]);

  // Confirmation Modal Functions
  const showConfirmationModal = (
    title,
    message,
    type,
    itemId,
    itemType,
    itemName,
    onConfirm
  ) => {
    setConfirmationData({
      title,
      message,
      type,
      itemId,
      itemType,
      itemName,
      onConfirm,
    });
    setShowConfirmation(true);
  };

  const hideConfirmationModal = () => {
    setShowConfirmation(false);
    setConfirmationData({
      title: "",
      message: "",
      type: "",
      itemId: null,
      itemType: null,
      itemName: "",
      onConfirm: null,
    });
  };

  const handleConfirmation = () => {
    if (confirmationData.onConfirm) {
      confirmationData.onConfirm();
    }
    hideConfirmationModal();
  };

  // Permission check functions
  const canUserPerformAction = (
    section,
    subSection = null,
    action = "view"
  ) => {
    if (!currentUser) return false;
    if (currentUser.role === "super_admin") return true;

    switch (action) {
      case "view":
        return canView(currentUser, section, subSection);
      case "create":
        return canCreate(currentUser, section, subSection);
      case "edit":
        return canEdit(currentUser, section, subSection);
      case "delete":
        return canDelete(currentUser, section, subSection);
      case "publish":
        return canPublish(currentUser, section, subSection);
      default:
        return false;
    }
  };

  // Update URL path function
  const updateUrlPath = (section, action = null, subSection = null) => {
    let path = `/admin/${section}`;
    if (subSection) {
      path += `/${subSection}`;
    }
    if (action && action !== "view") {
      path += `/${action}`;
    }
    window.history.pushState(null, "", path);
  };

  // Clear sub-sections when switching tabs
  useEffect(() => {
    setCurrentMediaType(null);
    setCurrentOurWorkCategory(null);
    setCurrentTeamType(null);
    setCurrentAccreditationType(null);
    setCurrentBannerType(null);
    setCurrentPartnerType(null);
    setTeamAction("view");
    setCareerAction("current");
    setLegalReportAction("view");
    setBannerAction("view");
    setPartnerAction("view");
    setMediaSubDropdown(null);
    setInterventionsSubDropdown(null);
    setInterventionsAction("view");
    setAccreditationAction("view");
  }, [activeTab]);

  useEffect(() => {
    logger.log("Careers data updated:", careers);
  }, [careers]);

  // Fetch user permissions when user changes
  useEffect(() => {
    if (currentUser) {
      fetchUserPermissions(currentUser);
    }
  }, [currentUser]);

  // Debug logging for reports
  useEffect(() => {
    if (activeTab === "reports") {
      logger.log("Reports state:", reports);
      logger.log("Legal report action:", legalReportAction);
      logger.log("Editing ID:", editingId);
      logger.log("Report form:", reportForm);
    }
  }, [activeTab, reports, legalReportAction, editingId, reportForm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest(".dashboard-sidebar")) {
        setOpenDropdown(null);
      }
      if (mediaSubDropdown && !event.target.closest(".media-dropdown-item")) {
        setMediaSubDropdown(null);
      }
      if (
        interventionsSubDropdown &&
        !event.target.closest(".interventions-dropdown-item")
      ) {
        setInterventionsSubDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown, mediaSubDropdown, interventionsSubDropdown]);

  useEffect(() => {
    if (!currentUser) {
      const userData = localStorage.getItem("user");
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    }

    if (activeTab === "our-team" && teamAction === "view") {
      fetchAllTeamData();
    } else if (activeTab === "careers") {
      fetchData("careers");
    } else if (activeTab === "reports") {
      fetchData("reports");
    } else if (
      activeTab !== "media" &&
      !currentMediaType &&
      activeTab !== "ourWork" &&
      !currentOurWorkCategory &&
      activeTab !== "impact" &&
      activeTab !== "users" &&
      activeTab !== "registrations" &&
      activeTab !== "banners" &&
      activeTab !== "add-user" &&
      activeTab !== "permissions"
    ) {
      fetchData(activeTab);
    }
  }, [
    activeTab,
    currentUser,
    currentMediaType,
    currentOurWorkCategory,
    teamAction,
  ]);

  // File handlers for reports - NEW FUNCTIONS
  const handleReportImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReportForm({ ...reportForm, image: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReportPdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReportForm({ ...reportForm, pdf: file });
    }
  };

  const removeBlogImage = (index, isExisting) => {
    if (isExisting) {
      setExistingBlogImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setBlogSelectedFiles(prev => prev.filter((_, i) => i !== index));
      setBlogImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const renderOurWorkManagement = () => {
    if (currentOurWorkCategory) {
      return (
        <OurWorkManagement
          category={currentOurWorkCategory}
          action={interventionsAction}
          onClose={() => {
            setCurrentOurWorkCategory(null);
            setInterventionsAction("view");
            updateUrlPath("interventions");
          }}
          onActionChange={(action) => setInterventionsAction(action)}
          currentUser={currentUser}
          // ADDED: Pass confirmation modal functions
          onShowConfirmation={showConfirmationModal}
          onHideConfirmation={hideConfirmationModal}
        />
      );
    }
    return null;
  };

  const handleAccreditationAction = (action) => {
    setCurrentAccreditationType("accreditations");
    setAccreditationAction(action);
    setOpenDropdown(null);
    updateUrlPath("accreditations", action);
  };

  const handleBannerAction = (action) => {
    setCurrentBannerType("banners");
    setBannerAction(action);
    setOpenDropdown(null);
    updateUrlPath("banners", action);
  };

  const handlePartnerAction = (action) => {
    setCurrentPartnerType("partners");
    setPartnerAction(action);
    setOpenDropdown(null);
    updateUrlPath("partners", action);
  };

  // Modified render functions to check permissions
  const renderActionButtons = (item, section, subSection = null) => {
    const canEditItem = canUserPerformAction(section, subSection, "edit");
    const canDeleteItem = canUserPerformAction(section, subSection, "delete");
    const canPublishItem = canUserPerformAction(section, subSection, "publish");

    // If user only has view permission, show nothing or "View Only" badge
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
            className={`status-toggle-btn ${item.is_published ? "btn-inactive" : "btn-active"
              }`}
            onClick={() => {
              showConfirmationModal(
                item.is_published ? "Unpublish Item" : "Publish Item",
                `Are you sure you want to ${item.is_published ? "unpublish" : "publish"
                } "${item.title}"?`,
                item.is_published ? "unpublish" : "publish",
                item.id,
                currentMediaType,
                item.title,
                () => handleMediaStatusToggle(item.id, !item.is_published)
              );
            }}
          >
            {item.is_published ? "Unpublish" : "Publish"}
          </button>
        )}

        {canEditItem && (
          <button
            className="btn-edit"
            onClick={() => {
              handleMediaEdit(item);
              updateUrlPath("media", "update", currentMediaType);
            }}
          >
            Edit
          </button>
        )}

        {canDeleteItem && (
          <button
            className="btn-delete"
            onClick={() => {
              showConfirmationModal(
                "Delete Item",
                `Are you sure you want to delete "${item.title}"? This action cannot be undone.`,
                "delete",
                item.id,
                currentMediaType,
                item.title,
                () => handleMediaDelete(item.id)
              );
            }}
          >
            Delete
          </button>
        )}
      </div>
    );
  };

  // Update the add button rendering
  const renderAddButton = (section, subSection = null) => {
    const canCreateItem = canUserPerformAction(section, subSection, "create");

    if (!canCreateItem) return null;

    return (
      <button className="btn-primary" onClick={() => { }}>
        + Add {section.slice(0, -1)}
      </button>
    );
  };

  const renderAccreditationContent = () => {
    return (
      <div className="accreditation-content-section">
        <AccreditationManagement
          action={accreditationAction}
          onClose={() => {
            setCurrentAccreditationType(null);
            setAccreditationAction("view");
            updateUrlPath("accreditations");
          }}
          onActionChange={(action) => setAccreditationAction(action)}
          currentUser={currentUser}
          // ADDED: Pass confirmation modal functions
          onShowConfirmation={showConfirmationModal}
          onHideConfirmation={hideConfirmationModal}
        />
      </div>
    );
  };

  const renderBannerContent = () => {
    return (
      <div className="banner-content-section">
        <BannerManagement
          action={bannerAction}
          onClose={() => {
            setCurrentBannerType(null);
            setBannerAction("view");
            updateUrlPath("banners");
          }}
          onActionChange={(action) => setBannerAction(action)}
          currentUser={currentUser}
          // ADDED: Pass confirmation modal functions
          onShowConfirmation={showConfirmationModal}
          onHideConfirmation={hideConfirmationModal}
        />
      </div>
    );
  };

  const renderPartnerContent = () => {
    return (
      <div className="banner-content-section">
        <PartnerManagement
          action={partnerAction}
          onClose={() => {
            setCurrentPartnerType(null);
            setPartnerAction("view");
            updateUrlPath("partners");
          }}
          onActionChange={(action) => setPartnerAction(action)}
          currentUser={currentUser}
          onShowConfirmation={showConfirmationModal}
          onHideConfirmation={hideConfirmationModal}
        />
      </div>
    );
  };

  const renderReportLastModifiedInfo = (item) => {
    if (
      !currentUser ||
      (currentUser.role !== "admin" && currentUser.role !== "super_admin")
    ) {
      return null;
    }

    if (!item.last_modified_by_name && !item.last_modified_at) {
      return null;
    }

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

  const renderLastModifiedInfo = (item) => {
    if (
      !currentUser ||
      (currentUser.role !== "admin" && currentUser.role !== "super_admin")
    ) {
      return null;
    }

    if (!item.last_modified_by_name && !item.last_modified_at) {
      return null;
    }

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

  const renderBannerLastModifiedInfo = (item) => {
    if (
      !currentUser ||
      (currentUser.role !== "admin" && currentUser.role !== "super_admin")
    ) {
      return null;
    }

    const modifiedByName = item.last_modified_by_name || item.modified_by_name;
    const modifiedAt = item.last_modified_at || item.modified_at;

    if (!modifiedByName && !modifiedAt) {
      return null;
    }

    return (
      <div className="last-modified-info admin-only">
        <small>
          Last modified by: <strong>{modifiedByName || "Unknown user"}</strong>{" "}
          •{" "}
          {modifiedAt
            ? new Date(modifiedAt).toLocaleDateString()
            : "Unknown date"}
        </small>
      </div>
    );
  };

  const renderAccreditationLastModifiedInfo = (item) => {
    if (
      !currentUser ||
      (currentUser.role !== "admin" && currentUser.role !== "super_admin")
    ) {
      return null;
    }

    const modifiedByName = item.last_modified_by_name || item.modified_by_name;
    const modifiedAt = item.last_modified_at || item.modified_at;

    if (!modifiedByName && !modifiedAt) {
      return null;
    }

    return (
      <div className="last-modified-info admin-only">
        <small>
          Last modified by: <strong>{modifiedByName || "Unknown user"}</strong>{" "}
          •{" "}
          {modifiedAt
            ? new Date(modifiedAt).toLocaleDateString()
            : "Unknown date"}
        </small>
      </div>
    );
  };

  const fetchAllTeamData = async () => {
    setLoading(true);
    try {
      const [mentorsData, managementData, trusteesData] = await Promise.all([
        impactService.getMentors(),
        impactService.getManagement(),
        impactService.getBoardTrustees(),
      ]);

      setMentors(mentorsData);
      setManagement(managementData);
      setBoardTrustees(trusteesData);
    } catch (error) {
      logger.error("Error fetching team data:", error);
      toast.error(`Error fetching team data: ${error.message}`);
    }
    setLoading(false);
  };

  // UPDATED: Improved fetchData function for reports
  const fetchData = async (type) => {
    setLoading(true);
    try {
      let response;
      const token = localStorage.getItem("token");

      switch (type) {
        case "reports":
          try {
            const token = localStorage.getItem("token");
            let reportsData;

            if (token) {
              // Use admin endpoint to get all reports (including unpublished)
              reportsData = await impactService.getAllReports();
            } else {
              // Fallback to public endpoint
              reportsData = await impactService.getReports();
            }

            setReports(reportsData);
            logger.log("Reports fetched successfully:", reportsData);
          } catch (error) {
            logger.error(`Error fetching reports:`, error);
            toast.error(`Error fetching reports: ${error.message}`);
          }
          break;

        case "mentors":
          const mentorsData = await impactService.getMentors();
          setMentors(mentorsData);
          break;
        case "management":
          const managementData = await impactService.getManagement();
          setManagement(managementData);
          break;
        case "careers":
          const careersData = await careersService.getCareers();
          setCareers(careersData);
          logger.log("Fetched careers:", careersData);
          break;
        case "board-trustees":
          const trusteesData = await impactService.getBoardTrustees?.() || [];
          setBoardTrustees(trusteesData);
          break;
        default:
          break;
      }
    } catch (error) {
      logger.error(`Error fetching ${type}:`, error);
      toast.error(`Error fetching ${type}: ${error.message}`);
    }
    setLoading(false);
  };

  const handleImageChange = (e, setFormFunction) => {
    const file = e.target.files[0];
    setFormFunction((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const handlePdfChange = (e, setFormFunction) => {
    const file = e.target.files[0];
    setFormFunction((prev) => ({ ...prev, pdf: file }));
  };

  // UPDATED: Improved handleSubmit for reports
  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading(true);

    try {
      let formData = new FormData();
      let endpoint = "";

      switch (type) {
        case "reports":
          try {
            const reportFormData = new FormData();
            reportFormData.append("title", reportForm.title);
            reportFormData.append("description", reportForm.description);
            reportFormData.append("content", reportForm.content || "");
            reportFormData.append("is_published", "1"); // Add this line

            // IMPORTANT: Append files with the exact field names backend expects
            if (reportForm.image && reportForm.image instanceof File) {
              reportFormData.append("image", reportForm.image);
            }

            if (reportForm.pdf && reportForm.pdf instanceof File) {
              reportFormData.append("pdf", reportForm.pdf);
            }

            const adminRegion = localStorage.getItem("adminRegion");
            if (adminRegion) {
              reportFormData.append("region", adminRegion);
            }

            if (editingId) {
              await impactService.updateReport(editingId, reportFormData);
            } else {
              await impactService.createReport(reportFormData);
            }

            // Reset form
            setReportForm({
              title: "",
              description: "",
              content: "",
              image: null,
              pdf: null,
            });
            setLegalReportAction("view");
            setImagePreview(null);
            setEditingId(null);

            // Refresh reports
            fetchData("reports");

            toast.success(
              `Report ${editingId ? "updated" : "created"} successfully!`
            );
          } catch (error) {
            logger.error("Error saving report:", error);

            // More detailed error logging
            if (error.response) {
              logger.error("Error response data:", error.response.data);
              logger.error("Error response status:", error.response.status);
              logger.error("Error response headers:", error.response.headers);
            } else if (error.request) {
              logger.error("Error request:", error.request);
            }

            toast.error(
              `Error saving report: ${error.response?.data?.error ||
              error.response?.data?.message ||
              error.message
              }`
            );
          }
          break;
        case "mentors":
          Object.keys(mentorForm).forEach((key) => {
            if (key === "image" && mentorForm.image) {
              formData.append("image", mentorForm.image);
            } else {
              formData.append(key, mentorForm[key]);
            }
          });

          const mentorRegion = localStorage.getItem("adminRegion");
          if (mentorRegion) {
            formData.append("region", mentorRegion);
          }

          if (editingId) {
            await impactService.updateMentor(editingId, formData);
          } else {
            await impactService.createMentor(formData);
          }

          setMentorForm({
            name: "",
            position: "",
            bio: "",
            image: null,
            social_links: "{}",
          });

          toast.success(
            `Mentor ${editingId ? "updated" : "created"} successfully!`
          );

          break;

        case "management":
          Object.keys(managementForm).forEach((key) => {
            if (key === "image" && managementForm.image) {
              formData.append("image", managementForm.image);
            } else {
              formData.append(key, managementForm[key]);
            }
          });

          const managementRegion = localStorage.getItem("adminRegion");
          if (managementRegion) {
            formData.append("region", managementRegion);
          }

          if (editingId) {
            await impactService.updateManagement(editingId, formData);
          } else {
            await impactService.createManagement(formData);
          }

          setManagementForm({
            name: "",
            position: "",
            bio: "",
            image: null,
            social_links: "{}",
          });

          toast.success(
            `Management member ${editingId ? "updated" : "created"
            } successfully!`
          );

          break;

        case "careers":
          const careerPayload = { ...careerForm };
          const careerRegion = localStorage.getItem("adminRegion");
          if (careerRegion) {
            careerPayload.region = careerRegion;
          }

          if (editingId) {
            await careersService.updateCareer(editingId, careerPayload);
          } else {
            await careersService.createCareer(careerPayload);
          }

          setCareerForm({
            title: "",
            description: "",
            requirements: "",
            location: "",
            type: "full-time",
            status: "active",
          });
          setCareerAction("all");

          toast.success(
            `Career opening ${editingId ? "updated" : "created"} successfully!`
          );

          break;

        case "board-trustees":
          Object.keys(trusteeForm).forEach((key) => {
            if (key === "image" && trusteeForm.image) {
              formData.append("image", trusteeForm.image);
            } else {
              formData.append(key, trusteeForm[key]);
            }
          });

          const trusteeRegion = localStorage.getItem("adminRegion");
          if (trusteeRegion) {
            formData.append("region", trusteeRegion);
          }

          if (editingId) {
            await impactService.updateBoardTrustee(editingId, formData);
          } else {
            await impactService.createBoardTrustee(formData);
          }

          setTrusteeForm({
            name: "",
            position: "",
            bio: "",
            image: null,
            social_links: "{}",
          });

          toast.success(
            `${localStorage.getItem("adminRegion") === "global" ? "Board directory" : "Board trustee"} ${editingId ? "updated" : "created"} successfully!`
          );

          break;

        default:
          break;
      }

      setEditingId(null);
      setImagePreview(null);
      setTeamAction("view");
      fetchAllTeamData();
      fetchData(type);
    } catch (error) {
      logger.error(`Error saving ${type}:`, error);
      toast.error(`Error saving ${type}: ${error.message}`);
    }
    setLoading(false);
  };
  const handleReportStatusToggle = async (id, newStatus) => {
    setLoading(true);
    try {
      await impactService.toggleReportStatus(id, newStatus);
      toast.success(
        `Report ${newStatus ? "published" : "unpublished"} successfully!`
      );
      fetchData("reports");
    } catch (error) {
      logger.error("Error toggling report status:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        handleLogout();
      } else {
        toast.error(`Error updating report status: ${error.message}`);
      }
    }
    setLoading(false);
  };

  // UPDATED: handleEdit for reports
  const handleEdit = (item, type) => {
    setEditingId(item.id);

    if (type === "reports") {
      setLegalReportAction("update");
    } else if (type === "careers") {
      setCareerAction("update");
    } else {
      setTeamAction("update");
      setCurrentTeamType(type);
    }

    switch (type) {
      case "reports":
        setLegalReportAction("update");
        setReportForm({
          title: item.title,
          description: item.description,
          content: item.content || "",
          image: null, // Reset to null when editing
          pdf: null, // Reset to null when editing
        });
        // Set image preview if exists
        if (item.image) {
          setImagePreview(`${UPLOADS_BASE}/reports/${item.image}`);
        }
        break;
      case "careers":
        setCareerForm({
          title: item.title,
          description: item.description,
          requirements: item.requirements,
          location: item.location,
          type: item.type,
          is_active: item.is_active,
        });
        break;
      case "mentors":
        setMentorForm({
          name: item.name,
          position: item.position,
          bio: item.bio,
          image: null,
          social_links: JSON.stringify(item.social_links || {}),
        });
        if (item.image)
          setImagePreview(`${UPLOADS_BASE}/mentors/${item.image}`);
        break;
      case "management":
        setManagementForm({
          name: item.name,
          position: item.position,
          bio: item.bio,
          image: null,
          social_links: JSON.stringify(item.social_links || {}),
        });
        if (item.image)
          setImagePreview(`${UPLOADS_BASE}/management/${item.image}`);
        break;
      case "board-trustees":
        setTrusteeForm({
          name: item.name,
          position: item.position,
          bio: item.bio,
          image: null,
          social_links: JSON.stringify(item.social_links || {}),
        });
        if (item.image)
          setImagePreview(`${UPLOADS_BASE}/board-trustees/${item.image}`);
        break;
      default:
        break;
    }
  };

  const handleStatusToggle = async (id, newStatus) => {
    setLoading(true);
    try {
      const career = careers.find((c) => c.id === id);
      await careersService.updateCareer(id, {
        ...career,
        is_active: newStatus,
      });

      toast.success(
        `Career opening ${newStatus ? "activated" : "deactivated"
        } successfully!`
      );
      fetchData("careers");
    } catch (error) {
      logger.error("Error toggling career status:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        handleLogout();
      } else {
        toast.error(`Error updating career status: ${error.message}`);
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id, type) => {
    setLoading(true);
    try {
      // Use appropriate service based on type
      switch (type) {
        case "reports":
          await impactService.deleteReport(id);
          break;
        case "mentors":
          await impactService.deleteMentor(id);
          break;
        case "management":
          await impactService.deleteManagement(id);
          break;
        case "board-trustees":
          await impactService.deleteBoardTrustee(id);
          break;
        case "careers":
          await careersService.deleteCareer(id);
          break;
        default:
          throw new Error(`Unknown type: ${type}`);
      }

      toast.success(`${type.slice(0, -1)} deleted successfully!`);

      if (type === "our-team") {
        fetchAllTeamData();
      } else {
        fetchData(type);
      }
    } catch (error) {
      logger.error(`Error deleting ${type}:`, error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        handleLogout();
      } else {
        toast.error(
          `Error deleting ${type}: ${error.response?.data?.error || error.message
          }`
        );
      }
    }
    setLoading(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTeamAction("view");
    setCurrentTeamType(null);
    setCareerAction("all");
    setLegalReportAction("view");
    setReportForm({
      title: "",
      description: "",
      content: "",
      image: null,
      pdf: null,
    });
    setMentorForm({
      name: "",
      position: "",
      bio: "",
      image: null,
      social_links: "{}",
    });
    setManagementForm({
      name: "",
      position: "",
      bio: "",
      image: null,
      social_links: "{}",
    });
    setCareerForm({
      title: "",
      description: "",
      requirements: "",
      location: "",
      type: "full-time",
      is_active: true,
    });
    setTrusteeForm({
      name: "",
      position: "",
      bio: "",
      image: null,
      social_links: "{}",
    });
    setImagePreview(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminRegion");
    clearPermissionsCache();
    toast.info("You have been logged out successfully.");
    setTimeout(() => {
      window.location.href = "/admin";
    }, 1500);
  };

  // Media Corner dropdown handlers
  const handleMediaSubDropdown = (type) => {
    setMediaSubDropdown(mediaSubDropdown === type ? null : type);
  };

  const handleMediaAction = (type, action) => {
    setCurrentMediaType(type);
    setMediaAction(action);
    setMediaSubDropdown(null);
    setOpenDropdown(null);
    updateUrlPath("media", action, type);

    if (action === "add") {
      setEditingMediaId(null);
      setMediaForm({
        title: "",
        description: "",
        content: "",
        image: null,
        pdf: null,
        video_url: "",
        video_file: null,
        is_active: true,
      });
    }
  };

  // Interventions dropdown handlers
  const handleInterventionsSubDropdown = (category) => {
    setInterventionsSubDropdown(
      interventionsSubDropdown === category ? null : category
    );
  };

  const handleInterventionsAction = (category, action) => {
    setCurrentOurWorkCategory(category);
    setInterventionsAction(action);
    setInterventionsSubDropdown(null);
    setOpenDropdown(null);
    updateUrlPath("interventions", action, category);
  };

  // Helper functions
  const getMediaTypeIcon = (type) => {
    const icons = {
      newsletters: "📰",
      stories: "📖",
      events: "🎪",
      blogs: "✍️",
      documentaries: "🎥",
    };
    return icons[type] || "📄";
  };

  const getMediaTypeDescription = (type) => {
    const descriptions = {
      newsletters: "Manage monthly newsletters and publications",
      stories: "Share inspiring success stories",
      events: "Manage upcoming events and workshops",
      blogs: "Create and manage blog posts",
      documentaries: "Upload and manage video content",
    };
    return descriptions[type] || "Manage content";
  };

  const getOurWorkCategoryIcon = (category) => {
    const icons = {
      quality_education: "🎓",
      livelihood: "💼",
      healthcare: "🏥",
      environment_sustainability: "🌱",
      integrated_development: "🤝",
    };
    return icons[category] || "📋";
  };

  const getOurWorkCategoryLabel = (category) => {
    const labels = {
      quality_education: "Quality Education",
      livelihood: "Sustainable Livelihood",
      healthcare: "Healthcare",
      environment_sustainability: "Environment Sustainability",
      integrated_development: "Integrated Development (IDP)",
    };
    return labels[category] || category;
  };

  const getOurWorkCategoryDescription = (category) => {
    const descriptions = {
      quality_education: "Manage quality education programs and initiatives",
      livelihood: "Manage livelihood and employment programs",
      healthcare: "Manage healthcare services and initiatives",
      environment_sustainability:
        "Manage environmental sustainability programs",
      integrated_development: "Manage integrated development programs",
    };
    return descriptions[category] || "Manage content";
  };

  const renderMediaForm = () => {
    return (
      <div className="content-list">
        <form onSubmit={(e) => handleMediaSubmit(e)} className="dashboard-form">
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={mediaForm.title}
              onChange={(e) =>
                setMediaForm({ ...mediaForm, title: e.target.value })
              }
              required
            />
          </div>

          {!["stories", "blogs"].includes(currentMediaType) && (
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={mediaForm.description}
                onChange={(e) =>
                  setMediaForm({ ...mediaForm, description: e.target.value })
                }
                required
                rows="3"
              />
            </div>
          )}

          {/* Only show content field for stories and blogs */}
          {["stories", "blogs"].includes(currentMediaType) && (
            <div className="form-group">
              <label>Content:</label>
              <textarea
                value={mediaForm.content || ""}
                onChange={(e) =>
                  setMediaForm({ ...mediaForm, content: e.target.value })
                }
                rows="5"
              />
            </div>
          )}

          {/* EVENT SPECIFIC FIELDS */}
          {currentMediaType === "events" && (
            <>
              <div className="form-group">
                <label>Event Date:</label>
                <input
                  type="date"
                  value={mediaForm.event_date || ""}
                  onChange={(e) =>
                    setMediaForm({ ...mediaForm, event_date: e.target.value })
                  }
                  required={currentMediaType === "events"}
                />
              </div>

              <div className="form-group">
                <label>Event Time:</label>
                <input
                  type="time"
                  value={mediaForm.event_time || ""}
                  onChange={(e) =>
                    setMediaForm({ ...mediaForm, event_time: e.target.value })
                  }
                  required={currentMediaType === "events"}
                />
              </div>

              <div className="form-group">
                <label>Location:</label>
                <input
                  type="text"
                  value={mediaForm.location || ""}
                  onChange={(e) =>
                    setMediaForm({ ...mediaForm, location: e.target.value })
                  }
                  required={currentMediaType === "events"}
                  placeholder="Enter event location"
                />
              </div>
            </>
          )}

          {/* Show image upload for all types except newsletters */}
          {currentMediaType !== "newsletters" &&
            currentMediaType !== "events" && <div className="form-group"></div>}

          {/* EVENT IMAGE FIELD - With different label */}
          {currentMediaType === "events" && (
            <div className="form-group">
              <label>Event Image/Banner:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setMediaForm({ ...mediaForm, image: file });
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImagePreview(reader.result);
                  };
                  if (file) reader.readAsDataURL(file);
                }}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
          )}

          {/* SPECIAL HANDLING FOR NEWSLETTERS - PDF UPLOAD */}
          {currentMediaType === "newsletters" && (
            <div className="form-group">
              <label>PDF Document (Required for newsletters):</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setMediaForm({ ...mediaForm, pdf: file });
                }}
                required={currentMediaType === "newsletters"}
              />
              <small>Upload PDF document for newsletter</small>
              {mediaForm.pdf && (
                <div className="file-preview">
                  <span>📄 {mediaForm.pdf.name}</span>
                </div>
              )}
            </div>
          )}

          {/* BLOG IMAGE FIELD - Multiple upload for blogs */}
          {currentMediaType === 'blogs' ? (
            <div className="form-group">
              <label>Blog Images:</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  setBlogSelectedFiles(prev => [...prev, ...files]);

                  files.forEach(file => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setBlogImagePreviews(prev => [...prev, reader.result]);
                    };
                    reader.readAsDataURL(file);
                  });
                }}
              />
              <div className="blog-images-preview-container">
                {/* Existing Images */}
                {existingBlogImages.map((image, idx) => (
                  <div key={`existing-${idx}`} className="blog-image-preview-item">
                    <img src={`${UPLOADS_BASE}/media/blogs/${image}`} alt="Existing" />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeBlogImage(idx, true)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                {/* New Previews */}
                {blogImagePreviews.map((preview, idx) => (
                  <div key={`new-${idx}`} className="blog-image-preview-item">
                    <img src={preview} alt="New Preview" />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeBlogImage(idx, false)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Show image upload for other types that need images */}
              {["stories", "documentaries"].includes(currentMediaType) && (
                <div className="form-group">
                  <label>
                    {currentMediaType === "documentaries"
                      ? "Thumbnail Image:"
                      : "Featured Image:"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setMediaForm({ ...mediaForm, image: file });
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImagePreview(reader.result);
                      };
                      if (file) reader.readAsDataURL(file);
                    }}
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {currentMediaType === "documentaries" && (
            <>
              <div className="form-group">
                <label>Video Link (YouTube, Vimeo, etc.)</label>
                <input
                  type="url"
                  value={mediaForm.video_url}
                  onChange={(e) =>
                    setMediaForm({ ...mediaForm, video_url: e.target.value })
                  }
                  placeholder="Enter video link (YouTube, Vimeo, etc.)"
                />
                <small>Example: https://www.youtube.com/watch?v=abc123</small>
              </div>

              <div className="form-group">
                <label>OR Upload Video File</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setMediaForm({
                      ...mediaForm,
                      video_file: file,
                      video_url: file ? "" : mediaForm.video_url,
                    });
                  }}
                />
                <small>Supported formats: MP4, WebM, MOV. Max size: 50MB</small>
                {mediaForm.video_file && (
                  <div className="file-preview">
                    <span>🎥 Selected: {mediaForm.video_file.name}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Duration (optional)</label>
                <input
                  type="text"
                  value={mediaForm.duration}
                  onChange={(e) =>
                    setMediaForm({ ...mediaForm, duration: e.target.value })
                  }
                  placeholder="e.g., 15:30, 1h 25m"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Status:</label>
            <select
              value={mediaForm.is_active}
              onChange={(e) =>
                setMediaForm({
                  ...mediaForm,
                  is_active: e.target.value === "true",
                })
              }
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : editingMediaId ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMediaAction("view");
                setEditingMediaId(null);
                setMediaForm({
                  title: "",
                  description: "",
                  content: "",
                  image: null,
                  pdf: null,
                  is_active: true,
                });
                updateUrlPath("media", "view", currentMediaType);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderTeamForm = () => {
    if (!currentTeamType) {
      return (
        <div className="team-type-selection">
          <h3>Select Team Type</h3>
          <div className="team-type-options">
            {canUserPerformAction("team", "mentors", "create") && (
              <button
                className="team-type-btn"
                onClick={() => {
                  setCurrentTeamType("mentors");
                  updateUrlPath("team", "add", "mentors");
                }}
              >
                <span>👥</span>
                <div>
                  <h4>Mentors</h4>
                  <p>Add new mentor to the team</p>
                </div>
              </button>
            )}
            {canUserPerformAction("team", "management", "create") && (
              <button
                className="team-type-btn"
                onClick={() => {
                  setCurrentTeamType("management");
                  updateUrlPath("team", "add", "management");
                }}
              >
                <span>💼</span>
                <div>
                  <h4>Management Team</h4>
                  <p>Add new management team member</p>
                </div>
              </button>
            )}
            {canUserPerformAction("team", "board-trustees", "create") && (
              <button
                className="team-type-btn"
                onClick={() => {
                  setCurrentTeamType("board-trustees");
                  updateUrlPath("team", "add", "board-trustees");
                }}
              >
                <span>🏛️</span>
                <div>
                  <h4>{localStorage.getItem("adminRegion") === "global" ? "Our Board of Directors" : "Board of Trustees"}</h4>
                  <p>Add new {localStorage.getItem("adminRegion") === "global" ? "board of director" : "board trustee"}</p>
                </div>
              </button>
            )}
          </div>
        </div>
      );
    }

    switch (currentTeamType) {
      case "mentors":
        return (
          <form
            onSubmit={(e) => handleSubmit(e, "mentors")}
            className="dashboard-form"
          >
            <h3>{editingId ? "Edit" : "Add New"} Mentor</h3>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={mentorForm.name}
                onChange={(e) =>
                  setMentorForm({ ...mentorForm, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Designation:</label>
              <input
                type="text"
                value={mentorForm.position}
                onChange={(e) =>
                  setMentorForm({ ...mentorForm, position: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setMentorForm)}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? "Processing..." : editingId ? "Update" : "Create"}{" "}
                Mentor
              </button>
              <button type="button" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        );

      case "management":
        return (
          <form
            onSubmit={(e) => handleSubmit(e, "management")}
            className="dashboard-form"
          >
            <h3>{editingId ? "Edit" : "Add New"} Management Member</h3>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={managementForm.name}
                onChange={(e) =>
                  setManagementForm({ ...managementForm, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Designation:</label>
              <input
                type="text"
                value={managementForm.position}
                onChange={(e) =>
                  setManagementForm({
                    ...managementForm,
                    position: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? "Processing..." : editingId ? "Update" : "Create"}{" "}
                Member
              </button>
              <button type="button" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        );

      case "board-trustees":
        return (
          <form
            onSubmit={(e) => handleSubmit(e, "board-trustees")}
            className="dashboard-form"
          >
            <h3>{editingId ? "Edit" : "Add New"} {localStorage.getItem("adminRegion") === "global" ? "Board of Director" : "Board Trustee"}</h3>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={trusteeForm.name}
                onChange={(e) =>
                  setTrusteeForm({ ...trusteeForm, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Designation:</label>
              <input
                type="text"
                value={trusteeForm.position}
                onChange={(e) =>
                  setTrusteeForm({ ...trusteeForm, position: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setTrusteeForm)}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? "Processing..." : editingId ? "Update" : "Create"}{" "}
                {localStorage.getItem("adminRegion") === "global" ? "Director" : "Trustee"}
              </button>
              <button type="button" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  const renderTeamView = () => {
    if (loading) return <div className="loading">Loading...</div>;

    return (
      <div className="team-dashboard">
        <div className="team-header">
          <h3>Team</h3>
          {canUserPerformAction("team", null, "create") && (
            <button
              className="btn-primary"
              onClick={() => {
                setTeamAction("add");
                setCurrentTeamType(null);
                updateUrlPath("team", "add");
              }}
            >
              + Add User
            </button>
          )}
        </div>

        {/* Mentors Section */}
        {canUserPerformAction("team", "mentors", "view") && (
          <div className="team-section">
            <h4>Mentors ({mentors.length})</h4>
            {mentors.length === 0 ? (
              <p className="no-data">No mentors found</p>
            ) : (
              <div className="team-table">
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Designation</th>
                      {(canUserPerformAction("team", "mentors", "edit") ||
                        canUserPerformAction("team", "mentors", "delete")) && (
                          <th>Actions</th>
                        )}
                    </tr>
                  </thead>
                  <tbody>
                    {mentors.map((mentor) => (
                      <tr key={mentor.id}>
                        <td>
                          {mentor.image ? (
                            <img
                              src={`${API_BASE}/uploads/mentors/${mentor.image}`}
                              alt={mentor.name}
                              className="team-avatar"
                            />
                          ) : (
                            <div className="avatar-placeholder">👤</div>
                          )}
                        </td>
                        <td>{mentor.name}</td>
                        <td>{mentor.position}</td>
                        {(canUserPerformAction("team", "mentors", "edit") ||
                          canUserPerformAction(
                            "team",
                            "mentors",
                            "delete"
                          )) && (
                            <td>
                              <div className="action-buttons">
                                {canUserPerformAction(
                                  "team",
                                  "mentors",
                                  "edit"
                                ) && (
                                    <button
                                      className="btn-edit"
                                      onClick={() => {
                                        handleEdit(mentor, "mentors");
                                        updateUrlPath("team", "update", "mentors");
                                      }}
                                    >
                                      Edit
                                    </button>
                                  )}
                                {canUserPerformAction(
                                  "team",
                                  "mentors",
                                  "delete"
                                ) && (
                                    <button
                                      className="btn-delete"
                                      onClick={() => {
                                        showConfirmationModal(
                                          "Delete Mentor",
                                          `Are you sure you want to delete "${mentor.name}"? This action cannot be undone.`,
                                          "delete",
                                          mentor.id,
                                          "mentors",
                                          mentor.name,
                                          () => handleDelete(mentor.id, "mentors")
                                        );
                                      }}
                                    >
                                      Delete
                                    </button>
                                  )}
                              </div>
                            </td>
                          )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Management Team Section */}
        {canUserPerformAction("team", "management", "view") && (
          <div className="team-section">
            <h4>Management Team ({management.length})</h4>
            {management.length === 0 ? (
              <p className="no-data">No management members found</p>
            ) : (
              <div className="team-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Designation</th>
                      {(canUserPerformAction("team", "management", "edit") ||
                        canUserPerformAction(
                          "team",
                          "management",
                          "delete"
                        )) && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {management.map((member) => (
                      <tr key={member.id}>
                        <td>{member.name}</td>
                        <td>{member.position}</td>
                        {(canUserPerformAction("team", "management", "edit") ||
                          canUserPerformAction(
                            "team",
                            "management",
                            "delete"
                          )) && (
                            <td>
                              <div className="action-buttons">
                                {canUserPerformAction(
                                  "team",
                                  "management",
                                  "edit"
                                ) && (
                                    <button
                                      className="btn-edit"
                                      onClick={() => {
                                        handleEdit(member, "management");
                                        updateUrlPath(
                                          "team",
                                          "update",
                                          "management"
                                        );
                                      }}
                                    >
                                      Edit
                                    </button>
                                  )}
                                {canUserPerformAction(
                                  "team",
                                  "management",
                                  "delete"
                                ) && (
                                    <button
                                      className="btn-delete"
                                      onClick={() => {
                                        showConfirmationModal(
                                          "Delete Management Member",
                                          `Are you sure you want to delete "${member.name}"? This action cannot be undone.`,
                                          "delete",
                                          member.id,
                                          "management",
                                          member.name,
                                          () =>
                                            handleDelete(member.id, "management")
                                        );
                                      }}
                                    >
                                      Delete
                                    </button>
                                  )}
                              </div>
                            </td>
                          )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Board of Trustees Section */}
        {canUserPerformAction("team", "board-trustees", "view") && (
          <div className="team-section">
            <h4>{localStorage.getItem("adminRegion") === "global" ? "Our Board of Directors" : "Board of Trustees"} ({boardTrustees.length})</h4>
            {boardTrustees.length === 0 ? (
              <p className="no-data">No {localStorage.getItem("adminRegion") === "global" ? "board of directors" : "board trustees"} found</p>
            ) : (
              <div className="team-table">
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Designation</th>
                      {(canUserPerformAction(
                        "team",
                        "board-trustees",
                        "edit"
                      ) ||
                        canUserPerformAction(
                          "team",
                          "board-trustees",
                          "delete"
                        )) && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {boardTrustees.map((trustee) => (
                      <tr key={trustee.id}>
                        <td>
                          {trustee.image ? (
                            <img
                              src={`${API_BASE}/uploads/board-trustees/${trustee.image}`}
                              alt={trustee.name}
                              className="team-avatar"
                            />
                          ) : (
                            <div className="avatar-placeholder">👤</div>
                          )}
                        </td>
                        <td>{trustee.name}</td>
                        <td>{trustee.position}</td>
                        {(canUserPerformAction(
                          "team",
                          "board-trustees",
                          "edit"
                        ) ||
                          canUserPerformAction(
                            "team",
                            "board-trustees",
                            "delete"
                          )) && (
                            <td>
                              <div className="action-buttons">
                                {canUserPerformAction(
                                  "team",
                                  "board-trustees",
                                  "edit"
                                ) && (
                                    <button
                                      className="btn-edit"
                                      onClick={() => {
                                        handleEdit(trustee, "board-trustees");
                                        updateUrlPath(
                                          "team",
                                          "update",
                                          "board-trustees"
                                        );
                                      }}
                                    >
                                      Edit
                                    </button>
                                  )}
                                {canUserPerformAction(
                                  "team",
                                  "board-trustees",
                                  "delete"
                                ) && (
                                    <button
                                      className="btn-delete"
                                      onClick={() => {
                                        showConfirmationModal(
                                          `Delete ${localStorage.getItem("adminRegion") === "global" ? "Board of Director" : "Board Trustee"}`,
                                          `Are you sure you want to delete "${trustee.name}"? This action cannot be undone.`,
                                          "delete",
                                          trustee.id,
                                          "board-trustees",
                                          trustee.name,
                                          () =>
                                            handleDelete(
                                              trustee.id,
                                              "board-trustees"
                                            )
                                        );
                                      }}
                                    >
                                      Delete
                                    </button>
                                  )}
                              </div>
                            </td>
                          )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Add this useEffect to fetch media data
  useEffect(() => {
    if (activeTab === "media" && currentMediaType && mediaAction === "view") {
      fetchMediaData();
    }
  }, [activeTab, currentMediaType, mediaAction]);

  const fetchMediaData = async () => {
    if (!currentMediaType) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const mediaData = await mediaService.getMediaByType(currentMediaType);
      setMediaItems(mediaData);
    } catch (error) {
      logger.error(`Error fetching ${currentMediaType}:`, error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        handleLogout();
      } else {
        toast.error(`Error fetching ${currentMediaType}: ${error.message}`);
      }
    }
    setLoading(false);
  };

  const renderMediaList = () => {
    return (
      <div className="content-list">
        <div className="content-header">
          <div className="header-row">
            <h3>
              {currentMediaType
                ? currentMediaType.charAt(0).toUpperCase() +
                currentMediaType.slice(1) +
                " Management"
                : "Media Corner"}
            </h3>
            {canUserPerformAction("media", currentMediaType, "create") && (
              <button
                className="btn-primary"
                onClick={() => {
                  setMediaAction("add");
                  setEditingMediaId(null);
                  setMediaForm({
                    title: "",
                    description: "",
                    content: "",
                    image: null,
                    pdf: null,
                    is_active: true,
                  });
                  updateUrlPath("media", "add", currentMediaType);
                }}
              >
                + Add{" "}
                {currentMediaType ? currentMediaType.slice(0, -1) : "Media"}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : mediaItems.length === 0 ? (
          <div className="no-data-message">
            <p>No {currentMediaType || "media items"} found</p>
            <p>
              <small>Total items: {mediaItems.length}</small>
            </p>
          </div>
        ) : (
          <div
            className={`items-list ${GRID_MEDIA_TYPES.includes(currentMediaType) ? "media-grid" : ""
              }`}
          >
            {mediaItems.map((item) => (
              <div
                key={item.id}
                className="item-card"
                style={{
                  borderLeft: `4px solid ${item.is_published ? "#4CAF50" : "#ff9800"
                    }`,
                }}
              >
                <div className="item-content">
                  <div className="media-header">
                    <h4>{item.title}</h4>
                    <span
                      className={`status-badge ${item.is_published ? "active" : "inactive"
                        }`}
                    >
                      {item.is_published ? "PUBLISHED" : "DRAFT"}
                    </span>
                  </div>

                  {/* REMOVE THIS DUPLICATE SECTION - it belongs in reports, not media */}
                  {/* <div className="report-header">
                  <h4>{item.title}</h4>
                  <span
                    className={`status-badge ${
                      item.is_published === 1 ? "active" : "inactive"
                    }`}
                  >
                    {item.is_published === 1 ? "PUBLISHED" : "DRAFT"}
                  </span>
                </div> */}

                  {item.image && (
                    <div className="media-image-preview">
                      <img
                        src={`${API_BASE}/uploads/media/${currentMediaType}/${(() => {
                          if (currentMediaType === "blogs") {
                            try {
                              const images = typeof item.image === "string" ? JSON.parse(item.image) : item.image;
                              return Array.isArray(images) ? images[0] : item.image;
                            } catch (e) {
                              return item.image;
                            }
                          }
                          return item.image;
                        })()}`}
                        alt={item.title}
                        onError={(e) => {
                          e.target.src = "/placeholder-blog.jpg";
                        }}
                      />
                    </div>
                  )}

                  <p>
                    <strong>Content:</strong> {item.content}
                  </p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>

                  {/* ADDED: Last modified info display */}
                  {renderLastModifiedInfo(item)}

                  {renderActionButtons(item, "media", currentMediaType)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCareerForm = () => {
    return (
      <div className="content-list">
        <div className="content-header">
          <div className="header-row">
            <button
              className="btn-back-career"
              onClick={() => {
                setCareerAction("all");
                setEditingId(null);
                cancelEdit();
                updateUrlPath("careers");
              }}
            >
              ← Back to Openings
            </button>
            <h3>
              {editingId ? "Edit Career Opening" : "Add New Career Opening"}
            </h3>
          </div>
        </div>

        <form
          onSubmit={(e) => handleSubmit(e, "careers")}
          className="dashboard-form"
        >
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={careerForm.title}
              onChange={(e) =>
                setCareerForm({ ...careerForm, title: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={careerForm.description}
              onChange={(e) =>
                setCareerForm({ ...careerForm, description: e.target.value })
              }
              required
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Requirements:</label>
            <textarea
              value={careerForm.requirements}
              onChange={(e) =>
                setCareerForm({ ...careerForm, requirements: e.target.value })
              }
              required
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              value={careerForm.location}
              onChange={(e) =>
                setCareerForm({ ...careerForm, location: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Type:</label>
            <select
              value={careerForm.type}
              onChange={(e) =>
                setCareerForm({ ...careerForm, type: e.target.value })
              }
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select
              value={careerForm.is_active}
              onChange={(e) =>
                setCareerForm({
                  ...careerForm,
                  is_active: e.target.value === "true",
                })
              }
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : editingId ? "Update" : "Create"}{" "}
              Opening
            </button>
            <button
              type="button"
              onClick={() => {
                setCareerAction("all");
                cancelEdit();
                updateUrlPath("careers");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const handleMediaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      const token = localStorage.getItem("token");

      // Append basic fields
      formData.append("title", mediaForm.title || "");
      formData.append("description", mediaForm.description || "");

      // Handle different media types
      if (["stories", "blogs"].includes(currentMediaType)) {
        formData.append("content", mediaForm.content || "");
      }

      // Add event-specific fields
      if (currentMediaType === "events") {
        formData.append("date", mediaForm.event_date || "");
        formData.append("time", mediaForm.event_time || "");
        formData.append("location", mediaForm.location || "");
      }

      if (currentMediaType === "documentaries") {
        formData.append("video_url", mediaForm.video_url || "");
        formData.append("duration", mediaForm.duration || "0:00");
        if (mediaForm.video_file) {
          formData.append("video_file", mediaForm.video_file);
        }
      }

      // Handle file uploads
      if (currentMediaType === "blogs") {
        blogSelectedFiles.forEach((file) => formData.append("image", file));
        formData.append("existing_images", JSON.stringify(existingBlogImages));
      } else if (mediaForm.image) {
        formData.append("image", mediaForm.image);
      }

      // SPECIAL HANDLING FOR NEWSLETTERS
      if (currentMediaType === "newsletters" && mediaForm.pdf) {
        formData.append("file", mediaForm.pdf);
      } else if (mediaForm.pdf) {
        formData.append("pdf", mediaForm.pdf);
      }

      // Add published_date and is_published
      formData.append("published_date", new Date().toISOString().split("T")[0]);
      formData.append("is_published", mediaForm.is_active);

      const adminRegion = localStorage.getItem("adminRegion");
      if (adminRegion) {
        formData.append("region", adminRegion);
      }

      // Debug: Log all form data entries
      logger.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        logger.log(key, value);
      }

      if (editingMediaId) {
        await mediaService.updateMedia(currentMediaType, editingMediaId, formData);
      } else {
        await mediaService.createMedia(currentMediaType, formData);
      }

      toast.success(
        `${currentMediaType.slice(0, -1)} ${editingMediaId ? "updated" : "created"
        } successfully!`
      );

      // Reset and refresh
      setMediaAction("view");
      setEditingMediaId(null);
      setMediaForm({
        title: "",
        description: "",
        content: "",
        image: null,
        pdf: null,
        video_url: "",
        video_file: null,
        duration: "",
        event_date: "",
        event_time: "",
        location: "",
        is_active: true,
      });
      setBlogImagePreviews([]);
      setBlogSelectedFiles([]);
      setExistingBlogImages([]);
      setImagePreview(null);
      fetchMediaData();
      updateUrlPath("media", "view", currentMediaType);
    } catch (error) {
      logger.error("Error saving media:", error);
      logger.error("Full error response:", error.response);

      // More detailed error message
      if (error.response?.data) {
        logger.error("Backend error details:", error.response.data);
        toast.error(`Error: ${error.response.data.error || "Unknown error"}`);
      } else {
        toast.error(`Error saving media: ${error.message}`);
      }
    }
    setLoading(false);
  };

  const handleMediaEdit = (item) => {
    setEditingMediaId(item.id);
    setMediaAction("update");
    setMediaForm({
      title: item.title || "",
      description: item.description || "",
      content: item.content || "",
      image: null,
      pdf: null,
      video_url: item.video_url || "",
      video_file: null,
      duration: item.duration || "",
      // Event specific fields
      event_date: item.date || "", // Maps to database 'date' column
      event_time: item.time || "", // Maps to database 'time' column
      location: item.location || "", // Maps to database 'location' column
      is_active: item.is_published !== undefined ? item.is_published : true,
    });
    setImagePreview(null);

    if (item.image) {
      if (currentMediaType === "blogs") {
        try {
          const images = typeof item.image === "string" ? JSON.parse(item.image) : item.image;
          setExistingBlogImages(Array.isArray(images) ? images : [item.image]);
        } catch (e) {
          setExistingBlogImages([item.image]);
        }
        setBlogImagePreviews([]);
        setBlogSelectedFiles([]);
      } else {
        setImagePreview(
          `${UPLOADS_BASE}/media/${currentMediaType}/${item.image}`
        );
      }
    }
  };

  const handleMediaStatusToggle = async (id, newStatus) => {
    setLoading(true);
    try {
      await mediaService.togglePublishStatus(currentMediaType, id, newStatus);
      toast.success(
        `Item ${newStatus ? "published" : "unpublished"} successfully!`
      );
      fetchMediaData();
    } catch (error) {
      logger.error("Error toggling media status:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        handleLogout();
      } else {
        toast.error(`Error updating status: ${error.message}`);
      }
    }
    setLoading(false);
  };

  const handleMediaDelete = async (id) => {
    setLoading(true);
    try {
      await mediaService.deleteMedia(currentMediaType, id);
      toast.success(`${currentMediaType.slice(0, -1)} deleted successfully!`);
      fetchMediaData();
    } catch (error) {
      logger.error("Error deleting media:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        handleLogout();
      } else {
        toast.error(`Error deleting item: ${error.message}`);
      }
    }
    setLoading(false);
  };

  // UPDATED: Improved legal report form with proper file handlers
  const renderLegalReportForm = () => {
    return (
      <div className="content-list">
        <div className="content-header">
          <div className="header-row">
            <button
              className="btn-back-legal"
              onClick={() => {
                setLegalReportAction("view");
                setEditingId(null);
                cancelEdit();
                updateUrlPath("reports");
              }}
            >
              ← Back to Reports
            </button>
            <h3>{editingId ? "Edit Legal Report" : "Add New Legal Report"}</h3>
          </div>
        </div>

        <form
          onSubmit={(e) => handleSubmit(e, "reports")}
          className="dashboard-form"
        >
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={reportForm.title}
              onChange={(e) =>
                setReportForm({ ...reportForm, title: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={reportForm.description}
              onChange={(e) =>
                setReportForm({ ...reportForm, description: e.target.value })
              }
              required
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Content:</label>
            <textarea
              value={reportForm.content}
              onChange={(e) =>
                setReportForm({ ...reportForm, content: e.target.value })
              }
              required
              rows="5"
            />
          </div>

          <div className="form-group">
            <label>Featured Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleReportImageChange} // Use the dedicated handler
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
            {/* Show current image if editing */}
            {editingId &&
              !imagePreview &&
              reports.find((r) => r.id === editingId)?.image && (
                <div className="current-image">
                  <small>
                    Current image:{" "}
                    {reports.find((r) => r.id === editingId).image}
                  </small>
                </div>
              )}
          </div>

          <div className="form-group">
            <label>PDF Document:</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleReportPdfChange} // Use the dedicated handler
            />
            <small>Upload PDF document (optional)</small>
            {reportForm.pdf && (
              <div className="file-preview">
                <span>📄 {reportForm.pdf.name}</span>
              </div>
            )}
            {/* Show current PDF if editing */}
            {editingId &&
              !reportForm.pdf &&
              reports.find((r) => r.id === editingId)?.pdf && (
                <div className="current-file">
                  <small>
                    Current PDF: {reports.find((r) => r.id === editingId).pdf}
                  </small>
                </div>
              )}
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : editingId ? "Update" : "Create"}{" "}
              Report
            </button>
            <button
              type="button"
              onClick={() => {
                setLegalReportAction("view");
                cancelEdit();
                updateUrlPath("reports");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderForm = () => {
    if (activeTab === "our-team") {
      if (teamAction === "view") {
        return renderTeamView();
      } else if (teamAction === "add" || teamAction === "update") {
        return renderTeamForm();
      }
    }

    if (
      activeTab === "media" &&
      currentMediaType &&
      (mediaAction === "add" || mediaAction === "update")
    ) {
      return renderMediaForm();
    }

    if (activeTab === "careers") {
      return null;
    }

    if (activeTab === "reports") {
      return null;
    }

    switch (activeTab) {
      case "media":
        if (!currentMediaType) {
          return (
            <div className="media-dashboard">
              <h3>Media Corner</h3>
              <div className="media-types-grid">
                {[
                  "newsletters",
                  "stories",
                  "events",
                  "blogs",
                  "documentaries",
                ]
                  .filter((type) =>
                    localStorage.getItem("adminRegion") === "global"
                      ? ["stories", "blogs"].includes(type)
                      : true
                  )
                  .map(
                    (type) =>
                      canUserPerformAction("media", type, "view") && (
                        <div
                          key={type}
                          className="media-type-card"
                          onClick={() => {
                            setCurrentMediaType(type);
                            updateUrlPath("media", "view", type);
                          }}
                        >
                          <h4>
                            {getMediaTypeIcon(type)}{" "}
                            {type.charAt(0).toUpperCase() +
                              type.slice(1).replace("_", " ")}
                          </h4>
                          <p>{getMediaTypeDescription(type)}</p>
                        </div>
                      )
                  )}
              </div>
            </div>
          );
        }
        return null;

      case "ourWork":
        if (!currentOurWorkCategory) {
          return (
            <div className="media-dashboard">
              <h3>Our Interventions</h3>
              <div className="media-types-grid">
                {[
                  "quality_education",
                  "livelihood",
                  "healthcare",
                  "environment_sustainability",
                  "integrated_development",
                ]
                  .filter((category) =>
                    localStorage.getItem("adminRegion") === "global"
                      ? [
                          "quality_education",
                          "livelihood",
                          "healthcare",
                          "environment_sustainability",
                        ].includes(category)
                      : true
                  )
                  .map(
                    (category) =>
                      canUserPerformAction("interventions", category, "view") && (
                        <div
                          key={category}
                          className="media-type-card"
                          onClick={() => {
                            setCurrentOurWorkCategory(category);
                            updateUrlPath("interventions", "view", category);
                          }}
                        >
                          <h4>
                            {getOurWorkCategoryIcon(category)}{" "}
                            {getOurWorkCategoryLabel(category)}
                          </h4>
                          <p>{getOurWorkCategoryDescription(category)}</p>
                        </div>
                      )
                  )}
              </div>
            </div>
          );
        }
        return null;

      default:
        return null;
    }
  };

  const renderContent = () => {
    if (activeTab === "our-team") {
      return null;
    }

    if (loading) return <div className="loading">Loading...</div>;
    if (activeTab === "media" && currentMediaType && mediaAction === "view") {
      return renderMediaList();
    }

    switch (activeTab) {
      case "reports":
        if (!canUserPerformAction("reports", null, "view")) {
          return (
            <div className="no-permission">
              <h3>Access Denied</h3>
              <p>You don't have permission to view legal reports.</p>
            </div>
          );
        }

        return (
          <div className="content-list">
            <div className="content-header">
              <div className="header-row">
                <h3>Legal Reports</h3>
                {canUserPerformAction("reports", null, "create") && (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setLegalReportAction("add");
                      setEditingId(null);
                      setReportForm({
                        title: "",
                        description: "",
                        content: "",
                        image: null,
                        pdf: null,
                      });
                      setImagePreview(null);
                      updateUrlPath("reports", "add");
                    }}
                  >
                    + Add Report
                  </button>
                )}
              </div>
            </div>

            {legalReportAction === "add" || legalReportAction === "update" ? (
              renderLegalReportForm()
            ) : (
              <>
                {reports.length === 0 ? (
                  <div className="no-data-message">
                    <p>No reports found</p>
                    <button
                      className="btn-refresh"
                      onClick={() => fetchData("reports")}
                    >
                      Refresh
                    </button>
                  </div>
                ) : (
                  <div className="items-grid">
                    {reports.map((report) => (
                      <div key={report.id} className="item-card">
                        {/* Display Image if exists */}
                        {report.image && (
                          <div className="item-image">
                            <img
                              src={`${API_BASE}/uploads/reports/${report.image}`}
                              alt={report.title}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </div>
                        )}

                        {/* Display PDF icon if PDF exists */}
                        {report.pdf && (
                          <div className="pdf-indicator">
                            <span className="pdf-icon">📄</span>
                            <span>PDF Available</span>
                          </div>
                        )}

                        <div className="item-content">
                          {/* ADD THIS: Status badge for reports */}
                          <div className="report-header">
                            <h4>{report.title}</h4>
                            <span
                              className={`status-badge ${report.is_published === 1
                                ? "active"
                                : "inactive"
                                }`}
                            >
                              {report.is_published === 1
                                ? "PUBLISHED"
                                : "DRAFT"}
                            </span>
                          </div>

                          <p>{report.description}</p>

                          {/* ADDED: Last modified info for reports - ADMIN/SUPER_ADMIN ONLY */}
                          {renderReportLastModifiedInfo(report)}

                          {/* Action Buttons */}
                          <div className="item-actions">
                            {/* View PDF Button if PDF exists */}
                            {report.pdf && (
                              <button
                                className="btn-pdf"
                                onClick={() =>
                                  window.open(
                                    `${API_BASE}/uploads/reports/${report.pdf}`,
                                    "_blank"
                                  )
                                }
                              >
                                View PDF
                              </button>
                            )}

                            {/* Publish/Unpublish Button - only for users with publish permission */}
                            {canUserPerformAction(
                              "reports",
                              null,
                              "publish"
                            ) && (
                                <button
                                  className={`status-toggle-btn ${report.is_published === 1
                                    ? "btn-inactive"
                                    : "btn-active"
                                    }`}
                                  onClick={() => {
                                    showConfirmationModal(
                                      report.is_published === 1
                                        ? "Unpublish Report"
                                        : "Publish Report",
                                      `Are you sure you want to ${report.is_published === 1
                                        ? "unpublish"
                                        : "publish"
                                      } "${report.title}"?`,
                                      report.is_published === 1
                                        ? "unpublish"
                                        : "publish",
                                      report.id,
                                      "reports",
                                      report.title,
                                      () =>
                                        handleReportStatusToggle(
                                          report.id,
                                          report.is_published !== 1
                                        )
                                    );
                                  }}
                                >
                                  {report.is_published === 1
                                    ? "Unpublish"
                                    : "Publish"}
                                </button>
                              )}

                            {canUserPerformAction("reports", null, "edit") && (
                              <button
                                className="btn-edit"
                                onClick={() => {
                                  setLegalReportAction("update");
                                  handleEdit(report, "reports");
                                  updateUrlPath("reports", "update");
                                }}
                              >
                                Edit
                              </button>
                            )}

                            {canUserPerformAction(
                              "reports",
                              null,
                              "delete"
                            ) && (
                                <button
                                  className="btn-delete"
                                  onClick={() => {
                                    showConfirmationModal(
                                      "Delete Report",
                                      `Are you sure you want to delete "${report.title}"? This action cannot be undone.`,
                                      "delete",
                                      report.id,
                                      "reports",
                                      report.title,
                                      () => handleDelete(report.id, "reports")
                                    );
                                  }}
                                >
                                  Delete
                                </button>
                              )}

                            {/* Show View Only if no actions available */}
                            {!canUserPerformAction("reports", null, "edit") &&
                              !canUserPerformAction(
                                "reports",
                                null,
                                "delete"
                              ) && (
                                <span className="view-only-badge">
                                  View Only
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );

      case "careers":
        if (!canUserPerformAction("careers", null, "view")) {
          return (
            <div className="no-permission">
              <h3>Access Denied</h3>
              <p>You don't have permission to view career openings.</p>
            </div>
          );
        }

        // Filter careers based on selected filter
        const getFilteredCareers = () => {
          switch (careerAction) {
            case "active":
              return careers.filter((career) => {
                return (
                  career.is_active === true ||
                  career.is_active === 1 ||
                  career.is_active === "true" ||
                  career.status === "active" ||
                  career.status === true ||
                  career.status === 1
                );
              });
            case "inactive":
              return careers.filter((career) => {
                return (
                  career.is_active === false ||
                  career.is_active === 0 ||
                  career.is_active === "false" ||
                  career.status === "inactive" ||
                  career.status === false ||
                  career.status === 0 ||
                  career.is_active === null ||
                  career.is_active === undefined
                );
              });
            case "all":
            default:
              return careers;
          }
        };

        const filteredCareers = getFilteredCareers();

        if (careerAction === "add" || careerAction === "update") {
          return renderCareerForm();
        }

        return (
          <div className="content-list">
            <div className="content-header">
              <div className="header-row">
                <h3>Career Openings</h3>
                {canUserPerformAction("careers", null, "create") && (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setCareerAction("add");
                      setEditingId(null);
                      setCareerForm({
                        title: "",
                        description: "",
                        requirements: "",
                        location: "",
                        type: "full-time",
                        is_active: true,
                      });
                      updateUrlPath("careers", "add");
                    }}
                  >
                    + Add Opening
                  </button>
                )}
              </div>

              <div className="filter-options">
                <select
                  value={careerAction}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    setCareerAction(selectedValue);
                    setEditingId(null);
                    updateUrlPath("careers", selectedValue);
                  }}
                  className="dropdown-select"
                >
                  <option value="all">All Openings ({careers.length})</option>
                  <option value="active">
                    Active Openings (
                    {
                      careers.filter((c) => {
                        return (
                          c.is_active === true ||
                          c.is_active === 1 ||
                          c.is_active === "true" ||
                          c.status === "active" ||
                          c.status === true ||
                          c.status === 1
                        );
                      }).length
                    }
                    )
                  </option>
                  <option value="inactive">
                    Inactive Openings (
                    {
                      careers.filter((c) => {
                        return (
                          c.is_active === false ||
                          c.is_active === 0 ||
                          c.is_active === "false" ||
                          c.status === "inactive" ||
                          c.status === false ||
                          c.status === 0 ||
                          c.is_active === null ||
                          c.is_active === undefined
                        );
                      }).length
                    }
                    )
                  </option>
                </select>
              </div>
            </div>

            {filteredCareers.length === 0 ? (
              <div className="no-data-message">
                <p>No career openings found for "{careerAction}" filter</p>
              </div>
            ) : (
              <div className="items-list">
                {filteredCareers.map((career) => {
                  const isActive =
                    career.is_active === true ||
                    career.is_active === 1 ||
                    career.is_active === "true" ||
                    career.status === "active" ||
                    career.status === true ||
                    career.status === 1;

                  return (
                    <div
                      key={career.id}
                      className="item-card"
                      style={{
                        borderLeft: `4px solid ${isActive ? "#4CAF50" : "#ff9800"
                          }`,
                      }}
                    >
                      <div className="item-content">
                        <div className="career-header">
                          <h4>{career.title}</h4>
                          <span
                            className={`status-badge ${isActive ? "active" : "inactive"
                              }`}
                          >
                            {isActive ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </div>
                        <p>
                          <strong>Location:</strong> {career.location}
                        </p>
                        <p>
                          <strong>Type:</strong> {career.type}
                        </p>
                        <p>
                          <strong>Created:</strong>{" "}
                          {career.created_at
                            ? new Date(career.created_at).toLocaleDateString()
                            : "N/A"}
                        </p>

                        <div className="career-description">
                          <strong>Description:</strong>
                          <SanitizedHTML
                            content={
                              career.description
                                ? career.description.substring(0, 150) + "..."
                                : "No description available"
                            }
                          />
                        </div>

                        {/* ADDED: Last modified info for careers */}
                        {renderLastModifiedInfo(career)}

                        <div className="item-actions">
                          {/* Status Toggle Buttons - only for users with publish permission */}
                          {canUserPerformAction("careers", null, "publish") && (
                            <button
                              className={`status-toggle-btn ${isActive ? "btn-inactive" : "btn-active"
                                }`}
                              onClick={() => {
                                showConfirmationModal(
                                  isActive
                                    ? "Deactivate Career"
                                    : "Activate Career",
                                  `Are you sure you want to ${isActive ? "deactivate" : "activate"
                                  } "${career.title}"?`,
                                  isActive ? "deactivate" : "activate",
                                  career.id,
                                  "careers",
                                  career.title,
                                  () => handleStatusToggle(career.id, !isActive)
                                );
                              }}
                            >
                              {isActive ? "Deactivate" : "Activate"}
                            </button>
                          )}

                          {/* Edit Button - only for users with edit permission */}
                          {canUserPerformAction("careers", null, "edit") && (
                            <button
                              className="btn-edit"
                              onClick={() => {
                                setCareerAction("update");
                                handleEdit(career, "careers");
                                updateUrlPath("careers", "update");
                              }}
                            >
                              Edit
                            </button>
                          )}

                          {/* Delete Button - only for users with delete permission */}
                          {canUserPerformAction("careers", null, "delete") && (
                            <button
                              className="btn-delete"
                              onClick={() => {
                                showConfirmationModal(
                                  "Delete Career Opening",
                                  `Are you sure you want to delete "${career.title}"? This action cannot be undone.`,
                                  "delete",
                                  career.id,
                                  "careers",
                                  career.title,
                                  () => handleDelete(career.id, "careers")
                                );
                              }}
                            >
                              Delete
                            </button>
                          )}

                          {/* View Only Indicator */}
                          {!canUserPerformAction("careers", null, "edit") &&
                            !canUserPerformAction("careers", null, "delete") &&
                            !canUserPerformAction(
                              "careers",
                              null,
                              "publish"
                            ) && (
                              <span className="view-only-badge">View Only</span>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const selectTopLevelTab = (tab) => {
    setActiveTab(tab);
    setOpenDropdown(null);
    setCurrentTeamType(null);
    setCurrentMediaType(null);
    setCurrentOurWorkCategory(null);
    setTeamAction("view");
    setCareerAction("current");
    setLegalReportAction("view");
    updateUrlPath(tab);
  };

  const handleTeamAction = (action) => {
    if (action === "team") {
      setTeamAction("view");
      updateUrlPath("team");
    } else if (action === "add") {
      setTeamAction("add");
      setCurrentTeamType(null);
      updateUrlPath("team", "add");
    } else if (action === "update") {
      setTeamAction("update");
      setCurrentTeamType(null);
      updateUrlPath("team", "update");
    }
  };

  // Add Confirmation Modal Component
  const ConfirmationModal = () => {
    if (!showConfirmation) return null;

    const getIcon = () => {
      switch (confirmationData.type) {
        case "delete":
          return "🗑️";
        case "publish":
          return "📢";
        case "unpublish":
          return "📝";
        case "activate":
          return "✅";
        case "deactivate":
          return "⏸️";
        default:
          return "⚠️";
      }
    };

    const getButtonColor = () => {
      switch (confirmationData.type) {
        case "delete":
          return "btn-delete";
        case "publish":
          return "btn-active";
        case "activate":
          return "btn-active";
        case "unpublish":
        case "deactivate":
          return "btn-inactive";
        default:
          return "btn-primary";
      }
    };

    const getConfirmButtonText = () => {
      switch (confirmationData.type) {
        case "delete":
          return "Delete";
        case "publish":
          return "Publish";
        case "unpublish":
          return "Unpublish";
        case "activate":
          return "Activate";
        case "deactivate":
          return "Deactivate";
        default:
          return "Confirm";
      }
    };

    return (
      <div className="confirmation-modal-overlay">
        <div className="confirmation-modal">
          <div className="confirmation-modal-header">
            <div className="confirmation-icon">{getIcon()}</div>
            <h3>{confirmationData.title}</h3>
          </div>
          <div className="confirmation-modal-body">
            <p>{confirmationData.message}</p>
            {confirmationData.itemName && (
              <div className="confirmation-item-name">
                <strong>Item:</strong> {confirmationData.itemName}
              </div>
            )}
          </div>
          <div className="confirmation-modal-footer">
            <button className="btn-cancel" onClick={hideConfirmationModal}>
              Cancel
            </button>
            <button
              className={`btn-confirm ${getButtonColor()}`}
              onClick={handleConfirmation}
            >
              {getConfirmButtonText()}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-brand">
          <h2>Admin Dashboard</h2>
          <span className={`region-badge ${localStorage.getItem("adminRegion") === "global" ? "global" : "india"}`}>
            {localStorage.getItem("adminRegion") === "global" ? "🌍 Global Region" : "🇮🇳 India Region"}
          </span>
        </div>
        {currentUser && (
          <div className="user-info">
            <span>
              Welcome, {currentUser.username} ({currentUser.role})
            </span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        )}
      </header>

      <div className="dashboard-container">
        <nav className="dashboard-sidebar">
          <ul>
            {/* Interventions with Sub Dropdown */}
            {canUserPerformAction("interventions", null, "view") && (
              <li className={activeTab === "ourWork" ? "active" : ""}>
                <button
                  onClick={() => {
                    if (openDropdown === "ourWork") {
                      setOpenDropdown(null);
                      setInterventionsSubDropdown(null);
                    } else {
                      setOpenDropdown("ourWork");
                      setActiveTab("ourWork");
                      setCurrentOurWorkCategory(null);
                      setInterventionsAction("view");
                      updateUrlPath("interventions");
                    }
                  }}
                >
                  Interventions {openDropdown === "ourWork" ? "▴" : "▾"}
                </button>
                {openDropdown === "ourWork" && (
                  <ul className="submenu">
                    {[
                      "quality_education",
                      "livelihood",
                      "healthcare",
                      "environment_sustainability",
                      "integrated_development",
                    ]
                      .filter((category) =>
                        localStorage.getItem("adminRegion") === "global"
                          ? [
                              "quality_education",
                              "livelihood",
                              "healthcare",
                              "environment_sustainability",
                            ].includes(category)
                          : true
                      )
                      .map(
                        (category) =>
                          canUserPerformAction(
                            "interventions",
                            category,
                            "view"
                          ) && (
                            <li
                              key={category}
                              className="interventions-dropdown-item"
                            >
                              <div className="interventions-type-header">
                                <button
                                  className="interventions-type-btn"
                                  onClick={() =>
                                    handleInterventionsSubDropdown(category)
                                  }
                                >
                                  <span className="interventions-type-label">
                                    {getOurWorkCategoryIcon(category)}{" "}
                                    {getOurWorkCategoryLabel(category)}
                                  </span>
                                  <span>
                                    {interventionsSubDropdown === category
                                      ? "▴"
                                      : "▾"}
                                  </span>
                                </button>
                              </div>

                              {interventionsSubDropdown === category && (
                                <ul className="interventions-submenu">
                                  <li>
                                    <button
                                      onClick={() =>
                                        handleInterventionsAction(
                                          category,
                                          "view"
                                        )
                                      }
                                      className={
                                        currentOurWorkCategory === category &&
                                          interventionsAction === "view"
                                          ? "active-sub"
                                          : ""
                                      }
                                    >
                                      📋 View {getOurWorkCategoryLabel(category)}
                                    </button>
                                  </li>
                                  {canUserPerformAction(
                                    "interventions",
                                    category,
                                    "create"
                                  ) && (
                                      <li>
                                        <button
                                          onClick={() =>
                                            handleInterventionsAction(
                                              category,
                                              "add"
                                            )
                                          }
                                          className={
                                            currentOurWorkCategory === category &&
                                              interventionsAction === "add"
                                              ? "active-sub"
                                              : ""
                                          }
                                        >
                                          ➕ Add {getOurWorkCategoryLabel(category)}
                                        </button>
                                      </li>
                                    )}
                                  {canUserPerformAction(
                                    "interventions",
                                    category,
                                    "edit"
                                  ) && (
                                      <li>
                                        <button
                                          onClick={() =>
                                            handleInterventionsAction(
                                              category,
                                              "update"
                                            )
                                          }
                                          className={
                                            currentOurWorkCategory === category &&
                                              interventionsAction === "update"
                                              ? "active-sub"
                                              : ""
                                          }
                                        >
                                          ✏️ Update{" "}
                                          {getOurWorkCategoryLabel(category)}
                                        </button>
                                      </li>
                                    )}
                                </ul>
                              )}
                            </li>
                          )
                      )}
                  </ul>
                )}
              </li>
            )}

            {/* Media Corner with Sub Dropdown */}
            {canUserPerformAction("media", null, "view") && (
              <li className={activeTab === "media" ? "active" : ""}>
                <button
                  onClick={() => {
                    if (openDropdown === "media") {
                      setOpenDropdown(null);
                      setMediaSubDropdown(null);
                    } else {
                      setOpenDropdown("media");
                      setActiveTab("media");
                      setCurrentMediaType(null);
                      setMediaAction("view");
                      updateUrlPath("media");
                    }
                  }}
                >
                  Media Corner {openDropdown === "media" ? "▴" : "▾"}
                </button>
                {openDropdown === "media" && (
                  <ul className="submenu">
                    {[
                      "newsletters",
                      "stories",
                      "events",
                      "blogs",
                      "documentaries",
                    ]
                      .filter((type) =>
                        localStorage.getItem("adminRegion") === "global"
                          ? ["stories", "blogs"].includes(type)
                          : true
                      )
                      .map(
                        (type) =>
                          canUserPerformAction("media", type, "view") && (
                            <li key={type} className="media-dropdown-item">
                              <div className="media-type-header">
                                <button
                                  className="media-type-btn"
                                  onClick={() => handleMediaSubDropdown(type)}
                                >
                                  <span className="media-type-label">
                                    {getMediaTypeIcon(type)}{" "}
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                  </span>
                                  <span>
                                    {mediaSubDropdown === type ? "▴" : "▾"}
                                  </span>
                                </button>
                              </div>

                              {mediaSubDropdown === type && (
                                <ul className="media-submenu">
                                  <li>
                                    <button
                                      onClick={() =>
                                        handleMediaAction(type, "view")
                                      }
                                      className={
                                        currentMediaType === type &&
                                          mediaAction === "view"
                                          ? "active-sub"
                                          : ""
                                      }
                                    >
                                      📋 View {type}
                                    </button>
                                  </li>
                                  {canUserPerformAction(
                                    "media",
                                    type,
                                    "create"
                                  ) && (
                                      <li>
                                        <button
                                          onClick={() =>
                                            handleMediaAction(type, "add")
                                          }
                                          className={
                                            currentMediaType === type &&
                                              mediaAction === "add"
                                              ? "active-sub"
                                              : ""
                                          }
                                        >
                                          ➕ Add {type.slice(0, -1)}
                                        </button>
                                      </li>
                                    )}
                                  {canUserPerformAction(
                                    "media",
                                    type,
                                    "edit"
                                  ) && (
                                      <li>
                                        <button
                                          onClick={() =>
                                            handleMediaAction(type, "update")
                                          }
                                          className={
                                            currentMediaType === type &&
                                              mediaAction === "update"
                                              ? "active-sub"
                                              : ""
                                          }
                                        >
                                          ✏️ Update {type.slice(0, -1)}
                                        </button>
                                      </li>
                                    )}
                                </ul>
                              )}
                            </li>
                          )
                      )}
                  </ul>
                )}
              </li>
            )}

            {/* Impact Data */}
            {canUserPerformAction("impact", null, "view") && localStorage.getItem("adminRegion") !== "global" && (
              <li className={activeTab === "impact" ? "active" : ""}>
                <button
                  onClick={() => {
                    setActiveTab("impact");
                    setOpenDropdown(null);
                    updateUrlPath("impact");
                  }}
                >
                  Impact Data
                </button>
              </li>
            )}

            {/* Banner Management */}
            {canUserPerformAction("banners", null, "view") && (
              <li className={activeTab === "banners" ? "active" : ""}>
                <button
                  onClick={() => {
                    if (openDropdown === "banners") {
                      setOpenDropdown(null);
                    } else {
                      setOpenDropdown("banners");
                      setActiveTab("banners");
                      updateUrlPath("banners");
                    }
                  }}
                >
                  Banner Management {openDropdown === "banners" ? "▴" : "▾"}
                </button>
                {openDropdown === "banners" && (
                  <ul className="submenu">
                    <li>
                      <button
                        onClick={() => {
                          handleBannerAction("view");
                        }}
                      >
                        Show Banners
                      </button>
                    </li>
                    {canUserPerformAction("banners", null, "create") && (
                      <li>
                        <button
                          onClick={() => {
                            handleBannerAction("add");
                          }}
                        >
                          Add Banner
                        </button>
                      </li>
                    )}
                    {canUserPerformAction("banners", null, "edit") && (
                      <li>
                        <button
                          onClick={() => {
                            handleBannerAction("update");
                          }}
                        >
                          Update Banner
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            )}

            {/* Partners Management */}
            {canUserPerformAction("partners", null, "view") && localStorage.getItem("adminRegion") === "global" && (
              <li className={activeTab === "partners" ? "active" : ""}>
                <button
                  onClick={() => {
                    if (openDropdown === "partners") {
                      setOpenDropdown(null);
                    } else {
                      setOpenDropdown("partners");
                      setActiveTab("partners");
                      updateUrlPath("partners");
                    }
                  }}
                >
                  Partners Management {openDropdown === "partners" ? "▴" : "▾"}
                </button>
                {openDropdown === "partners" && (
                  <ul className="submenu">
                    <li>
                      <button
                        onClick={() => {
                          handlePartnerAction("view");
                        }}
                      >
                        Show Partners
                      </button>
                    </li>
                    {canUserPerformAction("partners", null, "create") && (
                      <li>
                        <button
                          onClick={() => {
                            handlePartnerAction("add");
                          }}
                        >
                          Add Partner
                        </button>
                      </li>
                    )}
                    {canUserPerformAction("partners", null, "edit") && (
                      <li>
                        <button
                          onClick={() => {
                            handlePartnerAction("update");
                          }}
                        >
                          Update Partner
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            )}

            {/* Accreditations Section */}
            {canUserPerformAction("accreditations", null, "view") && localStorage.getItem("adminRegion") !== "global" && (
              <li className={activeTab === "accreditations" ? "active" : ""}>
                <button
                  onClick={() => {
                    if (openDropdown === "accreditations") {
                      setOpenDropdown(null);
                    } else {
                      setOpenDropdown("accreditations");
                      setActiveTab("accreditations");
                      updateUrlPath("accreditations");
                    }
                  }}
                >
                  Accreditations {openDropdown === "accreditations" ? "▴" : "▾"}
                </button>
                {openDropdown === "accreditations" && (
                  <ul className="submenu">
                    <li>
                      <button
                        onClick={() => {
                          handleAccreditationAction("view");
                        }}
                      >
                        Show Accreditations
                      </button>
                    </li>
                    {canUserPerformAction("accreditations", null, "create") && (
                      <li>
                        <button
                          onClick={() => {
                            handleAccreditationAction("add");
                          }}
                        >
                          Add Accreditation
                        </button>
                      </li>
                    )}
                    {canUserPerformAction("accreditations", null, "edit") && (
                      <li>
                        <button
                          onClick={() => {
                            handleAccreditationAction("update");
                          }}
                        >
                          Update Accreditation
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            )}

            {/* Team */}
            {canUserPerformAction("team", null, "view") && (
              <li className={activeTab === "our-team" ? "active" : ""}>
                <button
                  onClick={() => {
                    if (openDropdown === "our-team") {
                      setOpenDropdown(null);
                    } else {
                      setOpenDropdown("our-team");
                      setActiveTab("our-team");
                      updateUrlPath("team");
                    }
                  }}
                >
                  Team {openDropdown === "our-team" ? "▴" : "▾"}
                </button>
                {openDropdown === "our-team" && (
                  <ul className="submenu">
                    <li>
                      <button
                        onClick={() => {
                          handleTeamAction("team");
                          setOpenDropdown(null);
                        }}
                      >
                        Team
                      </button>
                    </li>
                    {canUserPerformAction("team", null, "create") && (
                      <li>
                        <button
                          onClick={() => {
                            handleTeamAction("add");
                            setOpenDropdown(null);
                          }}
                        >
                          Add User
                        </button>
                      </li>
                    )}
                    {canUserPerformAction("team", null, "edit") && (
                      <li>
                        <button
                          onClick={() => {
                            handleTeamAction("update");
                            setOpenDropdown(null);
                          }}
                        >
                          Update User
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            )}

            {/* Career */}
            {canUserPerformAction("careers", null, "view") && (
              <li className={activeTab === "careers" ? "active" : ""}>
                <button
                  onClick={() => {
                    if (openDropdown === "careers") {
                      setOpenDropdown(null);
                    } else {
                      setOpenDropdown("careers");
                      setActiveTab("careers");
                      updateUrlPath("careers");
                    }
                  }}
                >
                  Career {openDropdown === "careers" ? "▴" : "▾"}
                </button>
                {openDropdown === "careers" && (
                  <ul className="submenu">
                    <li>
                      <button
                        onClick={() => {
                          setCareerAction("current");
                          setOpenDropdown(null);
                        }}
                      >
                        Career
                      </button>
                    </li>
                    {canUserPerformAction("careers", null, "create") && (
                      <li>
                        <button
                          onClick={() => {
                            setCareerAction("add");
                            setOpenDropdown(null);
                          }}
                        >
                          Add Opening
                        </button>
                      </li>
                    )}
                    {canUserPerformAction("careers", null, "edit") && (
                      <li>
                        <button
                          onClick={() => {
                            setCareerAction("update");
                            setOpenDropdown(null);
                          }}
                        >
                          Update Opening
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            )}

            {/* Legal Report */}
            {canUserPerformAction("reports", null, "view") && (
              <li className={activeTab === "reports" ? "active" : ""}>
                <button
                  onClick={() => {
                    if (openDropdown === "reports") {
                      setOpenDropdown(null);
                    } else {
                      setOpenDropdown("reports");
                      setActiveTab("reports");
                      updateUrlPath("reports");
                    }
                  }}
                >
                  Legal Report {openDropdown === "reports" ? "▴" : "▾"}
                </button>
                {openDropdown === "reports" && (
                  <ul className="submenu">
                    <li>
                      <button
                        onClick={() => {
                          setLegalReportAction("view");
                          setOpenDropdown(null);
                        }}
                      >
                        Show Legal Reports
                      </button>
                    </li>
                    {canUserPerformAction("reports", null, "create") && (
                      <li>
                        <button
                          onClick={() => {
                            setLegalReportAction("add");
                            setOpenDropdown(null);
                          }}
                        >
                          Add Report
                        </button>
                      </li>
                    )}
                    {canUserPerformAction("reports", null, "edit") && (
                      <li>
                        <button
                          onClick={() => {
                            setLegalReportAction("update");
                            setOpenDropdown(null);
                          }}
                        >
                          Update Report
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            )}

            {/* User Management - UPDATED WITH THREE BUTTONS */}
            {canUserPerformAction("users", null, "view") && (
              <li
                className={
                  activeTab === "users" ||
                    activeTab === "registrations" ||
                    activeTab === "add-user" ||
                    activeTab === "permissions"
                    ? "active"
                    : ""
                }
              >
                <button
                  onClick={() => {
                    if (openDropdown === "users") {
                      setOpenDropdown(null);
                    } else {
                      setOpenDropdown("users");
                      setActiveTab("users");
                      updateUrlPath("users");
                    }
                  }}
                >
                  User Management {openDropdown === "users" ? "▴" : "▾"}
                </button>
                {openDropdown === "users" && (
                  <ul className="submenu">
                    {canUserPerformAction("users", "users", "view") && (
                      <>
                        <li>
                          <button
                            className={
                              activeTab === "users" ? "active-sub" : ""
                            }
                            onClick={() => {
                              setActiveTab("users");
                              setOpenDropdown(null);
                              updateUrlPath("users");
                            }}
                          >
                            <i className="fas fa-shield-alt"></i> User
                            Permissions
                          </button>
                        </li>
                        <li>
                          <button
                            className={
                              activeTab === "add-user" ? "active-sub" : ""
                            }
                            onClick={() => {
                              setActiveTab("add-user");
                              setOpenDropdown(null);
                              updateUrlPath("users", "add");
                            }}
                          >
                            <i className="fas fa-user-plus"></i> Add User
                          </button>
                        </li>
                      </>
                    )}
                    {canUserPerformAction("users", "registrations", "view") && (
                      <li>
                        <button
                          className={
                            activeTab === "registrations" ? "active-sub" : ""
                          }
                          onClick={() => {
                            setActiveTab("registrations");
                            setOpenDropdown(null);
                            updateUrlPath("registrations");
                          }}
                        >
                          <i className="fas fa-users"></i> New Users
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            )}
          </ul>
        </nav>

        <main className="dashboard-content">
          {currentMediaType ? (
            <div className="media-content-section">
              <div className="media-content-header">
                <h3>
                  {currentMediaType.charAt(0).toUpperCase() +
                    currentMediaType.slice(1)}{" "}
                  Management
                  {mediaAction === "add" && " - Add New"}
                  {mediaAction === "update" && " - Edit"}
                </h3>
                <div className="media-action-controls">
                  <button
                    className="btn-back-media"
                    onClick={() => {
                      if (mediaAction !== "view") {
                        setMediaAction("view");
                        setEditingMediaId(null);
                        updateUrlPath("media", "view", currentMediaType);
                      } else {
                        setCurrentMediaType(null);
                        updateUrlPath("media");
                      }
                      setMediaForm({
                        title: "",
                        description: "",
                        content: "",
                        image: null,
                        pdf: null,
                        video_url: "",
                        video_file: null,
                        is_active: true,
                      });
                    }}
                  >
                    ← Back to{" "}
                    {mediaAction !== "view" ? currentMediaType : "Media Corner"}
                  </button>
                </div>
              </div>

              {mediaAction === "view" ? renderMediaList() : renderMediaForm()}
            </div>
          ) : currentOurWorkCategory ? (
            renderOurWorkManagement()
          ) : currentAccreditationType && localStorage.getItem("adminRegion") !== "global" ? (
            renderAccreditationContent()
          ) : currentBannerType ? (
            renderBannerContent()
          ) : currentPartnerType && localStorage.getItem("adminRegion") === "global" ? (
            renderPartnerContent()
          ) : activeTab === "users" &&
            canUserPerformAction("users", "users", "view") ? (
            <UserManagement
              activeSubTab="users"
              // ADDED: Pass confirmation modal functions
              onShowConfirmation={showConfirmationModal}
              onHideConfirmation={hideConfirmationModal}
            />
          ) : activeTab === "add-user" &&
            canUserPerformAction("users", "users", "create") ? (
            <UserManagement
              activeSubTab="add-user"
              // ADDED: Pass confirmation modal functions
              onShowConfirmation={showConfirmationModal}
              onHideConfirmation={hideConfirmationModal}
            />
          ) : activeTab === "permissions" &&
            canUserPerformAction("users", "users", "edit") ? (
            <UserManagement
              activeSubTab="permissions"
              // ADDED: Pass confirmation modal functions
              onShowConfirmation={showConfirmationModal}
              onHideConfirmation={hideConfirmationModal}
            />
          ) : activeTab === "registrations" &&
            canUserPerformAction("users", "registrations", "view") ? (
            <RegistrationRequests
              // ADDED: Pass confirmation modal functions
              onShowConfirmation={showConfirmationModal}
              onHideConfirmation={hideConfirmationModal}
            />
          ) : activeTab === "impact" &&
            canUserPerformAction("impact", null, "view") && localStorage.getItem("adminRegion") !== "global" ? (
            <ImpactDataEditor
              // ADDED: Pass confirmation modal functions
              onShowConfirmation={showConfirmationModal}
              onHideConfirmation={hideConfirmationModal}
            />
          ) : (
            <>
              {renderForm()}
              {renderContent()}
            </>
          )}
        </main>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal />
    </div>
  );
};

export default Dashboard;
