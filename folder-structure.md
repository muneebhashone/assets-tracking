.
├── app
│   ├── (auth)
│   │   ├── layout.tsx
│   │   ├── signin
│   │   │   └── page.tsx
│   │   └── signup
│   │       └── page.tsx
│   ├── (dashboard)
│   │   └── dashboard
│   │       ├── assigns
│   │       │   └── page.tsx
│   │       ├── changelogs
│   │       │   ├── [id]
│   │       │   │   └── page.tsx
│   │       │   └── page.tsx
│   │       ├── company
│   │       │   └── page.tsx
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── profile
│   │       │   └── settings
│   │       │       └── page.tsx
│   │       ├── requested-users
│   │       │   └── page.tsx
│   │       ├── shipment
│   │       │   ├── [id]
│   │       │   │   └── page.tsx
│   │       │   └── page.tsx
│   │       ├── shipment-list
│   │       │   └── page.tsx
│   │       ├── support
│   │       │   ├── [id]
│   │       │   │   └── page.tsx
│   │       │   └── page.tsx
│   │       └── users
│   │           ├── [id]
│   │           │   └── page.tsx
│   │           └── page.tsx
│   ├── forget-password
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── live-location
│   │   └── page.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   ├── reset-password
│   │   └── page.tsx
│   ├── set-password
│   │   └── page.tsx
│   ├── support-request
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── view-shipment
│       ├── layout.tsx
│       └── page.tsx
├── biome.json
├── client-feedbacks
│   └── new-features-and-bug-fixes.docx
├── components
│   ├── admin-dashboard.tsx
│   ├── all-shipment-creation-dropdown.tsx
│   ├── BarChart.tsx
│   ├── breadcrumb.tsx
│   ├── dashboard
│   │   ├── admin-dashboard.tsx
│   │   ├── stat-card.tsx
│   │   └── user-dashboard.tsx
│   ├── dashboard-nav.tsx
│   ├── date-range-picker.tsx
│   ├── error-page
│   │   └── shipment-not-found.tsx
│   ├── fallback
│   │   └── table-fallback.tsx
│   ├── FaqAccordian.tsx
│   ├── FaqSectionBox.tsx
│   ├── Filter.tsx
│   ├── forms
│   │   ├── admin-company-form.tsx
│   │   ├── admin-create-user-form.tsx
│   │   ├── admin-update-shipment-form.tsx
│   │   ├── admin-update-user-form.tsx
│   │   ├── assign-or-deduct-credits-form.tsx
│   │   ├── bulk-shipment-upload.tsx
│   │   ├── changelog-form.tsx
│   │   ├── company-update-form.tsx
│   │   ├── create-assign-form.tsx
│   │   ├── create-support-request.tsx
│   │   ├── permission-update-form.tsx
│   │   ├── personal-information-update-form.tsx
│   │   ├── shipment-creation-form.tsx
│   │   ├── shipment-details-extra-form.tsx
│   │   ├── update-shipment-form.tsx
│   │   ├── upload-profile-form.tsx
│   │   ├── upload-shipment-file-form.tsx
│   │   ├── user-auth-form.tsx
│   │   ├── user-company-form.tsx
│   │   └── user-create-form.tsx
│   ├── google-map
│   │   └── map.tsx
│   ├── Header.tsx
│   ├── HeroSection.tsx
│   ├── Icons
│   │   └── index.tsx
│   ├── icons.tsx
│   ├── kpi
│   ├── labelled-button.tsx
│   ├── layout
│   │   ├── header.tsx
│   │   ├── mobile-sidebar.tsx
│   │   ├── providers.tsx
│   │   ├── react-query-provider.tsx
│   │   ├── sidebar.tsx
│   │   ├── theme-provider.tsx
│   │   └── user-nav.tsx
│   ├── LineChart.tsx
│   ├── LoginButton.tsx
│   ├── MainFooter.tsx
│   ├── Menu.tsx
│   ├── modal
│   │   └── alert-modal.tsx
│   ├── ModalComponent.tsx
│   ├── NavLogo.tsx
│   ├── NotificationCard.tsx
│   ├── order-by-selector.tsx
│   ├── overview.tsx
│   ├── page-client
│   │   ├── AssignsPage.tsx
│   │   ├── ChangelogDetailPage.tsx
│   │   ├── ChangelogListPage.tsx
│   │   ├── CompanyPage.tsx
│   │   ├── CreateShipmentPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ForgetPasswordPage.tsx
│   │   ├── ProfileSettingPage.tsx
│   │   ├── RequestedUserPage.tsx
│   │   ├── ResetPasswordPage.tsx
│   │   ├── SetPasswordPage.tsx
│   │   ├── ShipmentContainer.tsx
│   │   ├── ShipmentDetailPage.tsx
│   │   ├── ShipmentMovement.tsx
│   │   ├── ShipmentPage.tsx
│   │   ├── SupportDetailPage.tsx
│   │   ├── SupportPage.tsx
│   │   ├── UserDetailPage.tsx
│   │   ├── UsersPage.tsx
│   │   └── ViewShipmentPage.tsx
│   ├── pagination
│   │   └── CardViewPagination.tsx
│   ├── PasswordInput.tsx
│   ├── ProtectedCheckbox.tsx
│   ├── ProtectedHeader.tsx
│   ├── SearchBar.tsx
│   ├── SectionHeading.tsx
│   ├── SwitchMutation.tsx
│   ├── tables
│   │   ├── assings-table
│   │   │   ├── assigns.tsx
│   │   │   ├── cell-action.tsx
│   │   │   └── columns.tsx
│   │   ├── changelog-table
│   │   │   ├── changelog-table.tsx
│   │   │   └── columns.tsx
│   │   ├── company-table
│   │   │   ├── cell-action.tsx
│   │   │   ├── columns.tsx
│   │   │   └── company-table.tsx
│   │   ├── requested-user-table
│   │   │   ├── cell-action.tsx
│   │   │   ├── columns.tsx
│   │   │   └── requested-user.tsx
│   │   ├── shipment-container-table
│   │   │   ├── columns.tsx
│   │   │   └── shipment-container-table.tsx
│   │   ├── shipment-movement-table
│   │   │   ├── columns.tsx
│   │   │   └── shipment-movement-table.tsx
│   │   ├── shipment-table
│   │   │   ├── cell-action.tsx
│   │   │   ├── columns.tsx
│   │   │   └── shipment-table.tsx
│   │   ├── support-table
│   │   │   ├── cell-action.tsx
│   │   │   ├── columns.tsx
│   │   │   └── support.tsx
│   │   └── users-table
│   │       ├── cell-action.tsx
│   │       ├── columns.tsx
│   │       └── users.tsx
│   ├── TestimonialCardSection.tsx
│   ├── ui
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── combobox.tsx
│   │   ├── command.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── heading.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── menubar.tsx
│   │   ├── modal.tsx
│   │   ├── multi-select.tsx
│   │   ├── pagination.tsx
│   │   ├── popover.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toaster.tsx
│   │   ├── toast.tsx
│   │   ├── tooltip.tsx
│   │   └── use-toast.ts
│   ├── UploadedFilesView.tsx
│   └── wrapper
│       └── permission-wrapper.tsx
├── components.json
├── constants
│   └── data.ts
├── documentation
│   └── changelog-api-docs.md
├── ecosystem.config.js
├── folder-structure.md
├── hooks
│   ├── useQueryUpdater.tsx
│   └── useShipmentKPIs.ts
├── lib
│   ├── form-schema.ts
│   └── utils.ts
├── LICENSE
├── middleware.ts
├── next.config.js
├── next-env.d.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── public
│   ├── favicon
│   │   ├── apple-touch-icon.png
│   │   ├── favicon.ico
│   │   ├── site.webmanifest
│   │   ├── web-app-manifest-192x192.png
│   │   └── web-app-manifest-512x512.png
│   ├── fonts
│   │   ├── Poppins-Bold.ttf
│   │   ├── Poppins-Medium.ttf
│   │   └── Poppins-Regular.ttf
│   └── images
│       ├── animated-loc.svg
│       ├── bg-image.png
│       ├── chart.png
│       ├── containerbanner.png
│       ├── dashboardimage.png
│       ├── features-notifications.png
│       ├── fotterlogo.png
│       ├── location.png
│       ├── logo.png
│       ├── midsectionbg.png
│       ├── navlogo.png
│       ├── noti1.png
│       ├── noti2.png
│       ├── noti3.png
│       ├── noti4.png
│       ├── notificationcard.png
│       ├── notification.png
│       └── settings.png
├── README.md
├── services
│   ├── admin
│   │   ├── assigns.mutation.ts
│   │   ├── assigns.queries.ts
│   │   ├── shipment.mutations.ts
│   │   ├── support.mutations.ts
│   │   ├── support.queries.ts
│   │   └── user.mutations.ts
│   ├── auth.mutations.ts
│   ├── auth.services.ts
│   ├── changelog.mutations.ts
│   ├── changelog.queries.ts
│   ├── companies.mutations.ts
│   ├── companies.queries.ts
│   ├── searates.queries.ts
│   ├── shipment.mutations.ts
│   ├── shipment.queries.ts
│   ├── tracking.mutations.ts
│   ├── types.common.ts
│   ├── upload.mutations.ts
│   ├── user.mutations.ts
│   └── user.queries.ts
├── tailwind.config.ts
├── tsconfig.json
├── types
│   ├── api.types.ts
│   ├── messgaes.ts
│   ├── services
│   │   ├── auth.types.ts
│   │   ├── changelog.types.ts
│   │   └── shipment.types.ts
│   └── user.types.ts
└── utils
    ├── api.utils.ts
    ├── auth.utils.ts
    ├── common.utils.ts
    ├── constants.ts
    ├── shipment.utils.ts
    └── user.utils.ts

65 directories, 257 files
