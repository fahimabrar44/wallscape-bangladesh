import { FastifyInstance } from 'fastify';
import { authenticate, authorize } from '../middleware';

// Auth
import * as auth from '../controllers/authController';

// Categories
import * as categories from '../controllers/categoryController';

// Products
import * as products from '../controllers/productController';

// Orders
import * as orders from '../controllers/orderController';

// Customers
import * as customers from '../controllers/customerController';

// Reviews
import * as reviews from '../controllers/reviewController';

// Blogs
import * as blogs from '../controllers/blogController';

// Projects
import * as projects from '../controllers/projectController';

// Banners
import * as banners from '../controllers/bannerController';

// Pages
import * as pages from '../controllers/pageController';

// Settings
import * as settings from '../controllers/settingController';

// Gallery
import * as gallery from '../controllers/galleryController';

// Notifications
import * as notifications from '../controllers/notificationController';

// Upload
import * as upload from '../controllers/uploadController';

// Contact
import * as contact from '../controllers/contactController';

export async function registerRoutes(app: FastifyInstance) {
  // Health check
  app.get('/api/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  // Auth routes (public for login)
  app.post('/api/auth/login', auth.login);

  // Public routes
  // Categories
  app.get('/api/categories', categories.getCategories);
  app.get('/api/categories/:slug', categories.getCategory);

  // Products
  app.get('/api/products', products.getProducts);
  app.get('/api/products/search', products.searchProducts);
  app.get('/api/products/featured', products.getFeaturedProducts);
  app.get('/api/products/new-arrivals', products.getNewArrivals);
  app.get('/api/products/best-sellers', products.getBestSellers);
  app.get('/api/products/:slug', products.getProduct);
  app.get('/api/products/:id/related', products.getRelatedProducts);

  // Orders (public)
  app.post('/api/orders', orders.createOrder);
  app.get('/api/orders/track', orders.trackOrder);

  // Reviews (public)
  app.get('/api/reviews', reviews.getReviews);
  app.post('/api/reviews', reviews.createReview);

  // Blogs (public)
  app.get('/api/blogs', blogs.getBlogs);
  app.get('/api/blogs/:slug', blogs.getBlog);

  // Projects (public)
  app.get('/api/projects', projects.getProjects);
  app.get('/api/projects/:slug', projects.getProject);

  // Banners (public)
  app.get('/api/banners', banners.getBanners);

  // Pages (public)
  app.get('/api/pages', pages.getPages);
  app.get('/api/pages/:slug', pages.getPage);

  // Settings (public)
  app.get('/api/settings', settings.getSettings);
  app.get('/api/settings/:key', settings.getSetting);

  // Gallery (public)
  app.get('/api/gallery', gallery.getGalleryItems);

  // Contact (public)
  app.post('/api/contact', contact.submitContactForm);

  // Image upload (public for now)
  app.post('/api/upload', upload.uploadImage);
  app.post('/api/upload/multiple', upload.uploadMultipleImages);
  app.delete('/api/upload/:filename', upload.deleteImage);

  // === Admin Routes (authenticated) ===
  app.register(async (adminRoutes) => {
    adminRoutes.addHook('preHandler', authenticate);

    // Auth
    adminRoutes.get('/api/auth/me', auth.getMe);
    adminRoutes.put('/api/auth/profile', auth.updateProfile);
    adminRoutes.put('/api/auth/change-password', auth.changePassword);

    // Admin management (super_admin only) - register sub-routes with authorize hook
    const superAdminRoutes = async (fastify: FastifyInstance) => {
      fastify.addHook('preHandler', authorize('super_admin'));
      fastify.post('/api/admins', auth.createAdmin);
      fastify.get('/api/admins', auth.getAdmins);
      fastify.put('/api/admins/:id', auth.updateAdmin);
      fastify.delete('/api/admins/:id', auth.deleteAdmin);
    };
    adminRoutes.register(superAdminRoutes);

    // Categories
    adminRoutes.post('/api/categories', categories.createCategory);
    adminRoutes.put('/api/categories/:id', categories.updateCategory);
    adminRoutes.delete('/api/categories/:id', categories.deleteCategory);

    // Products
    adminRoutes.post('/api/products', products.createProduct);
    adminRoutes.put('/api/products/:id', products.updateProduct);
    adminRoutes.delete('/api/products/:id', products.deleteProduct);
    adminRoutes.get('/api/products/:id/by-id', products.getProductById);

    // Orders
    adminRoutes.get('/api/admin/orders', orders.getOrders);
    adminRoutes.get('/api/admin/orders/dashboard', orders.getDashboardStats);
    adminRoutes.get('/api/admin/orders/:id', orders.getOrder);
    adminRoutes.put('/api/admin/orders/:id/status', orders.updateOrderStatus);
    adminRoutes.put('/api/admin/orders/:id/payment', orders.verifyPayment);

    // Customers
    adminRoutes.get('/api/admin/customers', customers.getCustomers);
    adminRoutes.get('/api/admin/customers/:id', customers.getCustomer);

    // Reviews
    adminRoutes.get('/api/admin/reviews', reviews.getReviews);
    adminRoutes.put('/api/admin/reviews/:id', reviews.updateReview);
    adminRoutes.put('/api/admin/reviews/:id/approve', reviews.approveReview);
    adminRoutes.delete('/api/admin/reviews/:id', reviews.deleteReview);

    // Blogs
    adminRoutes.post('/api/blogs', blogs.createBlog);
    adminRoutes.put('/api/blogs/:id', blogs.updateBlog);
    adminRoutes.delete('/api/blogs/:id', blogs.deleteBlog);
    adminRoutes.get('/api/blogs/:id/by-id', blogs.getBlogById);

    // Projects
    adminRoutes.post('/api/projects', projects.createProject);
    adminRoutes.put('/api/projects/:id', projects.updateProject);
    adminRoutes.delete('/api/projects/:id', projects.deleteProject);

    // Banners
    adminRoutes.post('/api/banners', banners.createBanner);
    adminRoutes.put('/api/banners/:id', banners.updateBanner);
    adminRoutes.delete('/api/banners/:id', banners.deleteBanner);

    // Pages
    adminRoutes.post('/api/pages', pages.createPage);
    adminRoutes.put('/api/pages/:id', pages.updatePage);
    adminRoutes.delete('/api/pages/:id', pages.deletePage);

    // Settings
    adminRoutes.put('/api/settings', settings.updateSettings);

    // Gallery
    adminRoutes.post('/api/gallery', gallery.createGalleryItem);
    adminRoutes.put('/api/gallery/:id', gallery.updateGalleryItem);
    adminRoutes.delete('/api/gallery/:id', gallery.deleteGalleryItem);

    // Notifications
    adminRoutes.get('/api/admin/notifications', notifications.getNotifications);
    adminRoutes.put('/api/admin/notifications/:id/read', notifications.markAsRead);
    adminRoutes.put('/api/admin/notifications/read-all', notifications.markAllAsRead);
  });
}
