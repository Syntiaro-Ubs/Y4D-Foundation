import React, { useState, useEffect } from 'react';
import { UPLOADS_BASE } from '../../config/api';
import { ourworkService } from '../../api/services/ourwork.service';
import logger from "../../utils/logger";
import toast from "../../utils/toast";
import confirmDialog from "../../utils/confirmDialog";

const OurWorkManager = ({ category, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image_url: '',
    video_url: '',
    additional_images: [],
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    is_active: true,
    display_order: 0
  });
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const categoryLabels = {
    quality_education: 'Quality Education',
    livelihood: 'Sustainable Livelihood',
    healthcare: 'Healthcare',
    environment_sustainability: 'Environment Sustainability',
    integrated_development: 'Integrated Development Program (IDP)'
  };

  useEffect(() => {
    if (category) {
      fetchItems();
    }
  }, [category]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ourworkService.getItemsByCategory(category, { active_only: false });
      setItems(data);
    } catch (error) {
      logger.error('Error fetching items:', error);
      setError('Failed to load items. Please check console for details.');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingItem) {
        await ourworkService.updateItem(category, editingItem.id, formData);
      } else {
        await ourworkService.createItem(category, formData);
      }

      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        content: '',
        image_url: '',
        video_url: '',
        additional_images: [],
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        is_active: true,
        display_order: 0
      });
      fetchItems();
      
      toast.success(`Item ${editingItem ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      logger.error('Error saving item:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.details || 'Failed to save. Please check console for details.';
      setError(errorMessage);
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
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
      display_order: item.display_order
    });
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDialog('Are you sure you want to delete this item?', 'Delete');
    if (!confirmed) return;

    try {
      await ourworkService.deleteItem(category, id);
      fetchItems();
      toast.success('Item deleted successfully!');
    } catch (error) {
      logger.error('Error deleting item:', error);
      toast.error(`Error: ${error.response?.data?.error || 'Failed to delete'}`);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await ourworkService.toggleItemStatus(category, id, !currentStatus);
      fetchItems();
      toast.success(`Item ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      logger.error('Error toggling status:', error);
      toast.error(`Error: ${error.response?.data?.error || 'Failed to update status'}`);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="our-work-manager">
      <div className="our-work-header">
        <h2>{categoryLabels[category]} Management</h2>
        <button onClick={onClose} className="close-btn">← Back</button>
      </div>

      <form onSubmit={handleSubmit} className="our-work-form">
        <h3>{editingItem ? 'Edit' : 'Add New'} Item</h3>
        
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label>Content:</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            rows="6"
            placeholder="Detailed content (HTML supported)"
          />
        </div>

        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="form-group">
          <label>Video URL:</label>
          <input
            type="url"
            value={formData.video_url}
            onChange={(e) => setFormData({...formData, video_url: e.target.value})}
            placeholder="https://youtube.com/embed/video-id"
          />
        </div>

        <div className="form-group">
          <label>Display Order:</label>
          <input
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
          />
        </div>

        <div className="form-group">
          <label>Status:</label>
          <select
            value={formData.is_active ? 'true' : 'false'}
            onChange={(e) => setFormData({...formData, is_active: e.target.value === 'true'})}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (editingItem ? 'Update' : 'Create')} Item
          </button>
          <button type="button" onClick={() => {
            setEditingItem(null);
            setFormData({
              title: '',
              description: '',
              content: '',
              image_url: '',
              video_url: '',
              additional_images: [],
              meta_title: '',
              meta_description: '',
              meta_keywords: '',
              is_active: true,
              display_order: 0
            });
          }}>
            Cancel
          </button>
        </div>
      </form>

      <div className="our-work-list">
        <h3>Existing Items</h3>
        {items.length === 0 ? (
          <p>No items found</p>
        ) : (
          <div className="items-grid">
            {items.map(item => (
              <div key={item.id} className="item-card">
                {item.image_url && (
                  <div className="item-image">
  <img
    src={
      item.image_url
        ? (item.image_url.startsWith('http') 
            ? item.image_url 
            : `${UPLOADS_BASE}/${item.image_url.replace(/^\/api\/uploads\//, '')}`
          )
        : '/placeholder-image.jpg'
    }
    alt={item.title || 'No title'}
    onError={(e) => {
      e.target.onerror = null; // 🔑 prevent infinite loop
      e.target.src = '/placeholder-image.jpg';
    }}
  />
</div>
   
                )}
                <div className="item-content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <p className={`status ${item.is_active ? 'active' : 'inactive'}`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </p>
                  <p className="order">Order: {item.display_order}</p>
                  <div className="item-actions">
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button onClick={() => toggleStatus(item.id, item.is_active)}>
                      {item.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
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

export default OurWorkManager;
