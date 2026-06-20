-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "siteName" TEXT NOT NULL DEFAULT 'Azerbaijan Tourism',
    "siteSlogan" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "seoKeywords" TEXT,
    "defaultLanguage" TEXT NOT NULL DEFAULT 'en',
    "defaultCurrency" TEXT NOT NULL DEFAULT 'USD',
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "contactAddress" TEXT,
    "socialFacebook" TEXT,
    "socialInstagram" TEXT,
    "socialTwitter" TEXT,
    "socialYoutube" TEXT,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "allowRegistration" BOOLEAN NOT NULL DEFAULT true,
    "allowReviews" BOOLEAN NOT NULL DEFAULT true,
    "allowBooking" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theme_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "primaryColor" TEXT NOT NULL DEFAULT '#0A8F6A',
    "secondaryColor" TEXT NOT NULL DEFAULT '#0F4C81',
    "accentColor" TEXT NOT NULL DEFAULT '#F6B73C',
    "bgColor" TEXT NOT NULL DEFAULT '#F8FAFC',
    "textColor" TEXT NOT NULL DEFAULT '#1E293B',
    "cardColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "borderColor" TEXT NOT NULL DEFAULT '#E2E8F0',
    "headerColor" TEXT NOT NULL DEFAULT '#0F4C81',
    "footerColor" TEXT NOT NULL DEFAULT '#1E293B',
    "fontFamily" TEXT NOT NULL DEFAULT 'Geist',
    "headingFont" TEXT NOT NULL DEFAULT 'Geist',
    "fontSize" TEXT NOT NULL DEFAULT '16',
    "lineHeight" TEXT NOT NULL DEFAULT '1.6',
    "borderRadius" TEXT NOT NULL DEFAULT '8',
    "buttonStyle" TEXT NOT NULL DEFAULT 'rounded',
    "cardStyle" TEXT NOT NULL DEFAULT 'shadow',
    "customCss" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "theme_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "details" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_files" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "name" TEXT NOT NULL,
    "altText" TEXT,
    "caption" TEXT,
    "size" INTEGER,
    "mimeType" TEXT,
    "folder" TEXT NOT NULL DEFAULT 'general',
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_items" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT,
    "linkType" TEXT NOT NULL DEFAULT 'internal',
    "target" TEXT NOT NULL DEFAULT '_self',
    "icon" TEXT,
    "menuType" TEXT NOT NULL DEFAULT 'navbar',
    "parentId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_resource_idx" ON "audit_logs"("resource");

-- CreateIndex
CREATE INDEX "media_files_uploadedBy_idx" ON "media_files"("uploadedBy");

-- CreateIndex
CREATE INDEX "media_files_folder_idx" ON "media_files"("folder");

-- CreateIndex
CREATE INDEX "menu_items_menuType_idx" ON "menu_items"("menuType");

-- CreateIndex
CREATE INDEX "menu_items_parentId_idx" ON "menu_items"("parentId");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_files" ADD CONSTRAINT "media_files_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "menu_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
