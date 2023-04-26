import BuyTokensView from '@/views/BuyTokensView.vue';
import AccountView from "@/views/buyTokens/AccountView.vue";
import InfoView from "@/views/buyTokens/InfoView.vue";
import EmailRegistrationvView from "@/views/buyTokens/EmailRegistrationvView.vue";
import KeplrRegistrationView from "@/views/buyTokens/KeplrRegistrationView.vue";
import MetamaskRegistrationvView from "@/views/buyTokens/MetamaskRegistrationvView.vue";

const buyTokensRoutes = {
  path: '/buyTokens',
  name: 'buyTokens',
  component: BuyTokensView,
  children: [
    {
      path: '',
      name: 'airdropInfo',
      component: InfoView,
    },
    {
      path: 'accountType',
      name: 'accountType',
      component: AccountView,
    },
    {
      path: 'emailRegistration',
      name: 'emailRegistration',
      component: EmailRegistrationvView,
    },
    {
      path: 'keplrRegistration',
      name: 'keplrRegistration',
      component: KeplrRegistrationView,
    },
    {
      path: 'metamaskRegistration',
      name: 'metamaskRegistration',
      component: MetamaskRegistrationvView,
    }
  ]
};
export default buyTokensRoutes;
