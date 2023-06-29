import BuyTokensView from '@/views/BuyTokensView.vue';
import InfoView from "@/views/buyTokens/InfoView.vue";
import ActivateView from "@/views/buyTokens/ActivateView.vue";
import PaymentConfirmationView from "@/views/buyTokens/PaymentConfirmationView.vue";
import FiatPaymentConfirmationView from "@/views/buyTokens/FiatPaymentConfirmationView.vue";

const buyTokensRoutes = {
  path: '/buyTokens',
  name: 'buyTokens',
  component: BuyTokensView,
  children: [
    {
      path: '',
      name: 'publicSaleInfo',
      component: InfoView,
    },
    // {
    //   path: 'accountType',
    //   name: 'accountType',
    //   component: AccountView,
    // },
    // {
    //   path: 'emailRegistration',
    //   name: 'emailRegistration',
    //   component: EmailRegistrationvView,
    // },
    // {
    //   path: 'emailLogin',
    //   name: 'emailLogin',
    //   component: EmailLoginView,
    // },
    // {
    //   path: 'keplrRegistration',
    //   name: 'keplrRegistration',
    //   component: KeplrRegistrationView,
    // },
    // {
    //   path: 'metamaskRegistration',
    //   name: 'metamaskRegistration',
    //   component: MetamaskRegistrationvView,
    // },
    {
      path: 'activate',
      name: 'activate',
      component: ActivateView,
    },
    {
      path: 'confirmation',
      name: 'paymentConfirmation',
      component: PaymentConfirmationView
    },
    {
      path: 'fiatConfirmation',
      name: 'fiatPaymentConfirmation',
      component: FiatPaymentConfirmationView
    }
  ]
};
export default buyTokensRoutes;
