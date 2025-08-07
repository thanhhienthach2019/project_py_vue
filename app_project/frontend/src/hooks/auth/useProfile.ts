//src/hooks/useProfile.ts
import { computed } from "vue";
import { useProfileStore } from "@/store/auth/profileStore";
import type { MyProfileUpdate, ChangePassword } from "@/models/auth/user";
import { createWithToastAction } from "@/utils/withToastAction";

export function useProfile() {
    const store = useProfileStore();
    const withToastAction = createWithToastAction();

    const state = {
        profiles: computed(() => store.profile),
        isLoadingProfile: computed(() => store.isLoadingProfile),
        isUpdatingProfile: computed(() => store.isUpdatingProfile),
        isChangingPassword: computed(() => store.isChangingPassword)
    }

    const loaders = {
        fetchProfiles: () => withToastAction(() => store.loadMyProfile())
    }

    const actions = {
        updateProfile: (data: MyProfileUpdate, imageFile?: File) => withToastAction(() => store.updateMyProfile(data, imageFile)),
        changePassword: (payload: ChangePassword) => withToastAction(() => store.changeMyPassword(payload))
    }
    
    return {
        ...state,
        ...loaders,
        ...actions
    }
}