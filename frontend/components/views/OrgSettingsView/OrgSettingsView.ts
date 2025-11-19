export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  avatar?: string;
  organization_roles?: OrganizationRole[];
}

export interface OrganizationRole {
  id: number;
  name: string;
  description?: string;
  color: string;
  is_active: boolean;
  is_locked: boolean;
  users_count?: number;
  users?: User[];
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  color: string;
  is_active: boolean;
  members?: User[];
}

export interface UserGroup {
  id: number;
  name: string;
  description?: string;
  color: string;
  is_active: boolean;
  users: User[];
}

export interface Client {
  id: number;
  company_name: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  client_type: string;
  is_active: boolean;
  logo_url?: string;
  primary_account_manager?: User;
  secondary_account_managers?: User[];
  created_at: string;
}

export interface ProjectType {
  id: number;
  name: string;
  description?: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  is_system_defined: boolean;
}

export interface OrgProfile {
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  timezone: string;
  logo?: string | null;
}

export interface Tab {
  id: string;
  name: string;
  icon: string;
}

export interface Pagination {
  current_page: number;
  from: number;
  to: number;
  total: number;
  prev_page_url: string | null;
  next_page_url: string | null;
}

export interface Tooltip {
  visible: boolean;
  x: number;
  y: number;
  role: OrganizationRole | null;
  group: UserGroup | null;
}

// Component logic
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'OrgSettingsView',
  setup() {
    const activeTab = ref('org-profile');

    const tabs: Tab[] = [
      { id: 'org-profile', name: 'Company Profile', icon: 'fas fa-building' },
      { id: 'users', name: 'User Management', icon: 'fas fa-users' },
      { id: 'org-roles', name: 'Org. Roles', icon: 'fas fa-user-tag' },
      { id: 'teams', name: 'Teams', icon: 'fas fa-users-cog' },
      { id: 'user-groups', name: 'User Groups', icon: 'fas fa-layer-group' },
      { id: 'clients', name: 'Client Management', icon: 'fas fa-briefcase' },
      { id: 'project-status', name: 'Project Status', icon: 'fas fa-tasks' },
      { id: 'task-status', name: 'Task Status', icon: 'fas fa-check-circle' },
      { id: 'project-types', name: 'Project Types', icon: 'fas fa-folder' },
      { id: 'notifications', name: 'Global Notifications', icon: 'fas fa-bell' },
    ];

    // Load active tab from localStorage
    const loadActiveTab = () => {
      const savedTab = localStorage.getItem('orgSettingsActiveTab');
      if (savedTab && tabs.some((tab) => tab.id === savedTab)) {
        activeTab.value = savedTab;
      }
    };

    // Save active tab to localStorage
    const saveActiveTab = (tabId: string) => {
      localStorage.setItem('orgSettingsActiveTab', tabId);
      activeTab.value = tabId;
    };

    onMounted(() => {
      loadActiveTab();
    });

    return {
      activeTab,
      tabs,
      saveActiveTab,
    };
  },
});
