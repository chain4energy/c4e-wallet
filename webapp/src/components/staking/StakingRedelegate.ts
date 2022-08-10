import i18n from "@/plugins/i18n";

export enum RedelegationDirection {
  TO = 'to',
  FROM = 'from',
}

export function getRedelagatePlaceholder(redelegationDirection: RedelegationDirection) {
  if (redelegationDirection === RedelegationDirection.FROM) {
    return i18n.global.t('STAKING_VIEW.STAKING_POPUP.INPUT.REDELEGATE_FROM_VALIDATOR')
  }
  return i18n.global.t('STAKING_VIEW.STAKING_POPUP.INPUT.REDELEGATE_TO_VALIDATOR')

}
