import ActivateView from "@/views/buyTokens/ActivateView.vue";
import UserProfileView from "@/views/UserProfileView.vue";
import UserProfileTabs from "@/components/profile/UserProfileTabs.vue";
import ProvideVerificationCodeView from "@/views/buyTokens/ProvideVerificationCodeView.vue";

const profileRoutes =
  {
    path: '/profile',
    name: 'Profile',
    component: UserProfileView,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'userProfileTabs',
        component: UserProfileTabs,
        meta: {
          requiresAuth: true
        },
      }
    ]
  };

export default profileRoutes;
