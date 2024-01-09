// import {CreateAccountRequest, PasswordAuthenticateRequest} from "@/models/user/passwordAuth";
// import {ErrorData} from "@/api/base.api";
// import {BaseServiceApplicationError, EvServiceApplicationError} from "@/models/ev/evServiceCommons";

// export interface AuthMethods<E extends BaseServiceApplicationError>{
//   createEmailAccount(createAccountRequest: CreateAccountRequest, onSuccess: (() => void), onFail?: ((error:ErrorData<E> | undefined) => void)):void;
//   authEmailAccount(emailAccount: PasswordAuthenticateRequest, onSuccess: (() => void), onFail?: ((error:ErrorData<E> | undefined) => void)):void;
// }
//
// export interface AuthEmailAccountMethod<E extends BaseServiceApplicationError>{
//   authEmailAccount(emailAccount: PasswordAuthenticateRequest, onSuccess: (() => void), onFail?: ((error:ErrorData<E> | undefined) => void)):void;
// }
//
// export interface CreateEmailAccountMethod<E extends BaseServiceApplicationError>{
//   createEmailAccount(createAccountRequest: CreateAccountRequest, onSuccess: (() => void), onFail?: ((error:ErrorData<E> | undefined) => void)):void;
// }
