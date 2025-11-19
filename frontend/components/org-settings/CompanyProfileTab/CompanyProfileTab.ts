import { defineComponent, ref, reactive, onMounted } from 'vue';
import { organizationApi } from '@/composables/api/organizationApi';
import type { OrgProfile } from '@/components/views/OrgSettingsView/OrgSettingsView';

export default defineComponent({
  name: 'CompanyProfileTab',
  setup() {
    const logoInput = ref<HTMLInputElement | null>(null);

    const orgProfile = reactive<OrgProfile>({
      name: '',
      description: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      timezone: 'UTC',
      logo: null,
    });

    const orgProfileLoading = ref(false);
    const orgProfileError = ref('');
    const orgProfileSuccess = ref('');

    const loadOrgProfile = async () => {
      try {
        const response = await organizationApi.getOrgProfile();
        Object.assign(orgProfile, response);
      } catch (error) {
        console.error('Failed to load organization profile:', error);
      }
    };

    const handleOrgProfileSubmit = async () => {
      orgProfileLoading.value = true;
      orgProfileError.value = '';
      orgProfileSuccess.value = '';
      try {
        await organizationApi.updateOrgProfile(orgProfile);
        orgProfileSuccess.value = 'Company profile updated successfully!';
        setTimeout(() => {
          orgProfileSuccess.value = '';
        }, 3000);
      } catch (error: any) {
        orgProfileError.value =
          error.response?.data?.message || 'Failed to update company profile. Please try again.';
      } finally {
        orgProfileLoading.value = false;
      }
    };

    const handleLogoUpload = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
      try {
        const formData = new FormData();
        formData.append('logo', file);
        const response = await organizationApi.updateOrgLogo(formData);
        orgProfile.logo = response.logo;
        orgProfileSuccess.value = 'Logo uploaded successfully!';
        setTimeout(() => {
          orgProfileSuccess.value = '';
        }, 3000);
      } catch (error: any) {
        orgProfileError.value =
          error.response?.data?.message || 'Failed to upload logo. Please try again.';
      }
    };

    const resetOrgProfile = () => {
      loadOrgProfile();
      orgProfileError.value = '';
      orgProfileSuccess.value = '';
    };

    onMounted(() => {
      loadOrgProfile();
    });

    return {
      logoInput,
      orgProfile,
      orgProfileLoading,
      orgProfileError,
      orgProfileSuccess,
      handleOrgProfileSubmit,
      handleLogoUpload,
      resetOrgProfile,
    };
  },
});
