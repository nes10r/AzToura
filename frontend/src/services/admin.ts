import api from './api';

export const adminService = {
  // Dashboard
  getStats:           () => api.get('/admin/stats').then(r => r.data),
  getRecentBookings:  () => api.get('/admin/recent-bookings').then(r => r.data),
  getPopularDests:    () => api.get('/admin/popular-destinations').then(r => r.data),
  getRevenue:         () => api.get('/admin/revenue').then(r => r.data),

  // Users
  getUsers:           (params?: Record<string, string>) => api.get('/users', { params }).then(r => r.data),
  getUserById:        (id: string) => api.get(`/users/${id}`).then(r => r.data),
  updateUserRole:     (id: string, role: string) => api.patch(`/users/${id}/role`, { role }).then(r => r.data),
  updateUser:         (id: string, data: Record<string, unknown>) => api.patch(`/users/${id}`, data).then(r => r.data),
  deleteUser:         (id: string) => api.delete(`/users/${id}`).then(r => r.data),

  // Destinations
  getDestinations:    (params?: Record<string, string>) => api.get('/destinations', { params }).then(r => r.data),
  getDestinationById: (id: string) => api.get(`/destinations/${id}`).then(r => r.data),
  createDestination:  (data: Record<string, unknown>) => api.post('/destinations', data).then(r => r.data),
  updateDestination:  (id: string, data: Record<string, unknown>) => api.patch(`/destinations/${id}`, data).then(r => r.data),
  deleteDestination:  (id: string) => api.delete(`/destinations/${id}`).then(r => r.data),

  // Tours
  getTours:           (params?: Record<string, string>) => api.get('/tours', { params }).then(r => r.data),
  getTourById:        (id: string) => api.get(`/tours/${id}`).then(r => r.data),
  createTour:         (data: Record<string, unknown>) => api.post('/tours', data).then(r => r.data),
  updateTour:         (id: string, data: Record<string, unknown>) => api.patch(`/tours/${id}`, data).then(r => r.data),
  deleteTour:         (id: string) => api.delete(`/tours/${id}`).then(r => r.data),

  // Hotels
  getHotels:          (params?: Record<string, string>) => api.get('/hotels', { params }).then(r => r.data),
  getHotelById:       (id: string) => api.get(`/hotels/${id}`).then(r => r.data),
  createHotel:        (data: Record<string, unknown>) => api.post('/hotels', data).then(r => r.data),
  updateHotel:        (id: string, data: Record<string, unknown>) => api.patch(`/hotels/${id}`, data).then(r => r.data),
  deleteHotel:        (id: string) => api.delete(`/hotels/${id}`).then(r => r.data),

  // Restaurants
  getRestaurants:     (params?: Record<string, string>) => api.get('/restaurants', { params }).then(r => r.data),
  getRestaurantById:  (id: string) => api.get(`/restaurants/${id}`).then(r => r.data),
  createRestaurant:   (data: Record<string, unknown>) => api.post('/restaurants', data).then(r => r.data),
  updateRestaurant:   (id: string, data: Record<string, unknown>) => api.patch(`/restaurants/${id}`, data).then(r => r.data),
  deleteRestaurant:   (id: string) => api.delete(`/restaurants/${id}`).then(r => r.data),

  // Events
  getEvents:          (params?: Record<string, string>) => api.get('/events', { params }).then(r => r.data),
  getEventById:       (id: string) => api.get(`/events/${id}`).then(r => r.data),
  createEvent:        (data: Record<string, unknown>) => api.post('/events', data).then(r => r.data),
  updateEvent:        (id: string, data: Record<string, unknown>) => api.patch(`/events/${id}`, data).then(r => r.data),
  deleteEvent:        (id: string) => api.delete(`/events/${id}`).then(r => r.data),

  // Blog
  getBlogPosts:       (params?: Record<string, string>) => api.get('/blog', { params }).then(r => r.data),
  getBlogPostById:    (id: string) => api.get(`/blog/${id}`).then(r => r.data),
  createBlogPost:     (data: Record<string, unknown>) => api.post('/blog', data).then(r => r.data),
  updateBlogPost:     (id: string, data: Record<string, unknown>) => api.patch(`/blog/${id}`, data).then(r => r.data),
  deleteBlogPost:     (id: string) => api.delete(`/blog/${id}`).then(r => r.data),

  // Bookings
  getBookings:        (params?: Record<string, string>) => api.get('/bookings', { params }).then(r => r.data),
  getBookingById:     (id: string) => api.get(`/bookings/${id}`).then(r => r.data),
  updateBookingStatus:(id: string, status: string) => api.patch(`/bookings/${id}/status`, { status }).then(r => r.data),

  // Reviews
  getReviews:         (params?: Record<string, string>) => api.get('/reviews', { params }).then(r => r.data),
  deleteReview:       (id: string) => api.delete(`/reviews/${id}`).then(r => r.data),

  // Categories
  getCategories:      () => api.get('/categories').then(r => r.data),
  createCategory:     (data: Record<string, unknown>) => api.post('/categories', data).then(r => r.data),
  deleteCategory:     (id: string) => api.delete(`/categories/${id}`).then(r => r.data),
};
