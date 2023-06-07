import ActivateView from "@/views/buyTokens/ActivateView.vue";
import UserProfileView from "@/views/UserProfileView.vue";
import UserProfileTabs from "@/components/profile/UserProfileTabs.vue";

const profileRoutes =
  {
    path: '/profile',
    name: 'Profile',
    component: UserProfileView,
    children: [
      {
        path: '',
        name: 'userProfileTabs',
        component: UserProfileTabs,
      },
      {
        path: 'provideVerificationCode',
        name: 'provideVerificationCode',
        component: ActivateView,
      }
    ]
  };

export default profileRoutes;
