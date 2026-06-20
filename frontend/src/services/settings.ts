import api from './api';

export interface SiteSettings {
  id: string; siteName: string; siteSlogan?: string; metaTitle?: string;
  metaDescription?: string; seoKeywords?: string; defaultLanguage: string;
  defaultCurrency: string; contactEmail?: string; contactPhone?: string;
  contactAddress?: string; socialFacebook?: string; socialInstagram?: string;
  socialTwitter?: string; socialYoutube?: string; logoUrl?: string;
  faviconUrl?: string; maintenanceMode: boolean; allowRegistration: boolean;
  allowReviews: boolean; allowBooking: boolean;
}

export interface ThemeSettings {
  id: string; primaryColor: string; secondaryColor: string; accentColor: string;
  bgColor: string; textColor: string; cardColor: string; borderColor: string;
  headerColor: string; footerColor: string; fontFamily: string; headingFont: string;
  fontSize: string; lineHeight: string; borderRadius: string;
  buttonStyle: string; cardStyle: string; customCss?: string;
}

export interface MediaFile {
  id: string; url: string; name: string; altText?: string; caption?: string;
  size?: number; mimeType?: string; folder: string; createdAt: string;
}

export interface MenuItem {
  id: string; label: string; href?: string; linkType: string; target: string;
  menuType: string; parentId?: string; sortOrder: number; active: boolean;
  children?: MenuItem[];
}

export const settingsService = {
  getSite:         () => api.get<{ data: SiteSettings }>('/settings/site').then(r => r.data),
  updateSite:      (data: Partial<SiteSettings>) => api.put('/settings/site', data).then(r => r.data),
  getTheme:        () => api.get<{ data: ThemeSettings }>('/settings/theme').then(r => r.data),
  updateTheme:     (data: Partial<ThemeSettings>) => api.put('/settings/theme', data).then(r => r.data),
  getMedia:        (folder?: string) => api.get('/settings/media', { params: folder ? { folder } : {} }).then(r => r.data),
  createMedia:     (data: Partial<MediaFile>) => api.post('/settings/media', data).then(r => r.data),
  deleteMedia:     (id: string) => api.delete(`/settings/media/${id}`).then(r => r.data),
  getMenus:        (menuType?: string) => api.get('/settings/menus', { params: menuType ? { menuType } : {} }).then(r => r.data),
  createMenu:      (data: Partial<MenuItem>) => api.post('/settings/menus', data).then(r => r.data),
  updateMenu:      (id: string, data: Partial<MenuItem>) => api.put(`/settings/menus/${id}`, data).then(r => r.data),
  deleteMenu:      (id: string) => api.delete(`/settings/menus/${id}`).then(r => r.data),
  getAuditLogs:    (params?: Record<string, string>) => api.get('/settings/audit-logs', { params }).then(r => r.data),
};
