// import {AuthEmailAccountMethod, AuthMethods, CreateEmailAccountMethod} from "@/ev/components/profile/EmailRegister";
// import {EvServiceApplicationError} from "@/models/ev/evServiceCommons";
// import {CreateAccountRequest, PasswordAuthenticateRequest} from "@/models/user/passwordAuth";
// import {ErrorData} from "@/api/base.api";
// import {useEvStore} from "@/store/ev.store";

// export class AuthMethodsImpl implements AuthMethods<EvServiceApplicationError>{
//   public authEmailAccount(emailAccount: PasswordAuthenticateRequest, onSuccess: () => void, onFail: (error:ErrorData<EvServiceApplicationError> | undefined) => void) {
//     useEvStore().authEmailAccount(emailAccount, onSuccess, onFail);
//   }
//   public createEmailAccount(createAccountRequest: CreateAccountRequest, onSuccess: () => void, onFail: (error:ErrorData<EvServiceApplicationError> | undefined) => void) {
//     useEvStore().createEmailAccount(createAccountRequest, onSuccess, onFail);
//   }
// }

// export class CreateEmailAccountMethodImpl implements CreateEmailAccountMethod<EvServiceApplicationError>{
//   public createEmailAccount(createAccountRequest: CreateAccountRequest, onSuccess: () => void, onFail: (error:ErrorData<EvServiceApplicationError> | undefined) => void) {
//     useEvStore().createEmailAccount(createAccountRequest, onSuccess, onFail);
//   }
// }

// export class AuthEmailAccountMethodImpl implements AuthEmailAccountMethod<EvServiceApplicationError>{
//   public authEmailAccount(emailAccount: PasswordAuthenticateRequest, onSuccess: () => void, onFail: (error:ErrorData<EvServiceApplicationError> | undefined) => void) {
//     useEvStore().authEmailAccount(emailAccount, onSuccess, onFail);
//   }
// }


